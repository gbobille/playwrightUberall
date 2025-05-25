import {Locator} from "@playwright/test"
import UserRole from "./user/userRole";

export default class UserInTable {
    firstName: string
    lastName: string
    email: string
    role: UserRole
    editButton: Locator
    deleteButton: Locator

    constructor(firstName: string, lastName: string, email: string, role: UserRole, editButton: Locator, deleteButton: Locator) {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.role = role
        this.editButton = editButton
        this.deleteButton = deleteButton
    }
}
