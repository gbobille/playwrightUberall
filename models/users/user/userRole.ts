enum UserRole {
    ADMINISTRATOR = "ADMINISTRATOR",
    MULTI_BUSINESS_MANAGER = "MULTI_BUSINESS_MANAGER",
    BUSINESS_MANAGER = "BUSINESS_MANAGER",
    LOCATION_MANAGER = "LOCATION_MANAGER"
}

export const UserDetails: Record<UserRole, { option: number }> = {
    [UserRole.ADMINISTRATOR]: {option: 0},
    [UserRole.MULTI_BUSINESS_MANAGER]: {option: 1},
    [UserRole.BUSINESS_MANAGER]: {option: 2},
    [UserRole.LOCATION_MANAGER]: {option: 3}


}

export default UserRole