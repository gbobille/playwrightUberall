import {Salutation} from "./salutation"

export default class UserDetails{
    salutation: Salutation
    firstName: string
    lastName: string
    phone: string
    email: string
    unauthorizedUser: boolean

    constructor(salutation: Salutation, firstName: string, lastName: string, phone: string, email: string, unauthorizedUser: boolean) {
        this.salutation = salutation
        this.firstName = firstName
        this.lastName = lastName
        this.phone = phone
        this.email = email
        this.unauthorizedUser = unauthorizedUser
    }
}
