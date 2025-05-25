import { expect, FrameLocator, Locator, Page, selectors } from "@playwright/test";

export default class FacebookReach  {
    analyticsSidebarLink: Locator;
    facebookReachDashboardSidebarLink: Locator;
    pageReach: Locator;
    postReach: Locator;
    pageReachDetails: Locator;
    postReachDetails: Locator;
    commonFilterBar: Locator;
    commonFiltersButton: Locator;
    clearAllButton: Locator;
    groupFilterOption: Locator;
    cancelDropdownFiltersButton: Locator;
    applyDropdownFiltersButton: Locator;
    datePicker: Locator;
    presetDatesDropdown: Locator;
    datePickerOkButton: Locator;
    businessFilterDropdown: Locator;
    aggregationDropdown: Locator;
    pageLevelDropdown: Locator;
    aggregationOptionDay: Locator;
    aggregationOptionWeek: Locator;
    aggregationOption28Days: Locator;
    pageLevelBrandOption: Locator;
    pageLevelLocationOption: Locator;
    pageReachDetailsMoreOptions: Locator;
    postReachDetailsMoreOptions: Locator;


    constructor(public page: Page) {
        this.analyticsSidebarLink = page.getByRole('link', { name: 'Analytics', exact: true })
        this.facebookReachDashboardSidebarLink = page.getByRole('link', { name: 'Facebook Reach' })
        this.pageReach = page.frameLocator('iframe[title="periscope-report"]').getByText('Page Reach organic paid viral')
        this.postReach = page.frameLocator('iframe[title="periscope-report"]').getByText('Post Reach organic paid viral')
        this.pageReachDetails = page.frameLocator('iframe[title="periscope-report"]').getByText('Page Reach Details average')
        this.postReachDetails = page.frameLocator('iframe[title="periscope-report"]').getByText('Post Reach Details average')
        this.commonFilterBar = page.getByTestId('common-filters')
        this.commonFiltersButton = page.getByTestId('ZNT-filter-wrapper_open-filters')
        this.clearAllButton = page.getByTestId('ZNT-filter-wrapper_dropdown-clear-all')
        this.groupFilterOption = page.getByTestId('cascade-group-filter_select-wrapper')
        this.cancelDropdownFiltersButton = page.getByTestId('ZNT-filter-wrapper_cancel')
        this.applyDropdownFiltersButton = page.getByTestId('ZNT-filter-wrapper_close-filters')
        this.datePicker = page.getByTestId('month-year-picker-input')
        this.presetDatesDropdown = page.getByTestId('preset-options-selector_select-wrapper')
        this.datePickerOkButton = page.getByRole('button', {name: 'Ok'})
        this.businessFilterDropdown = page.getByTestId('cascade-account-filter_select-wrapper').locator('svg')
        this.aggregationDropdown = page.getByTestId('aggregation-simple-selector_select-wrapper').locator('svg')
        this.pageLevelDropdown = page.getByTestId('pagetype-simple-selector_select-wrapper').locator('svg')
        this.aggregationOptionDay = page.getByTestId('Day')
        this.aggregationOption28Days = page.getByTestId('TwentyEightDays')
        this.aggregationOptionWeek = page.getByTestId('Week')
        this.pageLevelBrandOption = page.getByTestId('Brand')
        this.pageLevelLocationOption = page.getByTestId('Location')
        this.pageReachDetailsMoreOptions = page.frameLocator('iframe[title="periscope-report"]').locator('table tr').nth(0).locator('td').nth(1);
    }

    async navigateToFacebookReachDashboard() {
        await this.analyticsSidebarLink.click()
        await this.facebookReachDashboardSidebarLink.click()
    }

    async verifyDashboardLoad() {
        await this.pageReach.isVisible()
        await this.postReach.isVisible()
        await this.pageReachDetails.isVisible()
        await this.postReachDetails.isVisible()
    }

    async verifyFilterBarIsShown() {
        await this.commonFiltersButton.click()
        await this.datePicker.isVisible()
    }

    async verifyFacebookReachFilters() {
        await this.verifyFilterBarIsShown
        await this.commonFiltersButton.click()
        await this.groupFilterOption.isVisible()
        await this.businessFilterDropdown.isVisible()
        await this.aggregationDropdown.isVisible()
        await this.pageLevelDropdown.isVisible()
    }

    async verifyAggregationDropdownData() {
        await this.aggregationDropdown.click({ timeout: 5000 })
        await this.page.waitForSelector('text=Page Reach')
        await this.page.waitForSelector('text=Post Reach')
        await this.page.waitForSelector('text=Page Reach Details')
        await this.page.waitForSelector('text=Post Reach Details')
    }

    async downloadPageReachDetails() {
        await this.pageReachDetails.isVisible()
        await this.pageReachDetailsMoreOptions.click({ timeout: 10000 })
    }
}