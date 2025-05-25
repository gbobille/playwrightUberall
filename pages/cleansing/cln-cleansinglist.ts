import { Locator, Page } from "@playwright/test";

export default class CleansingList {
    startHandlingButton     : Locator
    locationDisplayName     : (displayName:string) => Locator
    locationListDisplayName : (locationListName:string) => Locator

    constructor (private page: Page) {
        this.startHandlingButton        = this.page.locator('button[class="button-green-raised mat-raised-button mat-button-base ng-star-inserted"]')
        this.locationDisplayName        = (displayName:string) => this.page.locator('a[_ngcontent-scb-c30]').filter({hasText: `${displayName}`})
        this.locationListDisplayName    = (locationListName) => this.page.locator('table td a').filter({hasText:locationListName})
    }
}