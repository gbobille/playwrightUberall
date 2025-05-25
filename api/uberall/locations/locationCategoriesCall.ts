import {ApiEnvironmentHelper} from "../apiEnvironmentHelper"
import BaseCall, {Endpoint} from "../baseCall";

export class LocationCategoriesCall {
    private apiEnvironmentHelper: ApiEnvironmentHelper
    private baseCall: BaseCall

    constructor() {
        this.apiEnvironmentHelper = new ApiEnvironmentHelper()
        this.baseCall = new BaseCall(this.apiEnvironmentHelper)
    }

    async getCategoryNameFromId(categoryId: number, privateKey: string = this.baseCall.privateKey, language = 'en'): Promise<string> {
        const endpoint = Endpoint.LOCATION_CATEGORIES
        const queryParameters = new Map<string, any>([
            ['categories', categoryId],
            ['language', language]
        ])
        const category = await this.baseCall.getModel(queryParameters, endpoint, privateKey, "", true) as any
        const results = category.response.results
        return results[0].name
    }
}