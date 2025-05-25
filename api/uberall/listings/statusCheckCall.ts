import {APIResponse} from 'playwright'
import BaseCall, {Endpoint} from '../baseCall'
import {StatusCheck} from '../../../models/listings/statusCheckModel'

class StatusCheckCall extends BaseCall {
    constructor() {
        super()
    }

    private statusCheckToRecord(statusCheck: StatusCheck): Record<string, string> {
        return {
            country: statusCheck.country,
            name: statusCheck.name,
            street: statusCheck.street,
            zip: statusCheck.zip
        }
    }

    async performStatusCheck(statusCheck: StatusCheck): Promise<{ token: string, id: number }> {
        const statusCheckRecord = this.statusCheckToRecord(statusCheck)
        const apiUrl = `/api/${Endpoint.STATUS_CHECK}`
        const response: APIResponse = await this.performPost(
            JSON.stringify(statusCheckRecord), apiUrl,
            `A Status-Check for ${JSON.stringify(statusCheckRecord)} was performed`
        );
        const responseBody = await response.json()
        return {
            token: responseBody.response.searchData.token,
            id: responseBody.response.searchData.id
        }
    }

    async getDirectorySearchData(directory: string, token: string, id: number): Promise<any> {
        const queryParameters = new Map<string, string>([
            ['directory', directory],
            ['token', token]
        ])
        return await this.getModel(queryParameters, Endpoint.STATUS_CHECK, this.privateKey, `/${id}`, true)
    }
}

export default StatusCheckCall
