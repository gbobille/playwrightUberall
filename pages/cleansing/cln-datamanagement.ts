import { Locator, Page, expect } from "@playwright/test";

export default class CleansingDataManagement {
    mainFilter              : (filterName:string) => Locator
    subFilter               : (subFilterName:string) => Locator
    singleLocationFromList  : (locationName:string) => Locator

    constructor (private page: Page) {
        this.mainFilter = (filterName:string) => this.page.locator(`input[placeholder="${filterName}"]`)
        this.subFilter = (subFilterName:string) => this.page.locator('span[class="mat-option-text"]').filter({ hasText: `${subFilterName}`})
        this.singleLocationFromList = (locationName:string) => this.page.locator(`a[data-copy-value="${locationName}"]`)
    }

    async searchForLocation(filterName, filterValue) {
        await this.mainFilter(filterName).fill(filterValue)
        await this.page.keyboard.press('Enter')
    }
}