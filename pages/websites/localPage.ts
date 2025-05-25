import { BrowserContext, Locator, Page, expect } from "@playwright/test";
import Utils from "../../utils/utils";
import { Exception } from "handlebars";

export default class LocalPage {
    locationPageTitle: Locator
    customFieldMainColumn: Locator
    showMorePhotosBtn: Locator
    similarLocationsListItem: Locator
    brandsSection: Locator
    openNowLabel: Locator

    constructor(public page: Page) {
        this.locationPageTitle = page.locator('.ubsf_details-details-box .ubsf_details-details-title')
        this.customFieldMainColumn = page.getByTestId('custom-field-component')
        this.showMorePhotosBtn = page.locator('.ubsf_show-more-photos')
        this.similarLocationsListItem = page.getByTestId("location-list-item-link").first()
        this.brandsSection = page.locator('.ubsf_details-box-wrapper.ubsf_brands-box.ubsf_card')
        this.openNowLabel = page.locator('.ubsf_details-open-now.ubsf_open')
    }

    async verifyLocationTitle() {
        await this.locationPageTitle.waitFor({ state: "visible" })
        await expect(this.locationPageTitle).toBeVisible()
    }

    async verifyCustomFieldIsAddedToMainColumn() {
        await this.customFieldMainColumn.waitFor({ state: "visible" })
        await expect(this.customFieldMainColumn).toBeVisible()
    }

    async verifyCustomFieldDeletedFromMainColumn(context: BrowserContext, url: string) {
        const utils = new Utils;
        await utils.validateScreenShot(context, url, '.ubsf_opening-hours-wrapper')
    }

    async clickOnShowMorePhotos() {
       await this.page.getByRole('img', { name: 'Location photo' }).nth(3).click()
       await this.page.waitForLoadState("domcontentloaded")
       await this.page.waitForLoadState("load")
    }

    async verifyCustomFieldIsDeletedFromMainColumnNoScreenshot() {
        await expect(this.customFieldMainColumn).toBeHidden()
    }

    async verifyBrandsSectionDisplayed() {
        await expect(this.brandsSection).toHaveScreenshot()
    }

    async verifyOpenNowLabel() {
        await expect(this.openNowLabel).toHaveText(/Jetzt geöffnet/)
    }
}