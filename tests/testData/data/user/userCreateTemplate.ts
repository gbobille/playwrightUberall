import UserRole from "../../../../models/users/user/userRole";
import {Salutation} from "../../../../models/users/user/salutation";
import {Business, Location} from "../../staticTestData";


const userTemplate = {
    userDetails: {
        salutation: Salutation.MR,
        firstName: "Test",
        lastName: "User",
        unauthorizedUser: false,
        language: "EN"
    },
    userRights: {},
    emailNotifications: {
        digestEmail: true,
        emailNotification: true,
        pendingApprovals: true,
    }
}

function createUser(role: string, email: string, businessName?: string, locationNames?: string[]) {
    const user = JSON.parse(JSON.stringify(userTemplate))
    user.userDetails.email = email
    user.userRights.role = role
    if (businessName) {
        user.userRights.managedBusinesses = businessName
    }
    if (locationNames) {
        user.userRights.managedLocations = locationNames
    }
    return user
}

// default user constants for user create tests
export const administrator = createUser(UserRole.ADMINISTRATOR, "created_administrator_user@uber-all.com")
export const locationManager = createUser(UserRole.LOCATION_MANAGER, "created_location_manager_user@uber-all.com", Business.BUS_UB24562 as string, [Location.LOC_UB24562 as string])
export const businessManager = createUser(UserRole.BUSINESS_MANAGER, "created_business_manager_user@uber-all.com", Business.BUS_UB24562 as string)
export const multiBusinessManager = createUser(UserRole.MULTI_BUSINESS_MANAGER, "created_multi_business_manager_user@uber-all.com", Business.BUS_UB24562 as string)
