import { expect, Locator, Page } from "@playwright/test";

export default class LocalSEOPage {
    // NAVIGATION
    analyticsSidebarLink: Locator
    localSEOSidebarLink: Locator
    // FILTER DROPDOWN
    localSEOCommonFilters: Locator
    localSEOFilters: Locator
    localSEOFiltersClearAllButton: Locator
    accountFilterOption: Locator
    groupFilterOption: Locator
    locationFilterOption: Locator
    keywordFilterOption: Locator
    clearAllDropdownFiltersButton: Locator
    cancelDropdownFiltersButton: Locator
    applyDropdownFiltersButton: Locator
    // DATE PICKER
    datePicker: Locator
    presetDatesDropdown: Locator
    startMonthDropdown: Locator
    startYearDropdown: Locator
    endMonthDropdown: Locator
    endYearDropdown: Locator
    datePickerOkButton: Locator
    // LOCATIONS RANKING (NEW DASHBOARD)
    locationRankSummary: Locator
    locationRankTop1: Locator
    locationRankTop3: Locator
    locationRankTop10: Locator
    // KEYWORD RANKING (NEW DASHBOARD)
    keywordRankingModalOpenButton: Locator
    keywordRankingModalTitle: Locator
    keywordRankingModalBody: Locator
    keywordRankingModalCloseButton: Locator
    colorGreen: Locator
    colorYellow: Locator
    colorRed: Locator
    colorBlank: Locator

    constructor(public page: Page) {
        this.analyticsSidebarLink = page.getByRole('link', { name: 'Analytics', exact: true })
        this.localSEOSidebarLink = page.getByRole('link', { name: 'Local SEO' })
        this.localSEOCommonFilters = page.getByTestId('common-filters')
        this.localSEOFilters = page.getByTestId('ZNT-filter-wrapper_open-filters')
        this.localSEOFiltersClearAllButton = page.getByTestId('ZNT-filter-wrapper_dropdown-clear-all')
        this.accountFilterOption = page.getByTestId('cascade-account-filter_select-wrapper')
        this.groupFilterOption = page.getByTestId('cascade-group-filter_select-wrapper')
        this.locationFilterOption = page.getByTestId('cascade-location-filter_select-wrapper')
        this.keywordFilterOption = page.getByTestId('cascade-keyword-filter_select-wrapper')
        this.clearAllDropdownFiltersButton = page.getByTestId('ZNT-filter-wrapper_dropdown-clear-all')
        this.cancelDropdownFiltersButton = page.getByTestId('ZNT-filter-wrapper_cancel')
        this.applyDropdownFiltersButton = page.getByTestId('ZNT-filter-wrapper_close-filters')
        this.datePicker = page.getByTestId('month-year-picker-input')
        this.presetDatesDropdown = page.getByTestId('preset-options-selector_select-wrapper')
        this.startMonthDropdown = page.getByTestId('startMonth-selector_select-wrapper')
        this.startYearDropdown = page.getByTestId('startYear-selector_select-wrapper')
        this.endMonthDropdown = page.getByTestId('endMonth-selector_select-wrapper')
        this.endYearDropdown = page.getByTestId('endYear-selector_select-wrapper')
        this.datePickerOkButton = page.getByRole('button', {name: 'Ok'})
        this.locationRankSummary = page.getByTestId('top-ranks-section')
        this.locationRankTop1 = page.getByTestId('top-rank-container').getByText('Locations in #1')
        this.locationRankTop3 = page.getByTestId('top-rank-container').getByText('Locations in Top 3')
        this.locationRankTop10 = page.getByTestId('top-rank-container').getByText('Locations in Top 10')
        this.keywordRankingModalOpenButton = page.getByTestId('seo-report-bottom-section-modal-button').getByText('What does this mean')
        this.keywordRankingModalTitle = page.getByText('Understanding keyword ranking')
        this.keywordRankingModalBody = page.getByTestId('keyword-ranking-modal')
        this.keywordRankingModalCloseButton = page.getByTestId('button-close-keyword-ranking-modal')
        this.colorGreen = page.getByTestId('color-description-container').getByText(/^Green$/)
        this.colorYellow = page.getByTestId('color-description-container').getByText(/^Yellow$/)
        this.colorRed = page.getByTestId('color-description-container').getByText(/^Red$/)
        this.colorBlank = page.getByTestId('color-description-container').getByText(/^Blank$/)
    }

    async checkDateFilterDropdown() {
        await this.datePicker.click()
        await expect(this.presetDatesDropdown).toBeVisible()
        await expect(this.startMonthDropdown).toBeVisible()
        await expect(this.startYearDropdown).toBeVisible()
        await expect(this.endMonthDropdown).toBeVisible()
        await expect(this.endYearDropdown).toBeVisible()
        await this.datePickerOkButton.click()
    }


    async verifyDateFilterIsDisplayed() {
        await expect(this.datePicker).toBeVisible()
    }

    async setDateFilters(startMonth:string, startYear:string, endMonth:string, endYear:string) {
        // months are full name, years are 4 digits
        await this.datePicker.click()
        await this.startMonthDropdown.click()
        let startMonthElems = await this.page.getByText(startMonth)
        if (await startMonthElems.count() == 2) {
            await this.page.getByText(startMonth).first().click()
        }
        else {
            await this.page.getByText(startMonth).click()
        }
        await this.startYearDropdown.click()
        await this.page.getByTestId(startYear).click()
        await this.endMonthDropdown.click()
        let endMonthElements =  await this.page.getByText(endMonth)
        if (await endMonthElements.count() == 2) {
            await this.page.getByText(endMonth).last().click()
        }
        else {
            await this.page.getByText(endMonth).click()
        }
        await this.endYearDropdown.click()
        await this.page.getByTestId(endYear).click()
        await this.datePickerOkButton.click()
        await this.page.waitForTimeout(1000)
    }

    async navigateToLocalSEODashboard() {
        await this.analyticsSidebarLink.click()
        await this.localSEOSidebarLink.click()
    }
    
    async checkDashboardPanels() {
        await expect(this.locationRankSummary).toBeVisible()
        await expect(this.keywordRankingModalOpenButton).toBeVisible()
    }

    async openKeywordRankingModal() {
        await this.keywordRankingModalOpenButton.click()
    }

    async verifyKeywordRankingModalColors() {
        await expect(this.colorGreen).toBeVisible()
        await expect(this.colorYellow).toBeVisible()
        await expect(this.colorRed).toBeVisible()
        await expect(this.colorBlank).toBeVisible()
    }
    
    async verifyKeywordSortOrder(keyword:string) {
        let keywordHeader = await this.page.getByRole('columnheader', { name: keyword })
        let columns = await this.page.getByRole('columnheader')
        let count = await this.page.getByRole('columnheader').count()
        let index = -1

        for (var i = 0; i < count; i++) {
            const element = await columns.nth(i)
            if((await element.innerText()) == keyword) {
                index = i
            }
        }
        await keywordHeader.click()
        await this.page.waitForTimeout(2000)
        let sortedDesc = await this.page.locator(`tr > td:nth-child(${index}) > div`).allTextContents()
        await keywordHeader.click()
        await this.page.waitForTimeout(2000)
        let sortedAsc = await this.page.locator(`tr > td:nth-child(${index}) > div`).allTextContents()
        expect(sortedDesc).toEqual([...sortedDesc].sort().reverse())
        expect(sortedAsc).toEqual([...sortedAsc].sort())
    }
}
