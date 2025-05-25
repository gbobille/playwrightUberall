import {ApiEnvironmentHelper} from "../apiEnvironmentHelper"
import {APIResponse} from "playwright"
import BaseCall, {Endpoint} from "../baseCall";

export class LocationCall {
    private apiEnvironmentHelper: ApiEnvironmentHelper
    private baseCall: BaseCall

    constructor() {
        this.apiEnvironmentHelper = new ApiEnvironmentHelper()
        this.baseCall = new BaseCall(this.apiEnvironmentHelper)
    }

    async getLocationMap(locationId: number, privateKey: string = this.baseCall.privateKey): Promise<APIResponse | Map<string, object>> {
        const queryParameters = new Map()
        const endpoint = Endpoint.LOCATIONS
        return await this.baseCall.getModel(queryParameters, endpoint, privateKey, `/${locationId}`, true)
    }

    async getLocationListingsUrl(locationId: number, directory: string, privateKey: string = this.baseCall.privateKey): Promise<string> {
        const location = await this.getLocationMap(locationId, privateKey) as any
        const urls = location.response.location.listings
            .filter((listing: any) => listing.type === directory)
            .map((listing: any) => listing.listingUrl)
        return urls[0]
    }
}
