import {Locator, Page} from '@playwright/test'

export default class LocationGroupsPage {
    readonly page: Page
    static readonly url = `/en/app/uberall/users/location/groups`

    readonly addLocationGroupButton: Locator
    readonly locationGroupsName: Locator
    readonly locationGroupsTableRows: Locator
    readonly confirmDeleteButton: Locator
    readonly userSearchBar: Locator
    readonly successMessage: Locator


    constructor(page: Page) {
        this.page = page
        this.addLocationGroupButton = page.locator("//button[@data-testid='location-groups-top-bar-create-button']")
        this.locationGroupsTableRows = page.locator("//table[contains(@class, 'location-groups-data-table')]//tbody//tr")
        this.confirmDeleteButton = page.locator("//button[@type='button']")
        this.locationGroupsName = page.locator('#group-name')
        this.userSearchBar = page.locator("//input[@data-testid='location-group-form-users-modal-search']")
        this.successMessage = page.locator('//*[local-name()="path" and @stroke="var(--colors-state-success)"]');
    }

    locationGroupsDeleteButton(groupId: number | Map<string, unknown> | undefined): Locator {
        return this.page.locator(`//a[contains(@href, 'location/groups/delete/${groupId}')]`)
    }

    locationGroupsEditButton(groupId: number | Map<string, unknown> | undefined): Locator {
        return this.page.locator(`//a[contains(@href, 'location/groups/update/${groupId}')]`)
    }

    async goTo() {
        const fullUrl = `${process.env.BASE_URL}${LocationGroupsPage.url}`
        console.log(`Navigating to URL: ${fullUrl}`)
        await this.page.goto(LocationGroupsPage.url, {waitUntil: "domcontentloaded"})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        await this.addLocationGroupButton.waitFor({state: 'visible', timeout: 20000})
        return await this.addLocationGroupButton.isVisible()
    }

    async getLocationGroupInTableInformation(): Promise<Array<{ name: string; locations: number; users: number }>> {
        await new Promise(resolve => setTimeout(resolve, 5000))
        const allLocationGroupsInTable: Array<{ name: string; locations: number; users: number }> = [];
        const rows = await this.locationGroupsTableRows.elementHandles();

        if (!rows || rows.length === 0) { // Check if rows exist
            return allLocationGroupsInTable; // Return an empty array if no rows exist
        }

        for (const row of rows) {
            const cells = await row.$$("[role='cell']");
            if (cells.length >= 1) { // Ensure there are enough cells to extract data
                const name = await cells[0].innerText();
                const locations = parseInt(await cells[1].innerText(), 10);
                const users = parseInt(await cells[2].innerText(), 10);

                allLocationGroupsInTable.push({ name, locations, users });
            }
        }

        return allLocationGroupsInTable;
    }

    async clickNewGroupButton(): Promise<void> {
        await this.addLocationGroupButton.click()
        await this.page.waitForURL(/location\/groups\/create/) // Wait for navigation to the create page
    }

    async clickEditLocationGroupButton(groupId: number): Promise<void> {
        await this.locationGroupsEditButton(groupId).click()
        await this.page.waitForURL(/location\/groups\/update/) // Wait for navigation to the edit page
    }

    async deleteLocationGroup(groupId: number | Map<string, unknown> | undefined): Promise<void> {
        await this.locationGroupsDeleteButton(groupId).click()
        await this.confirmDeleteButton.first().waitFor({state: 'visible', timeout: 20000})
        await this.confirmDeleteButton.last().click()
        await this.successMessage.first().waitFor({state: 'visible', timeout: 20000})
        await this.successMessage.first().waitFor({state: 'hidden', timeout: 20000})
    }

    async searchUsers(searchTerm: string): Promise<void> {
        await this.userSearchBar.fill(searchTerm)
        await this.userSearchBar.press('Enter')
    }
}