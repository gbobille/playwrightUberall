import { expect, Locator, Page } from "@playwright/test";
import ElementsHelpers from "../../utils/elementsUtils";

export default class GoogleMapSF {
    clusterPin: Locator
    clusterPinMapbox: Locator
    clusterPinMapboxZoomed: Locator
    locationPin: Locator
    locationPinMapbox: Locator
    locationPinMobile: Locator
    locationNameInfoWindow: Locator
    locationLinkInfoWindow: Locator
    locationOpenTimeInfoWindow: Locator
    locationPhoneInfoWindow: Locator
    locationCTAInfoWindow: Locator
    infoWindow: Locator
    infoWindowOpenTime: Locator
    elementsHelpers = new ElementsHelpers()

    constructor(public page: Page) {
        this.clusterPin = page.locator('.cluster')
        this.clusterPinMapbox = page.getByTestId("store-finder-map-mapbox-cluster-marker")
        this.clusterPinMapboxZoomed = page.getByText('2', { exact: true })
        this.locationPin = page.locator('(//*[@class="default-pin-default pin-absolute-position"])[3]')
        this.locationPinMapbox = page.getByTestId("store-finder-map-mapbox-location-marker").first()
        this.locationPinMobile = page.locator('(//div[@data-testid="store-finder-map-mapbox-location-marker"])[2]')
        this.locationNameInfoWindow = page.locator('.ubsf_info-window-content-name')
        this.locationLinkInfoWindow = page.locator("//div[@class='ubsf_info-window-content-name']/a[@href]")
        this.locationOpenTimeInfoWindow = page.locator('.ubsf_info-window-content-info-time')
        this.locationPhoneInfoWindow = page.locator('.ubsf_info-window-content-info-phone')
        this.locationCTAInfoWindow = page.getByTestId('info-window-button-row')
        this.infoWindow = page.getByTestId('info-window')
        this.infoWindowOpenTime = page.getByTestId('info-window-list')
    }

    async clickOnTheMapCluster() {
        await this.clusterPin.first().click()
    }

    async clickOnTheMapboxCluster() {
        await this.clusterPinMapbox.click({ noWaitAfter: false })
    }

    async clickOnZoomedMapboxCluster() {
        await this.clusterPinMapboxZoomed.click()
        //await this.locationPinMapbox.click()
    }

    async clickOnMapLocation() {
        await this.locationPin.click()
        await this.locationPin.click()
        await this.page.waitForTimeout(3000)
    }

    async clickOnMapboxLocation() {
        await this.locationPinMapbox.click()
    }

    async clickOnMapLocationMobile() {
        await this.locationPinMobile.click()
    }

    async verifyInfoWindowDisplayed() {
        await expect(this.infoWindow).toBeVisible()
    }

    async verifyInfoWindowDisplayedDev() {
        await this.infoWindow.isVisible()
        await expect(this.page.locator('.ubsf_info-window-content-picture.small-square-image-container')).toBeVisible()
        await expect(this.infoWindow).toHaveScreenshot({ mask: [this.page.locator('.ubsf_info-window-content-info .ubsf_info-window-content-info-time')] })
    }

    async verifyInfoWindowContents(name: string, opentime: string, phone: string, cta: string) {
        await this.elementsHelpers.validateElementText(name, this.locationNameInfoWindow)
        await this.elementsHelpers.validateElementText(opentime, this.locationOpenTimeInfoWindow)
        await this.elementsHelpers.validateElementText(phone, this.locationPhoneInfoWindow)
        await this.elementsHelpers.validateElementText(cta, this.locationCTAInfoWindow)
    }

    async verifyInfoWindowContentsDev(name: string, phone: string, cta: string) {
        await this.elementsHelpers.validateElementText(name, this.locationNameInfoWindow)
        await this.elementsHelpers.validateElementText(phone, this.locationPhoneInfoWindow)
        await this.elementsHelpers.validateElementText(cta, this.locationCTAInfoWindow)
    }

    async openLocationFromMap() {
        await this.locationLinkInfoWindow.click()
        await this.page.waitForLoadState("domcontentloaded")
    }

    //Mobile
    async verifyInfoWindowContentsMobile(name: string, opentime: string, cta: string) {
        await this.elementsHelpers.validateElementText(name, this.locationNameInfoWindow)
        await this.elementsHelpers.validateElementText(opentime, this.locationOpenTimeInfoWindow)
        await this.elementsHelpers.validateElementText(cta, this.locationCTAInfoWindow)
    }

}