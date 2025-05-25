import {ApiEnvironmentHelper} from "../apiEnvironmentHelper"
import BaseCall, {Endpoint} from "../baseCall"

export class MessageKeysCall {
    private apiEnvironmentHelper: ApiEnvironmentHelper
    private baseCall: BaseCall

    constructor() {
        this.apiEnvironmentHelper = new ApiEnvironmentHelper()
        this.baseCall = new BaseCall(this.apiEnvironmentHelper)
    }

    async getCountryCodeFromTranslation(countryCode: string, privateKey: string = this.baseCall.privateKey, language = 'en'): Promise<string> {
        const endpoint = Endpoint.MESSAGE_KEYS
        const lowerCaseCountryCode = countryCode.toString().toLowerCase()
        const queryParameters = new Map<string, any>([
            ['query', `country.name.${lowerCaseCountryCode}`],
            ['language', language]
        ])
        const countryCodeTranslation = await this.baseCall.getModel(queryParameters, endpoint, privateKey, "", true)
        const entries = new Map(Object.entries(countryCodeTranslation)).entries();
        const firstEntry = entries.next().value;
        return firstEntry ? firstEntry[1] : undefined;    }
}