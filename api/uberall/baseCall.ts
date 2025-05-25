import {APIRequestContext, APIResponse, request} from 'playwright'
import {ApiEnvironmentHelper} from './apiEnvironmentHelper'

type RequestMethod = (url: string, options?: any) => Promise<APIResponse>

export default class BaseCall {
    protected apiHelper: ApiEnvironmentHelper
    protected baseApiUrl: string
    protected contentType: string
    privateKey: string
    publicKey : string

    constructor(apiHelper: ApiEnvironmentHelper = new ApiEnvironmentHelper()) {
        this.apiHelper = apiHelper
        this.baseApiUrl = process.env.BASE_URL as string
        this.contentType = 'application/json'
        this.privateKey = ApiEnvironmentHelper.get1098PrivateKey()
        this.publicKey = ''
    }

    // Method log the API method and URL
    private static logApiMethodAndUrl(baseApiUrl: string, methodName: string, method: RequestMethod, url: string, options?: any): Promise<APIResponse> {
        console.log(`${methodName.toUpperCase()} ${baseApiUrl}${url}`)
        return method(url, options)
    }

    // Method to create an API context with the base URL, content type, and private key
    static async createApiContext(baseApiUrl: string, contentType: string, privateKey: string, publicKey: string = ''): Promise<APIRequestContext> {
        const context = await request.newContext({
            baseURL: baseApiUrl,
            extraHTTPHeaders: {
                'privateKey': privateKey,
                'publicKey': publicKey,
                'Cache-Control': 'no-cache',
                'Content-Type': contentType
            },
            timeout: 80000,
            ignoreHTTPSErrors: true
        })

        const methods = ['get', 'post', 'delete', 'put', 'patch'] as const
        methods.forEach(method => {
            const originalMethod = context[method].bind(context)
            context[method] = (url: string, options?: any) =>
                BaseCall.logApiMethodAndUrl(baseApiUrl, method, originalMethod, url, options)
        })

        return context
    }

    // Method to create an API context with headers
    async createApiContextWithHeaders(base: any , headers: any): Promise<APIRequestContext> {
        return request.newContext({
            baseURL: base,
            extraHTTPHeaders: headers
        })
    }

    // Method to create an API context with only a base URL
    async createApiContextURLOnly(base: string): Promise<any> {
        return request.newContext({
            baseURL: base
        })
    }

    // Method to assert that the response is successful
    async assertSuccessfulResponse(response: any) {
        if (response.status && typeof response.status === 'function') {
            const status = response.status();
            if (status < 200 || status >= 300) {
                const responseBody = await response.text();
                throw new Error(`Request failed with status code ${status}. Response: ${responseBody}`);
            }
        } else if (response.status) {
            const status = response.status;
            if (status < 200 || status >= 300) {
                const responseBody = await response.text();
                throw new Error(`Request failed with status code ${status}. Response: ${responseBody}`);
            }
        } else {
            throw new Error('Response does not have a status method or property');
        }
    }

    // Method to perform a GET request with optional query parameters and return the response as a Map
    async getRequest(apiContext: any, path: string, data?: any): Promise<any> {
        const queryString = data ? ` with data: ${JSON.stringify(data)}` : ''
        console.log(`GET request to: ${path}${queryString}`)
        const response = await apiContext.get(path, data ? {data} : undefined)
        await this.assertSuccessfulResponse(response)
        const responseBody = await response.json()
        return responseBody
    }

    //Method to perform a GET request that retrieves HTML instead of JSON
    async getRequest_responseHTML(apiContext: any, path: string, data?: any): Promise<any> {
        const queryString = data ? ` with data: ${JSON.stringify(data)}` : ''
        console.log(`GET request to: ${path}${queryString}`)
        const response = await apiContext.get(path, data ? {data} : undefined)
        await this.assertSuccessfulResponse(response)
        return response.body()
    }

    // Method to perform a POST request with the option to allow errors
    async postRequest(apiContext: any, path: any, data: any, allowErrors = false): Promise<any> {
        const response = await apiContext.post(path, {data})
        const contentType = response.headers()['content-type']

        if (allowErrors) {
            if (contentType && contentType.includes('application/json')) {
                return await response.json()
            } else {
                return await response.text()
            }
        } else {
            if (!response.ok) {
                await this.assertSuccessfulResponse(response)
            }
            if (contentType && contentType.includes('application/json')) {
                return await response.json()
            } else {
                return await response.text()
            }
        }
    }

    // Method to perform a POST request with a JSON body and return the response as a Map
    async performPost(json: string, endpoint: string, logMessage: string,
        options: { baseURL?: string; timeout?: number; publicKey?: string } = { timeout: 60000 }
    ): Promise<APIResponse> {
        const { baseURL = this.baseApiUrl, publicKey = this.publicKey } = options;
        const context = await BaseCall.createApiContext(baseURL, 'application/json', this.privateKey, publicKey)
        console.log(logMessage);
        return await context.post(endpoint, {
            data: json
        })
    }

    // Create a model and return the ID
    async createModel(json: string, endpoint: string, modelName: string, urlSuffix = '', privateKey = this.privateKey, returnMap = false): Promise<number | Map<string, any>> {
        const context = await BaseCall.createApiContext(this.baseApiUrl, this.contentType, privateKey, this.publicKey)
        const response = await context.post(`/api/${endpoint}${urlSuffix}`, {data: json})
        await this.assertSuccessfulResponse(response)
        console.log(`${modelName} was created.`)
        return returnMap ? this.retrieveCreatedModelMap(response, endpoint) : this.retrieveCreatedModelId(response, endpoint)
    }

    // Method to perform a DELETE request
    async deleteRequest(apiContext: APIRequestContext, path: string, retry = false, urlSuffix = ''): Promise<any> {
        let response = await apiContext.delete(path)
        if (!response.ok) {
            if (retry) {
                await new Promise(resolve => setTimeout(resolve, 15000))
                response = await apiContext.delete(`${path}${urlSuffix}`)
            }
            if (!response.ok) {
                if (response.status() === 500) {
                    const responseBody = await response.text()
                    console.error(`Failed to delete resource at ${path}: ${response.statusText()}\nResponse body: ${responseBody}`)
                }
                throw new Error(`Failed to delete resource at ${path}: ${response.statusText()}`)
            }
        }
        const responseBody = await response.json()
        return responseBody
    }

    // Delete a model by Identifier
    async deleteModel(identifier: string | number, endpoint: string, privateKey = this.privateKey, urlSuffix = ''): Promise<any> {
        try {
            const context = await BaseCall.createApiContext(this.baseApiUrl, this.contentType, privateKey);

            // Use the identifier directly if it's already a number, otherwise retrieve the model ID
            const modelId = typeof identifier === 'number' ? identifier : await this.getModelId(identifier.toString(), endpoint, privateKey);

            // Perform the delete request
            const response = await this.deleteRequest(context, `/api/${endpoint}/${modelId}`, true, urlSuffix);
            await this.assertSuccessfulResponse(response);

            console.log(`${endpoint}: ${identifier} was deleted.`);
            return response;
        } catch (error) {
            const err = error as Error;
            if (err.message.includes('Cannot read properties of undefined')) {
                console.log(`Model with identifier ${identifier} does not exist.`);
            } else {
                throw err;
            }
        }
    }

    // Method to perform a PUT request
    async putRequest(path: string, requestBody: any, parameter?: string, token?: string): Promise<any> {
        const putContext = await request.newContext({
            baseURL: process.env.BASE_URL
        })
        let fullPath = path
        if (parameter && token) {
            fullPath = `${path}/${parameter}?access_token=${token}`
        }
        const response = await putContext.put(fullPath, {data: requestBody})
        const responseBody = await response.json()
        return JSON.parse(JSON.stringify(responseBody))
    }

    // Method to perform a PATCH request
    async patchRequest(apiContext: any, path: any, requestBody: any): Promise<APIResponse> {
        const response = await apiContext.patch(`${path}`, {data: requestBody})
        const responseBody = await response.json()
        return responseBody
    }

    // Method to get a model by query parameters
    async getModel(queryParameters: Map<string, any> = new Map(), endpoint: string, privateKey = this.privateKey, urlSuffix = '', returnMap = false): Promise<APIResponse | Map<string, any>> {
        const context = await BaseCall.createApiContext(this.baseApiUrl, this.contentType, privateKey)
        const params = Object.fromEntries(queryParameters)
        const queryString = new URLSearchParams(params).toString()
        const url = `/api/${endpoint}${urlSuffix}${queryString ? '?' + queryString : ''}`
        const response = await context.get(url)
        return returnMap ? await response.json() : response
    }

    // Method to get a model ID by identifier
    async getModelId(identifier: string, endpoint: string, privateKey = this.privateKey): Promise<number> {
        // Validate that the endpoint is a valid key in the Endpoint enum
        if (!Object.values(Endpoint).includes(endpoint as Endpoint)) {
            throw new Error(`Invalid endpoint: ${endpoint}`);
        }

        const queryParameters = new Map([['query', identifier]]);
        const response = await this.getModel(queryParameters, endpoint, privateKey)
        const jsonResponse = await (response as APIResponse).json()

        // Retrieve endpoint details
        const endpointKey = endpoint as keyof typeof endpointDetailsMap
        const endpointDetails = endpointDetailsMap[endpointKey]

        if (!endpointDetails || !endpointDetails.response) {
            throw new Error(`Invalid endpoint or missing response key for endpoint: ${endpoint}`)
        }

        // Access the response key and retrieve the ID
        const responseKey = endpointDetails.response
        if (!jsonResponse.response[responseKey] || !jsonResponse.response[responseKey][0]) {
            console.log(`No data found for identifier: ${identifier} in endpoint: ${endpoint}`)
        }

        return jsonResponse.response[responseKey][0].id
    }

    async modelExists(identifier: string, endpoint: string, privateKey = this.privateKey): Promise<boolean> {
        const queryParameters = new Map([['query', identifier]])
        const response = await this.getModel(queryParameters, endpoint, privateKey)
        await this.assertSuccessfulResponse(response as APIResponse)
        const jsonResponse = await (response as APIResponse).json()
        return jsonResponse.response[endpoint].length > 0
    }

    // Method to get a model Id by identifier
    private async retrieveCreatedModelId(response: APIResponse, endpoint: string): Promise<number> {
        const jsonResponse = await response.json()
        const endpointDetails = endpointDetailsMap[endpoint as Endpoint]
        switch (endpoint) {
            case 'socialposts':
            case 'payment/invoice-payment-information':
            case 'templates':
            case 'auto-response/rules':
            case 'location-groups':
            case 'sales-partners/webhooks':
                return jsonResponse.response.id
            default:
                return jsonResponse.response[endpointDetails.singular].id
        }
    }

    // Method to get a model Map by identifier
    private async retrieveCreatedModelMap(response: APIResponse, endpoint: string): Promise<Map<string, any>> {
        const jsonResponse = await response.json()
        switch (endpoint) {
            case 'search':
                return new Map([
                    ['id', jsonResponse.response.searchData.id],
                    ['token', jsonResponse.response.searchData.token]
                ])
            case 'near-me-check':
                return new Map([
                    ['token', jsonResponse.token],
                    ['id', jsonResponse.id]
                ])
            default:
                return new Map([['id', jsonResponse.response[endpoint].id]])
        }
    }

    // Method to get an access token using provided credentials
    async getAccessToken(email: any, password: any): Promise<string> {
        console.log(`GET Access Token from: ${email} with password: ${password}`)
        const loginContext = await request.newContext({
            baseURL: this.baseApiUrl,
        })

        let attempts = 0
        const maxAttempts = 3
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

        while (attempts < maxAttempts) {
            const response = await loginContext.post('/api/users/login', {
                data: {email, password}
            })

            if (response.ok()) {
                const responseBody = await response.json()
                return responseBody.response.access_token
            } else if (response.status() === 429) {
                console.warn(`Received 429 Too Many Requests. Retrying in 2 seconds...`)
                await delay(2000) // Wait for 2 seconds before retrying
                attempts++
            } else {
                throw new Error(`Failed to get access token: ${response.status()} ${response.statusText()}`)
            }
        }
        throw new Error(`Failed to get access token after ${maxAttempts} attempts due to 429 Too Many Requests.`)
    }
}

export enum Endpoint {
    BUSINESSES = "businesses",
    LOCATIONS = "locations",
    USERS = "users",
    STATUS_CHECK = 'search',
    MESSAGE_KEYS = 'message-keys',
    WEBHOOKS = 'sales-partners/webhooks',
    LOCATION_GROUPS = 'location-groups',
    LOCATION_CATEGORIES = 'categories',
    NEAR_ME_CHECK = 'near-me-check'
}

class EndpointDetails {
    constructor(public url: string, public singular: string, public response: string = url) {
        this.url = url
        this.singular = singular
        this.response = response
    }
}

const endpointDetailsMap: Record<Endpoint, EndpointDetails> = {
    [Endpoint.BUSINESSES]: new EndpointDetails("businesses", "business", "businesses"),
    [Endpoint.LOCATIONS]: new EndpointDetails("locations", "location", "locations"),
    [Endpoint.USERS]: new EndpointDetails("users", "user", "users"),
    [Endpoint.STATUS_CHECK]: new EndpointDetails("search", "search", "search"),
    [Endpoint.MESSAGE_KEYS]: new EndpointDetails("message-keys", "message-keys", "message-keys"),
    [Endpoint.LOCATION_CATEGORIES]: new EndpointDetails("categories", "category",   "category"),
    [Endpoint.WEBHOOKS]: new EndpointDetails("sales-partners/webhooks", "", "webhook"),
    [Endpoint.LOCATION_GROUPS]: new EndpointDetails("location-groups", "locationGroups", "locationGroups"),
    [Endpoint.NEAR_ME_CHECK]: new EndpointDetails("near-me-check", "near-me-check", "near-me-check"),
}

export {BaseCall}