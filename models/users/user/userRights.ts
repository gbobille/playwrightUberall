import UserRole from "./userRole"

export default class UserRights {
    role: UserRole
    managedBusinesses: string
    managedLocations: string[]

    constructor(role: UserRole, managedBusinesses: string, managedLocations: string[]) {
        this.role = role
        this.managedBusinesses = managedBusinesses
        this.managedLocations = managedLocations
    }
}
