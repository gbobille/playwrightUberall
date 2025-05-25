import { Locator, Page, expect } from "@playwright/test";

export default class CleansingPois { 
    locationStatus          : (status:string) => Locator
    cleanseButton           : Locator
    cleansingReasonButton   : Locator
    openClnPanelButton      : Locator
    cancelClnButton         : Locator
    poiID                   : Locator

    constructor (private page: Page) { 
        this.locationStatus = (status:string) => page.getByText(`${status}`).first()
        this.cleanseButton = this.page.locator('span[class="mat-button-wrapper"]').filter({hasText:' Cleanse '})
        this.cleansingReasonButton = this.page.locator('div[class="mat-radio-container"]').last()
        this.openClnPanelButton = this.page.locator('button[class="button-orange-raised mat-raised-button mat-button-base"]')
        this.cancelClnButton = this.page.locator(`span[class="mat-button-wrapper"]`).filter({hasText: 'Cancel'})
        this.poiID = this.page.locator('span[class="font-16"]').nth(2)
    }
}