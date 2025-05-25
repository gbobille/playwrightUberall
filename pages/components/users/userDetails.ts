import { Page, Locator } from '@playwright/test'
import { ReactSelectUtils } from "../../../utils/reactSelectUtils"
import { Salutation, SalutationDetails } from "../../../models/users/user/salutation"

class UserDetailsComponent {
    page: Page
    firstName: Locator
    lastName: Locator
    userEmail: Locator
    language: Locator
    salutationSelect: Locator

    constructor(page: Page) {
        this.page = page
        this.firstName = page.locator('#firstname')
        this.lastName = page.locator('#lastname')
        this.userEmail = page.locator('#email')
        this.salutationSelect = page.locator("//div[contains(@class, 'salutation-select')]")
        this.language = page.locator('#preferredLanguage')
    }

    async setFirstName(name: string) {
        await this.firstName.fill(name)
    }

    async setLastName(name: string) {
        await this.lastName.fill(name)
    }

    async setUserEmail(email: string) {
        await this.userEmail.fill(email)
    }

    async selectSalutation(salutation: Salutation) {
        const salutationDetail = SalutationDetails[salutation].select
        if (!salutationDetail) {
            throw new Error(`Invalid salutation: ${salutation}`)
        }
        await ReactSelectUtils.selectOption(this.page, this.salutationSelect, salutationDetail)
    }
}

export { UserDetailsComponent }