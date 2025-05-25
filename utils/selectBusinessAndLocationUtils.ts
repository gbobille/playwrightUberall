import { Page, Locator } from '@playwright/test'

export default class BusinessesAndLocationsUtils {
    private page: Page
    private businessAndLocationSelectPopUp: Locator
    private selectButton: Locator
    private locationInList: (location: string) => Locator
    private firstLocationInList: Locator
    private businessSelectInput: Locator
    private businessDropDown: Locator
    private businessRemoveIcon: Locator
    private removeAllLocationsButton: Locator
    private emptyLocationSelectedList: Locator

    constructor(page: Page) {
        this.page = page
        this.businessAndLocationSelectPopUp = page.locator("//div[@class='select-businesses-and-locations-edit-inner']")
        this.selectButton = page.locator("//button[@data-testid='add-locations-button']")
        this.locationInList =
            (location: string) => page.locator(`//div[@class='multiselect-locations-list']//div[@class='location-item-name' and text()='${location}']`)
        this.firstLocationInList = page.locator("//div[@class='multiselect-locations-list']//div[@class='location-item-info']").first()
        this.businessSelectInput = page.locator("//input[@placeholder='Search businesses']")
        this.businessDropDown = page.locator("//div[@class='multiselect-dropdown-with-search-internal-section']")
        this.businessRemoveIcon = page.locator("//div[@class='business-and-labels']//span[@class='Select-value-icon']")
        this.removeAllLocationsButton = page.locator("//div[@class='remove-all-section']")
        this.emptyLocationSelectedList = page.locator("//div[@class='locations-list']//div[@class='nothing-to-show']")
    }

    async selectRequiredBusinesses(businesses: string[]): Promise<void> {
        await this.firstLocationInList.waitFor({ state: 'visible', timeout: 15000 })
        if (await this.businessSelectInput.isVisible()) {
            await this.selectMultipleBusinesses(businesses)
        }
    }

    async selectRequiredLocations(locations: string[]): Promise<void> {
        await this.selectMultipleLocations(locations)
        await this.selectButton.click()
    }

    private async selectMultipleBusinesses(businesses: string[]): Promise<void> {
        await this.businessSelectInput.click()
        for (const business of businesses) {
            await this.businessSelectInput.fill(business)
            const businessLocator = this.page.locator(`//span[@class='ubui_optionsItem___rawow']//span[text()='${business}']`)
            await businessLocator.waitFor({ state: 'visible', timeout: 30000 })
            await businessLocator.click()
        }
        await this.page.locator("//div[@class='description']").first().click() // Close dropdown
        await this.businessDropDown.waitFor({ state: 'hidden' })
    }

    private async selectMultipleLocations(locations: string[]): Promise<void> {
        for (const location of locations) {
            await this.locationInList(location).waitFor({ state: 'visible' })
            await this.locationInList(location).click()
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    async isPopUpDisplayed(): Promise<boolean> {
        return await this.businessAndLocationSelectPopUp.isVisible()
    }

    async removeAllLocationsAndBusinesses(): Promise<void> {
        await this.businessRemoveIcon.waitFor({ state: 'visible', timeout: 30000 })
        const removeIcons = await this.businessRemoveIcon.elementHandles()
        for (const icon of removeIcons) {
            await icon.click()
        }
        await this.businessRemoveIcon.waitFor({ state: 'hidden' })
        await this.firstLocationInList.waitFor({ state: 'visible', timeout: 15000 })
        await this.removeAllLocationsButton.click()
        await this.emptyLocationSelectedList.waitFor({ state: 'visible' })
    }
}