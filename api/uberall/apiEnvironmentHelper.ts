export class ApiEnvironmentHelper {
    private environment: string

    constructor() {
        this.environment = process.env.ENVIRONMENT || 'dev'
    }

    static get1098PrivateKey(): string {
        switch (process.env.ENVIRONMENT) {
            case 'sandbox':
                return process.env.SANDBOX_API_PRIVATE_KEY || ''
            case 'dev':
                return process.env.API_PRIVATE_KEY || ''
            case 'production':
            case 'app':
            case 'prod':
                return process.env.API_PRODUCTION_KEY || ''
            default:
                return process.env.API_PRIVATE_KEY || ''
        }
    }

    static get1098ChildPrivateKey(): string {
        switch (process.env.ENVIRONMENT) {
            case 'sandbox':
                return process.env.SANDBOX_API_CHILD_PRIVATE_KEY || ''
            case 'dev':
                return process.env.API_CHILD_PRIVATE_KEY || ''
            case 'production':
            case 'app':
            case 'prod':
                return process.env.PRODUCTION_API_CHILD_PRIVATE_KEY || ''
            default:
                return process.env.API_CHILD_PRIVATE_KEY || ''
        }
    }

    static get30PrivateKey(): string {
        switch (process.env.ENVIRONMENT) {
            case 'sandbox':
                return process.env.SANDBOX_API_UBERALL_PRIVATE_KEY || ''
            case 'dev':
                return process.env.API_UBERALL_PRIVATE_KEY || ''
            case 'production':
            case 'app':
            case 'prod':
                return process.env.PRODUCTION_API_UBERALL_PRIVATE_KEY || ''
            default:
                return process.env.API_UBERALL_PRIVATE_KEY || ''
        }
    }

    static getNearMeCheckPublicKey(): string {
        switch (process.env.ENVIRONMENT) {
            case 'sandbox':
                return process.env.NEAR_ME_CHECK_PUBLIC_KEY || ''
            case 'dev':
                return process.env.NEAR_ME_CHECK_PUBLIC_KEY || ''
            case 'production':
            case 'app':
            case 'prod':
                return process.env.NEAR_ME_CHECK_PUBLIC_KEY || ''
            default:
                return process.env.NEAR_ME_CHECK_PUBLIC_KEY || ''
        }
    }
}
