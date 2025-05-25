import { Locator, Page, expect } from "@playwright/test";

export default class Locations {
    static url   = '/en/app/uberall/locations'
    businessFilter      : Locator
    addLocationButton   : Locator
    fileImportButton    : Locator
    fileExportButton    : Locator
    bulkUpdateButton    : Locator
    businessToSelect    : (businessName:string) => Locator

    constructor(private page: Page) {
        this.businessFilter     = page.locator('.Select-arrow-zone')
        this.addLocationButton  = this.page.getByTestId('add-locations-dropdown')
        this.fileImportButton   = this.page.getByTestId('excel-import-option')
        this.fileExportButton   = this.page.getByRole('link', { name: 'Export'})
        this.bulkUpdateButton   = this.page.getByTestId('bulk-update-dropdown')
        this.businessToSelect   = (businessName:string) => this.page.locator(`div[aria-label="${businessName}"]`)
    }

    public searchBar: Locator  = this.page.locator('.locations-search-input-mount-point input')
    public searchButton: Locator = this.page.locator('img[src="https://dev.uberall.com/assets/webapp/dashboard/search.svg"]')
    //search
    public searchInput: Locator = this.page.locator('[data-testid="locations-search-box"]')
    public searchBtn: Locator = this.page.locator('[aria-label="Search"]')

    public locationRetrievedTitle = (locationName: string) =>
        this.page.locator(`//button[contains(@data-testid, 'location-name-link')]/div[contains(text(),"${locationName}")]`)
    public locationImportedTitle = this.page.getByTestId('location-name-link-4749965')

    async goTo() {
        const fullUrl = `${process.env.BASE_URL}${Locations.url}`
        console.log(`Navigating to URL: ${fullUrl}`)
        await this.page.goto(Locations.url, { waitUntil: "domcontentloaded" })
        await this.isAt()
    }
    async isAt(): Promise<boolean> {
        return this.searchBar.isVisible()
    }
    async locationImportIsDisplayed(): Promise<boolean> {
        if (!await this.fileImportButton.isVisible()) {
            if (await this.bulkUpdateButton.isVisible()) {
                await this.bulkUpdateButton.click();
            }
        }
        return await this.fileImportButton.isVisible();
    }
    async searchLocation(locationName:string) {
        await this.searchBar.fill(locationName)
    }
    async clickSearchButton() {
        await this.searchButton.click()
    }
    //
    async searchSection(locationName:string){
        await this.searchInput.fill(locationName)
    }
    async clickSearchBtn(){
        await this.searchBtn.click()
    }
    async validateOneLocationIsImported(){
        await expect(this.locationImportedTitle).toBeVisible()
    }
    //
    async validateOneLocationIsRetrieved(locationName : string) {
        await expect(this.locationRetrievedTitle(locationName).first()).toBeVisible({ timeout: 50000 });
    }
    async clickAddLocationBtn() {
        await this.addLocationButton.click()
    }
    async clickFileImport() {
        await this.fileImportButton.click()
    }
    async clickLocationRetrieved(locationName : string) {
        this.locationRetrievedTitle(locationName).click({ force: true });
    }
    async clickFileExport() {
        await this.fileExportButton.click()
    }
    async clickBusinessFilter() {
        await this.businessFilter.click({timeout: 10000})
    }
    async selectBusinessName(businessName : string) {
        await this.businessToSelect(businessName).click()
    }
    async locationAddress(address : string) {
        await this.page.getByText(address).click({timeout: 10000})
    }
    async clickLocationName(locationName : string) {
        await this.page.getByRole('link', { name: locationName }).click()
    }
    async clickLocationNaMe() {
        await this.page.getByTestId('location-name-link-4749965').click()
    }
    async validateBusinessName(businessName) {
        await expect(this.businessToSelect(businessName)).not.toBeVisible
    }
}