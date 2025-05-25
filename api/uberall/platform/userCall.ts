import BaseCall, {Endpoint} from '../baseCall'
import Data from '../data'

export class UserCall {
    private static PASS = process.env.AUTHENTICATION_PASS
    private static baseCall = new BaseCall();

    static async ensureAdminUser(email: string, removedFeatures: string[] = [], removedLocWriteFeatures: string[] = []): Promise<number | Map<string, any>> {
        if (await this.userExists(email)) {
            return await this.getUserId(email)
        }
        const additionalFields = {role: 'ADMIN'}
        const userId = await this.createUser(email, additionalFields, removedFeatures, removedLocWriteFeatures)
        console.log(`User with email ${email} was successfully created with ID ${userId}`)
        return userId
    }

    static async ensureMultiBusinessManager(email: string, businesses: number[], removedFeatures: string[] = ['INBOX_APPROVAL'], removedLocWriteFeatures: string[] = []): Promise<number | Map<string, any>> {
        const additionalFields = {role: 'ACCOUNT_MANAGER', managedBusinesses: businesses}
        return await this.ensureAccountOrBusinessManager(email, additionalFields, removedFeatures, removedLocWriteFeatures)
    }

    static async ensureBusinessManager(email: string, businesses: number[], removedFeatures: string[] = ['INBOX_APPROVAL'], removedLocWriteFeatures: string[] = []): Promise<number | Map<string, any>> {
        const additionalFields = {role: 'BUSINESS_MANAGER', managedBusinesses: businesses}
        return await this.ensureAccountOrBusinessManager(email, additionalFields, removedFeatures, removedLocWriteFeatures)
    }

    private static async ensureAccountOrBusinessManager(email: string, additionalFields: any, removedFeatures: string[], removedLocWriteFeatures: string[]): Promise<number | Map<string, any>> {
        if (await this.userExists(email)) {
            await this.deleteUser(email)
        }
        return await this.createUser(email, additionalFields, removedFeatures, removedLocWriteFeatures)
    }

    static async ensureLocationManager(email: string, businesses: number, locations: number[], removedFeatures: string[] = ['ADS_READ', 'ADS_WRITE', 'LOCATION_STATUS_CHANGE', 'INBOX_APPROVAL', 'UPGRADE'], removedLocWriteFeatures: string[] = []): Promise<number | Map<string, any>> {
        if (await this.userExists(email)) {
            return await this.getUserId(email)
        }
        const additionalFields = {role: 'LOCATION_MANAGER', managedBusinesses: businesses, managedLocations: locations}
        return await this.createUser(email, additionalFields, removedFeatures, removedLocWriteFeatures)
    }

    private static async createUser(email: string, additionalFields: Record<string, any> = {}, removedFeatures: string[] = [], removedLocWriteFeatures: string[] = []): Promise<number | Map<string, any>> {
        try {
            const user = {...new Data().newUser(), ...additionalFields, email, password: this.PASS};
            user.features = user.features.filter((feature: string) => !removedFeatures.includes(feature));
            user.featuresDetailed.LOCATION_WRITE = user.featuresDetailed.LOCATION_WRITE.filter((feature: string) => !removedLocWriteFeatures.includes(feature));

            const json = JSON.stringify(user)
            return await this.baseCall.createModel(json, Endpoint.USERS, email);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error
        }
    }

    static async deleteUser(email: string): Promise<any> {
        await this.baseCall.deleteModel(email, Endpoint.USERS)
    }

    private static async userExists(email: string, endpoint: string = Endpoint.USERS): Promise<boolean> {
        return await this.baseCall.modelExists(email, endpoint)
    }

    static async getUserModel(userId: number, privateKey: string = this.baseCall.privateKey): Promise<any> {
        const queryParameters = new Map()
        const endpoint = Endpoint.USERS
        return await this.baseCall.getModel(queryParameters, endpoint, privateKey, `/${userId}`, true);
    }

    private static async getUserId(email: string, privateKey: string = this.baseCall.privateKey): Promise<any> {
        const queryParameters = new Map()
        const endpoint = Endpoint.USERS
        return await this.baseCall.getModel(queryParameters, endpoint, privateKey, `/${email}`, true);
    }

}

export default UserCall