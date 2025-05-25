import {Page, Locator} from '@playwright/test'
import BusinessesAndLocationsUtils from '../../utils/selectBusinessAndLocationUtils'

export default class LocationGroupsCreatePage {
    private page: Page
    static readonly url = `/en/app/uberall/users/location/groups/create`
    private userSearchBar: Locator
    private assignUsersButton: Locator
    private usersTableRows: Locator
    private locationGroupName: Locator
    private addLocationsButton: Locator
    private addUsersButton: Locator
    private saveLocationGroupButton: Locator
    private successMessage: Locator
    private businessAndLocationSelect: BusinessesAndLocationsUtils

    constructor(page: Page) {
        this.page = page
        this.businessAndLocationSelect = new BusinessesAndLocationsUtils(page)
        this.userSearchBar = page.locator("//input[@data-testid='location-group-form-users-modal-search']")
        this.assignUsersButton = page.locator("//button[@data-testid='location-group-form-users-modal-add-users-button']")
        this.usersTableRows = page.locator("//table[@data-testid='location-group-form-modal-users-table']//tbody//tr")
        this.locationGroupName = page.locator('#group-name')
        this.addLocationsButton = page.locator("//button[@data-testid='location-group-form-select-locations-button']")
        this.addUsersButton = page.locator("//a[@data-testid='location-group-form-select-users-button']")
        this.saveLocationGroupButton = page.locator("//button[@data-testid='location-group-form-action-bar-submit']")
        this.successMessage = page.locator('//*[local-name()="path" and @stroke="var(--colors-state-success)"]');
    }

    async goTo() {
        const fullUrl = `${process.env.BASE_URL}${LocationGroupsCreatePage.url}`
        console.log(`Navigating to URL: ${fullUrl}`)
        await this.page.goto(LocationGroupsCreatePage.url, {waitUntil: "domcontentloaded"})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        await this.locationGroupName.waitFor({state: 'visible', timeout: 20000})
        return await this.locationGroupName.isVisible()
    }

    async addGroupName(name: string): Promise<void> {
        await this.locationGroupName.waitFor({state: 'visible', timeout: 20000})
        await this.locationGroupName.fill(name)
    }

    async addLocationsAndBusinesses(locationGroup: {
        businesses: string[]
        locations: string[]
    }): Promise<void> {
        await this.openAddLocationsPopUp()
        await this.selectBusinessesAndLocations(locationGroup)
    }

    async editLocationsAndBusinesses(locationGroup: {
        businesses: string[]
        locations: string[]
    }): Promise<void> {
        await this.openAddLocationsPopUp()
        await this.businessAndLocationSelect.removeAllLocationsAndBusinesses()
        await this.selectBusinessesAndLocations(locationGroup)
    }

    async searchUsers(searchTerm: string): Promise<void> {
        await this.addUsersButton.waitFor({state: 'visible', timeout: 20000})
        await this.addUsersButton.click()
        await this.usersTableRows.first().waitFor({state: 'visible', timeout: 10000})
        await new Promise(resolve => setTimeout(resolve, 7000))
        await this.userSearchBar.waitFor({state: 'visible', timeout: 20000})
        await this.userSearchBar.fill(searchTerm)
        await this.userSearchBar.press('Enter')
    }

    async selectUsers(users: string[]): Promise<void> {
        await this.usersTableRows.first().waitFor({state: 'visible', timeout: 20000});
        for (const user of users) {
            const userRow = this.usersTableRows.locator(`:scope:has(td:text-is("${user}"))`).first()
            await userRow.waitFor({state: 'visible', timeout: 30000})
            await this.page.locator('input[type="checkbox"]').first().locator('..').click();
        }
        await this.assignUsersButton.waitFor({state: 'visible', timeout: 20000})
        await this.assignUsersButton.click()
    }

    async successfullySaveLocationGroup(): Promise<void> {
        await this.saveLocationGroupButton.click()

        // Wait for the success message to be visible and then hidden so the page has time to update
        await this.successMessage.waitFor({state: 'visible', timeout: 10000})
        await this.successMessage.waitFor({state: 'hidden', timeout: 10000})
    }

    private async selectBusinessesAndLocations(locationGroup: {
        businesses: string[],
        locations: string[]
    }): Promise<void> {
        if (await this.businessAndLocationSelect.isPopUpDisplayed()) {
            await this.businessAndLocationSelect.selectRequiredBusinesses(locationGroup.businesses)
            await this.businessAndLocationSelect.selectRequiredLocations(locationGroup.locations)
        }
    }

    private async openAddLocationsPopUp(): Promise<void> {
        if (!(await this.businessAndLocationSelect.isPopUpDisplayed()) && (await this.addLocationsButton.isVisible())) {
            await this.addLocationsButton.click()
        }
    }
}
