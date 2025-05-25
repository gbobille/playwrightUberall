import {Locator, Page} from "@playwright/test"

export default class BusinessPage {
    page: Page
    static url = '/en/app/uberall/accounts/businesses'
    readonly businessesShownInTable: Locator
    readonly addAccountBtn: Locator
    readonly firstAccountEditLink: Locator
    readonly accountIdDetailLink: (id: number) => Locator
    readonly accountNameDetailLink: (name: string) => Locator
    readonly noAccountSearchResult: Locator
    readonly searchResult: Promise<boolean>
    readonly filterDropdown: Locator
    readonly optionsInDropdown: Locator
    readonly businessRow: Locator
    readonly businessEditLink: (nav: Locator) => Locator
    readonly businessName: (nav: Locator) => Locator
    readonly businessIdBox: (nav: Locator) => Locator
    readonly businessActiveLocations: (nav: Locator) => Locator
    readonly businessProductPlan: (nav: Locator) => Locator

    constructor(page: Page) {
        this.page = page
        this.businessesShownInTable = page.locator("//div[@class='business-link-box']/a")
        this.addAccountBtn = page.locator("#create-new-business-button")
        this.firstAccountEditLink = page.locator("//a[contains(@id, 'business-edit-link-')]").first()
        this.accountIdDetailLink = (id: number) => page.locator(`//div[@class='business-link-box']/a[@id='business-edit-link-${id}']`)
        this.accountNameDetailLink = (name: string) => page.locator(`//div[@class='business-link-box']//a[text()='${name}']`)
        this.noAccountSearchResult = page.locator("#no-visible-businesses").first()
        this.searchResult = page.locator("//a[contains(@id, 'business-edit-link-')]").first().isVisible() ||
            page.locator("#no-visible-businesses").first().isVisible()
        this.filterDropdown = page.locator("//section[@id='business-list-top-bar']//a[contains(@class, 'dropdown-toggle')]")
        this.optionsInDropdown = page.locator("//ul[contains(@class, 'dropdown')]/li")
        this.businessRow = page.locator("//table[@id='business-list']//tr")
        this.businessEditLink = (nav: Locator) => nav.locator(".//td[@class='name-cell']//a")
        this.businessName = (nav: Locator) => nav.locator(".//td[@class='name-cell']/div")
        this.businessIdBox = (nav: Locator) => nav.locator(".//td[@class='name-cell']//div[@class='identifier-box']")
        this.businessActiveLocations = (nav: Locator) => nav.locator(".//td[@class='locations-cell']//a")
        this.businessProductPlan = (nav: Locator) => nav.locator(".//td[@class='plan-cell plan-active']//a")
    }

    async goto() {
        const fullUrl = `${process.env.BASE_URL}${BusinessPage.url}`
        console.log(`Navigating to URL: ${fullUrl}`)
        await this.page.goto(BusinessPage.url, {waitUntil: "domcontentloaded"})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        return await this.searchResult
    }

}
