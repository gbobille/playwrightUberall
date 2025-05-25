import {Locator, Page} from "@playwright/test";

export default class AddNewLocation {
    static url = '/en/app/uberall/locationCreate'
    page: Page
    addNewLocationTitle: Locator
    businessInformationTitle: Locator
    dataTabs: (tab: number) => Locator

    constructor(page: Page) {
        this.page = page
        this.addNewLocationTitle = page.getByText('Add New Location')
        this.businessInformationTitle = page.getByText('Business Information')
        this.dataTabs = (tab: number) => page.locator(`//a[contains(@class, 'location-profile-tab')]`).nth(tab)
    }

    async goto() {
        const fullUrl = `${process.env.BASE_URL}${AddNewLocation.url}`
        console.log(`Navigating to URL: ${fullUrl}`)
        await this.page.goto(AddNewLocation.url, {waitUntil: "domcontentloaded"})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        return await this.dataTabs(Tabs.BASIC_DATA).isVisible()
    }
}

export enum Tabs {
    BASIC_DATA = 0,
    RICH_DATA1 = 1,
    PHOTOS_VIDEOS = 2,
    SUGGESTIONS = 3
}
