import { Locator, Page, expect } from "@playwright/test";

export default class LocationListRevamp {
    private page: Page
    static readonly url = `/en/app/uberall/locations`
    mapButton: Locator
    map: Locator
    locationListButton: Locator
    locationName: Locator
    addLocationButton: Locator
    manualButton: Locator
    actionsRequiredButton: Locator
    businessFilter: Locator
    noLocationsFound: Locator
    closeBusinessFilter: Locator
    openAdvancedFilters: Locator
    closeAdvancedFilters: Locator
    countryFilter: Locator
    bulkUpdateButton: Locator
    bulkEditorButton: Locator
    excelImportButton: Locator
    selectAllLocations: Locator
    syncButton: Locator
    confirmSyncButton: Locator
    syncSuccess: Locator
    exportButton: Locator
    downloadingMessage: Locator
    needsReview: Locator
    clickStatus: Locator
    closeStatus: Locator
    inactiveStatus: Locator
    businessName: Locator
    bikeRackSmartConversation: Locator
    productPlan: Locator
    missingListings: Locator
    locationDirectLink :  Locator
    readonly locationByText : (location : string) => Locator
    readonly searchField: Locator
    readonly searchResult: (location : string) => Locator
    readonly countrySelector: (country : string) => Locator
    readonly columnHeader : (columnTitle : string) => Locator
    readonly selectBusiness : (business : string) => Locator
    readonly labelSelector: (label : string) => Locator
    labelFilter: Locator
    clearLabelFilter: Locator
    labelInput: Locator


    constructor(page: Page) {
        this.page = page
        this.mapButton = page.getByTestId('locations-view-button-map')
        this.map = page.locator('[aria-label="Map"]')
        this.locationListButton = page.getByTestId('locations-view-button-list')
        this.columnHeader = (columnTitle : string) => page.getByText(`${columnTitle}`)
        this.locationName = page.getByText('DM_GENERAL_TESTS').first()
        this.addLocationButton = page.getByText('Add Location')
        this.manualButton = page.getByTestId('add-location-manual')
        this.searchField = page.getByTestId('locations-search-box')
        this.searchResult = (location : string) => page.getByRole('cell', { name: `${location}`}).first()
        this.actionsRequiredButton = page.getByTestId('actions-required-switcher-actions-required')
        this.businessFilter = page.getByTestId('businesses-filter_select-wrapper').locator('svg')
        this.selectBusiness = (business : string) => page.locator('label').filter({ hasText: `${business}` })
        this.noLocationsFound = page.getByRole('cell', { name: 'No locations found' })
        this.closeBusinessFilter = page.getByTestId('businesses-filter_clear-indicator')
        this.openAdvancedFilters = page.getByTestId('advanced-filters_open-filters')
        this.closeAdvancedFilters = page.getByTestId('advanced-filters_close-filters')
        this.countryFilter = page.getByTestId('countries-filter_select-wrapper').locator('svg')
        this.countrySelector = (country : string) => page.locator('label').filter({ hasText: `${country}` }).locator('span').nth(1)
        this.bulkUpdateButton = page.getByText('Bulk Update')
        this.bulkEditorButton = page.getByTestId('bulk-editor-import-option')
        this.excelImportButton = page.getByTestId('excel-import-option')
        this.selectAllLocations = page.getByRole('row', { name: 'Location Identifier Action' }).locator('label span').nth(1)
        this.syncButton = page.getByTestId('locations-sync-button')
        this.confirmSyncButton = page.getByTestId('locations-sync-modal-confirm-btn')
        this.syncSuccess = page.getByText('1 location(s) scheduled for sync. Syncing may take a few minutes to complete.')
        this.exportButton = page.getByTestId('locations-export-button')
        this.downloadingMessage = page.getByText('We are preparing your file,')
        this.needsReview = page.getByTestId('location-actions-required-4685230').getByText('items')
        this.clickStatus =  page.getByTestId('status-filter_select-wrapper').locator('svg')
        this.closeStatus =  page.getByTestId('CLOSED')
        this.inactiveStatus = page.getByTestId('INACTIVE')
        this.businessName = page.getByText('Bike Racks Smart Conversation').first()
        this.productPlan =  page.getByText('uberall listings engage').first()
        this.bikeRackSmartConversation = page.getByText('Bike Racks Smart Conversation').first()
        this.missingListings = page.getByText('Listing connection issue').first()
        this.locationByText = (location: string) => page.getByText(`${location}`).first()
        this.labelSelector = (label : string) => page.locator('label').filter({ hasText: `${label}` }).locator('span').nth(1)
        this.labelFilter = page.getByTestId('labels-filter_select-wrapper').locator('svg')
        this.labelInput = page.locator('[data-testid="labels-filter_select-wrapper"] input');
        this.clearLabelFilter = page.locator('[data-testid="labels-filter_select-wrapper"] svg[data-testid="labels-filter_clear-indicator"]');
        this.locationDirectLink = page.locator('[data-testid^="location-name-link-"]')
    }

    async goTo(): Promise<void> {
        const fullUrl = `${process.env.BASE_URL}${LocationListRevamp.url}`
        console.log(`Navigating to URL: ${fullUrl}`)
        await this.page.goto(LocationListRevamp.url, { waitUntil: "load" })
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        await Promise.race([
            this.locationDirectLink.first().waitFor({ state: 'visible', timeout: 10000 }),
            this.noLocationsFound.waitFor({ state: 'visible', timeout: 5000 })
        ])
        return true
    }

    async searchLocation(locationAddress) {
        await this.searchField.fill(locationAddress)
        await this.searchField.press('Enter')
      }
}