import {Page, Locator} from '@playwright/test'
import {UserDetailsComponent} from './userDetails'
import UserRole, {UserDetails} from "../../../models/users/user/userRole"
import {ReactSelectUtils} from "../../../utils/reactSelectUtils"

class UserRightsComponent {
    page: Page
    roleSelect: Locator
    accountSelect: Locator
    allAccountsAllocated: Locator
    managedBusinesses: Promise<boolean>
    allLocationsAllocated: Locator
    locationSelect: Locator
    managedLocations: Promise<boolean>
    userDetails: UserDetailsComponent

    constructor(page: Page) {
        this.page = page
        this.roleSelect = page.locator("//div[contains(@class, 'input-container')]//div[contains(@class, 'location-form-input')]").last()
        this.accountSelect = page.locator("//div[@class= 'user-accounts-rights-container']//div[@class= 'location-form-input-input-wrapper']").first()
        this.allAccountsAllocated = page.locator("//span[@class='test-bizname']")
        this.managedBusinesses = this.allAccountsAllocated.isVisible() || this.accountSelect.isVisible()
        this.allLocationsAllocated = page.locator("//span[@class='test-alllocations']")
        this.locationSelect = page.locator("//div[@class='column right']//div[contains(@class, 'Select location-form-input')]")
        this.managedLocations = this.allLocationsAllocated.isVisible() || this.locationSelect.isVisible()
        this.userDetails = new UserDetailsComponent(page)
    }

    async selectUserRole(userRole: UserRole) {
        await this.roleSelect.isVisible()
        await this.userDetails.language.first().scrollIntoViewIfNeeded()
        await ReactSelectUtils.selectOption(this.page, this.roleSelect, UserDetails[userRole].option)
    }

    async selectBusinesses(business: string) {
        if (await this.accountSelect.isVisible()) {
            await this.managedBusinesses
            await this.accountSelect.last().scrollIntoViewIfNeeded()
            if (await this.accountSelect.isVisible()) {
                await ReactSelectUtils.selectOptionByName(this.page, this.accountSelect, business)
            }
        }
    }

    async selectLocations(locations: string[]) {
        if (await this.locationSelect.isVisible()) {
            await this.managedLocations
            await this.locationSelect.last().scrollIntoViewIfNeeded()
            if (await this.locationSelect.isVisible()) {
                for (const location of locations) {
                    await ReactSelectUtils.selectOptionByName(this.page, this.locationSelect, location)
                }
            }
        }
    }
}

export {UserRightsComponent}