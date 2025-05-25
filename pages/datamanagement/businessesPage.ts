import { Locator, Page } from "@playwright/test";

export default class Businesses {
    businessTab: Locator
    searchField: Locator
    businessName: Locator
    businessCount: Locator
    addBusiness: Locator
    createBusinessHeading: Locator
    addLocation: Locator
    productPlan: Locator

    constructor(page: Page) {
        this.businessTab = page.getByRole('link', { name: 'Businesses' })
        this.searchField = page.getByPlaceholder('Search by Name and Address')
        this.businessCount = page.locator('a.locations-link').first()
        this.addBusiness = page.getByRole('link', { name: 'Add Business' })
        this.createBusinessHeading = page.getByRole('heading', { name: 'Business info' })
        this.addLocation = page.locator('#add-business-button-1241868')
        this.productPlan = page.getByText('uberall listings engage').first()
    }
}