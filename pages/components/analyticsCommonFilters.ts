import { expect, Locator, Page } from "@playwright/test";

export default class AnalyticsCommonFilters {
    // FILTER DROPDOWN
    commonFilterBar: Locator
    commonFiltersButton: Locator
    clearAllButton: Locator
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

    constructor(public page: Page) {
        this.commonFilterBar = page.getByTestId('common-filters')
        this.commonFiltersButton = page.getByTestId('ZNT-filter-wrapper_open-filters')
        this.clearAllButton = page.getByTestId('ZNT-filter-wrapper_dropdown-clear-all')
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
    }

    async applyFilters() {
        await this.applyDropdownFiltersButton.isEnabled()
        await this.applyDropdownFiltersButton.click()
        await this.page.waitForTimeout(5000)
    }

    async checkFilterDropdown(includes:Array<string>, excludes:Array<string>) {
        await this.commonFiltersButton.click()
        includes.forEach( filter => {
            this.verifyFilterBoxFilterIsDisplayed(filter)
        })
        excludes.forEach( filter => {
            this.verifyFilterBoxFilterIsNotDisplayed(filter)
        })
        await expect(this.clearAllDropdownFiltersButton).toBeVisible()
        await expect(this.applyDropdownFiltersButton).toBeVisible()
        await this.cancelDropdownFiltersButton.click()
    }

    async verifyFilterBoxFilterIsDisplayed(filterName:string) {
        switch (filterName) {
            case "Account":
                await expect(this.accountFilterOption).toBeVisible()
                break
            case "Group":
                await expect(this.groupFilterOption).toBeVisible()
                break
            case "Location":
                await expect(this.locationFilterOption).toBeVisible()
                break
            case "Keyword":
                await expect(this.keywordFilterOption).toBeVisible()
                break
        }
    }

    async verifyFilterBoxFilterIsNotDisplayed(filterName:string) {
        switch (filterName) {
            case "Account":
                await expect(this.accountFilterOption).toBeHidden()
                break
            case "Group":
                await expect(this.groupFilterOption).toBeHidden()
                break
            case "Location":
                await expect(this.locationFilterOption).toBeHidden()
                break
            case "Keyword":
                await expect(this.keywordFilterOption).toBeHidden()
                break
        }
    }

    async addLocationFilter(locationName:string) {
        await this.locationFilterOption.click()
        let locationFilterInput = this.page.locator('#react-select-7-input')
        await locationFilterInput.fill(locationName)
        let dropdownFirstItem = this.page.locator('#react-select-7-listbox > div > div:nth-child(1)')
        let firstItemText = await dropdownFirstItem.textContent()
        if (!firstItemText || firstItemText.includes('No results available')) {
            await this.page.waitForTimeout(5000)
        }
        await dropdownFirstItem.click()
    }

}
