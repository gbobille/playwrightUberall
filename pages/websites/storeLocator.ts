import { expect, Locator, Page } from "@playwright/test";
import GoogleMapSF from "../components/map";
import LocalPage from "./localPage";

export default class StoreLocatorPage {
    searchBtn: Locator
    filterComponent: Locator
    locationDetailsTop: Locator
    storeLocatorMap: Locator
    firstStoreLink: Locator
    firstStoreImage: Locator
    map: GoogleMapSF
    firstLocationLinkInList: Locator
    gloc1InList: Locator
    localPage: LocalPage
    searchTextField: Locator
    autoCompoleteDDL: Locator
    suggestionList: Locator
    locationListNameAndAddress: Locator
    locationInfoWindowNameAndAddress: Locator
    locationListItem: Locator
    storeInListOpenningHours: Locator
    cookiesBtn: Locator
    locationListID: Locator
    locationName: Locator
    locationAddress: (locatorAddress: string) => Locator
    termsAndConditions: (baseUrl: string) => Locator
    privacyPolicy: (baseUrl: string) => Locator
    phoneIcon: Locator
    directionsIcon: Locator
    menuCategoryList: Locator
    firstLocationStatusIcon: Locator
    firstLocationClosedNowMessage: Locator
    firstLocationOpensAtMessage: Locator
    popupCloseButton: Locator
    //Mobile view
    openMapBtn: Locator
    openLocationListButton: Locator

    constructor(public page: Page) {
        this.searchBtn = page.locator(".ubsf_store-finder-button").first()
        this.filterComponent = page.locator('.ubsf_filter-toggle')
        this.locationDetailsTop = page.locator('.ubsf_locations-list-item-top').first()
        this.storeLocatorMap = page.locator('.ubsf_store-finder-column.ubsf_store-finder-map-column')
        this.firstStoreLink = page.locator('.ubsf_locations-list-item-main-content-link').first()
        this.firstStoreImage = page.locator('.ubsf_locations-list-item-image.small-square-image-container').first()
        this.map = new GoogleMapSF(page)
        this.firstLocationLinkInList = page.locator('.ubsf_locations-list-item-main-content-link').first()
        this.gloc1InList = page.locator('//div[@data-location-identifier="Test-google-loc-1"]')
        this.localPage = new LocalPage(page)
        this.searchTextField = page.getByTestId('autocomplete-input')
        this.autoCompoleteDDL = page.getByTestId('auto-complete-dropdown')
        this.suggestionList = page.getByTestId('autocomplete-dropdown-item')
        this.locationListNameAndAddress = page.getByTestId('location-list-item-name-and-address')
        this.locationInfoWindowNameAndAddress = page.getByTestId('info-window-name-address')
        this.locationListItem = page.getByTestId('location-list-item').first()
        this.openMapBtn = page.getByTestId('map-tab-button')
        this.openLocationListButton = page.getByRole('button', { name: 'List tab icon' })
        this.storeInListOpenningHours = page.locator('.ubsf_locations-list-item-time').first()
        this.locationListID = page.getByTestId('location-list')
        this.cookiesBtn = page.getByRole('button', { name: 'Accept All Cookies' })
        this.menuCategoryList = page.locator('ul.menu-category.level-1')
        this.locationName = page.locator('h2.ubsf_location-list-item-title a').first()
        this.locationAddress = (locatorAddress: string) => page.locator('address[data-testid="storefinder-address"] span', { hasText: `${locatorAddress}` })
        this.phoneIcon = page.locator('a[data-testid="custom-cta-button"][href^="tel:+1"]').first()
        this.directionsIcon = page.locator('a[data-testid="custom-cta-button"][href*="google.com/maps"]').first()
        this.firstLocationStatusIcon = page.locator('li.ubsf_location-list-item-container').first().locator('.ubsf_feature-location-status-icon')
        this.firstLocationClosedNowMessage = page.locator('li.ubsf_location-list-item-container').first().locator('.ubsf_feature-location-status > .ubsf_message')
        this.firstLocationOpensAtMessage = page.locator('li.ubsf_location-list-item-container').first().locator('.ubsf_today-hours-text > .ubsf_message')
        this.popupCloseButton = page.locator('.fancybox-close-small');
        this.termsAndConditions = (baseUrl: string) => page.locator(`footer a[href="${baseUrl}/termsofuse.html"]:has-text("Terms & Conditions")`);
        this.privacyPolicy = (baseUrl: string) => page.locator(`footer a[href="${baseUrl}/privacy-policy.html"]:has-text("Privacy policy")`);
    }

    async verifyBackGroundColorChange() {
        await expect(this.searchBtn).toHaveScreenshot({ timeout: 40000 })
    }

    async acceptCookies(cookies: string) {
        await this.page.waitForLoadState('domcontentloaded')
        const cookiesBtn = await this.page.getByRole('button', { name: cookies })
        await expect(cookiesBtn.first()).toBeVisible()
        await cookiesBtn.first().click()
        await this.page.waitForLoadState('load')
    }

    async verifyFirstLocationData() {
        await this.page.waitForLoadState('domcontentloaded')
        try {
            await this.firstStoreImage.waitFor({ state: 'visible' })
            await expect(this.firstStoreImage).toBeVisible()
        } catch (error) {
            console.log('First store image not visible:', error)
        }
        await this.searchBtn.hover()
        await this.locationDetailsTop.waitFor({ state: 'visible' ,timeout : 100000})
        await expect(this.locationDetailsTop).toHaveScreenshot()
    }

    async verifyMapIsVisible() {
        await this.page.waitForLoadState('domcontentloaded')
        await this.storeLocatorMap.waitFor({ state: 'visible' })
        //await expect(this.storeLocatorMap).toHaveScreenshot({ timeout: 8000, animations: "disabled"})
        await expect(this.storeLocatorMap).toHaveScreenshot({ maxDiffPixels: 1800 })

    }

    async clickOnTheFirstStore() {
        await this.firstStoreLink.click()
    }

    async selectLocationFromMap() {
        await this.map.clickOnTheMapCluster()
        await this.map.clickOnMapLocation()
    }

    async selectLocationFromMapDev() {
        await this.map.clickOnTheMapCluster()
        await this.page.locator('(//div[@class="cluster"])[2]').click()
        await this.page.locator('(//div[@class="custom-inner-pin-logo"])[4]').click()
    }

    async openLocationDev() {
        await this.page.locator('(//div[@class="custom-inner-pin-logo"])[4]').click()
        await this.map.openLocationFromMap()
        await this.localPage.verifyLocationTitle()
    }

    async verifyLocationDataInfoWindowDev(name: string, phone: string, cta: string) {
        await this.map.verifyInfoWindowDisplayedDev()
        await this.map.verifyInfoWindowContentsDev(name, phone, cta)
    }

    async selectClusterFromMapboxMap() {
        await this.map.clickOnTheMapboxCluster()
    }

    async selectLocationFromMapbox() {
        await this.map.clickOnZoomedMapboxCluster()
        await this.map.clickOnMapboxLocation()
    }

    async verifyLocationDataInfoWindow(name: string, opentime: string, phone: string, cta: string) {
        await this.map.verifyInfoWindowDisplayed()
        await this.map.verifyInfoWindowContents(name, opentime, phone, cta)
    }

    async verifyLocationDataInfoWindowMobile(name: string, opentime: string, cta: string) {
        await this.map.verifyInfoWindowDisplayed()
        await this.map.verifyInfoWindowContentsMobile(name, opentime, cta)
    }

    async openLocation() {
        await this.map.openLocationFromMap()
        await this.localPage.verifyLocationTitle()
    }

    async selectFirstLocationInList() {
        await this.firstLocationLinkInList.click()
    }

    async selectgloc1FromList() {
        await this.gloc1InList.waitFor({ state: 'visible' })
        await this.gloc1InList.click()
    }

    async searchForAStore(textValue: string) {
        await this.searchTextField.click()
        await this.searchTextField.fill(textValue)
        await this.page.waitForTimeout(5000)
    }

    async verifyDDLDisplayed() {
        await expect(this.autoCompoleteDDL).toBeVisible()
    }

    async selectSuggestedLocation(suggestionNumber: number) {
        await this.suggestionList.nth(suggestionNumber).click()
    }

    async getSuggestedLocationtext(suggestionNumber: number) {
        const suggestedStoreText = await this.suggestionList.nth(suggestionNumber).textContent()
        return suggestedStoreText
    }

    async getLocationNameandAddressInList() {
        await expect(this.locationListNameAndAddress).toBeVisible()
        const locationNameandAddressInList = await this.locationListNameAndAddress.first().textContent()
        return locationNameandAddressInList
    }

    async getLocationInfoWindowNameandAddress() {
        const locationInfoWindowNameandAddress = await this.locationInfoWindowNameAndAddress.textContent()
        return locationInfoWindowNameandAddress
    }

    async openMapViewOnMobile() {
        await this.openMapBtn.click()
    }
}