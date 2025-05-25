import { Locator, Page, expect } from "@playwright/test";
import exp from "constants";
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

export default class CleansingPortal { 
    originalDetailsField    : (originalDetailsName:string) => Locator
    cleansedDetailsField    : (cleansedDetailsName:string) => Locator
    saveButton              : Locator
    geodesyDashboardBtn     : Locator
    skipButton              : Locator
    mapLabel                : Locator
    detailsHeader           : Locator

    constructor (private page: Page) {
        this.originalDetailsField = (originalDetailsName:string) => this.page.locator(`div[class="column is-4"][data-copy-value="${originalDetailsName}"]`).first()
        this.cleansedDetailsField = (cleansedDetailsName:string) => this.page.locator(`div[class="column is-7 g-field-updated g-indicator g-equal"][data-copy-value="${cleansedDetailsName}"]`).first()
        this.saveButton = this.page.locator('span[class="mat-button-wrapper"]').filter({hasText:'Save'})
        this.geodesyDashboardBtn = this.page.locator('a[class="g-dashboard"]')
        this.skipButton = this.page.locator('span[class="mat-button-wrapper"]').filter({hasText:'Skip'})
        this.mapLabel = this.page.locator('div[aria-label="Map"]')
        this.detailsHeader = this.page.locator('div[class="columns details-header"]')
    }

    async cleanseCase(locationName_1:string, locationName_2?:string) {
        await expect(this.skipButton).toBeVisible()
        let locationCount = 0
        let locationFlag = 0
        while(locationCount <= 4 && locationFlag < 2) {
            await delay(3000)
            if(locationName_2? await this.originalDetailsField(locationName_1).isVisible() || await this.originalDetailsField(locationName_2).isVisible() : await this.originalDetailsField(locationName_1).isVisible()) {
                await expect(locationName_2? this.originalDetailsField(locationName_1).or(this.originalDetailsField(locationName_2)):this.originalDetailsField(locationName_1)).toBeVisible()
                locationCount = locationCount+1
                locationFlag = locationFlag + 1
                await this.saveButton.click();
                continue;
            }
            else {
                await delay(3000)
                locationCount = locationCount+1
                await this.skipButton.click()
                continue;
            }
        }
    }
    async cleanseCases_noRestrictions() {
        await expect(this.skipButton).toBeVisible()
        let locationCount = 0
        while(locationCount <= 10) {
            await delay(5000)
            locationCount = locationCount+1
            await this.skipButton.click();
            continue;
        }
    }


}