import BaseCall, {Endpoint} from '../baseCall'
import {APIResponse} from 'playwright'
import Data from '../data'
import {ApiEnvironmentHelper} from "../apiEnvironmentHelper";

class NearMeCheckCall extends BaseCall {
    private data: Data

    constructor() {
        super()
        this.data = new Data()
    }

    private nearMeCheckToRecord(data?: NearMeCheckData): Record<string, unknown> {
        if (!data) {
            throw new Error('NearMeCheckData is required')
        }
        return {
            country: data.country,
            name: data.name,
            streetAndNo: data.streetAndNo,
            zip: data.zip,
            categoryId: data.categoryId
        }
    }

    async performNearMeCheck(overrides?: Partial<NearMeCheckData>): Promise<APIResponse> {
        const nearMeCheck = { ...new Data().newNearMeCheck(), ...overrides };
        const nearMeCheckRecord = this.nearMeCheckToRecord(nearMeCheck);
        const hardcodedUrl = 'https://near-me-check.uberall.com/api/';

        const response = await this.performPost(
            JSON.stringify(nearMeCheckRecord),
            Endpoint.NEAR_ME_CHECK,
            `A Near Me Check for ${JSON.stringify(nearMeCheckRecord)} was performed`,
            {
                baseURL: hardcodedUrl,
                timeout: 60000,
                publicKey: ApiEnvironmentHelper.getNearMeCheckPublicKey(),
            },
        );

        if (response.status() !== 200) {
            console.log(`Near Me Check failed with status ${response.status()} and message: ${response.statusText()}`);
        }

        return response;
    }

    async getNearMeCheckResults(searchId: string): Promise<unknown> {
        const queryParameters = new Map<string, string>([
            ['searchId', searchId]
        ])

        return await this.getModel(
            queryParameters,
            Endpoint.NEAR_ME_CHECK,
            this.publicKey,
            '/results'
        )
    }
}

interface NearMeCheckData {
    country?: string
    name?: string
    streetAndNo?: string
    zip?: string
    categoryId?: number
}

export default NearMeCheckCall