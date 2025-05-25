import BaseCall, { Endpoint } from '../baseCall'
import Data from '../data'

interface LocationGroupResponse {
    response: {
        locationGroups: Array<{
            name: string
            id: number
        }>
    }
}

export class LocationGroupCall extends BaseCall {

    async ensureLocationGroup(): Promise<number | Map<string, unknown>> {
        const locationGroup = new Data().newLocationGroup()
        return await this.createLocationGroup(locationGroup)
    }

    private async createLocationGroup(locationGroup: Record<string, unknown>): Promise<number | Map<string, unknown>> {
        const json = JSON.stringify(locationGroup)
        return await this.createModel(
            json,
            Endpoint.LOCATION_GROUPS,
            `A Location Group with ${locationGroup.name} has been created`
        )
    }

    async deleteLocationGroup(locationGroupName: string): Promise<void> {
            await this.deleteModel(locationGroupName, Endpoint.LOCATION_GROUPS)
    }

    async getLocationGroupIdByName(locationGroupName: string): Promise<number[]> {
        const queryParameters = new Map<string, unknown>([
            ['query', `${locationGroupName}`]
        ])

        const response = await this.getModel(queryParameters, Endpoint.LOCATION_GROUPS, this.privateKey, "", true) as unknown as LocationGroupResponse
        const jsonResponse = response.response

        return jsonResponse.locationGroups
            .filter((group) => group.name === locationGroupName)
            .map((group) => group.id)
    }
}

export default LocationGroupCall
