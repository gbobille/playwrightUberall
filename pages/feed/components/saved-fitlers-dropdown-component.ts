import { Locator, Page } from '@playwright/test'

export class SavedFiltersDropdownComponent {
    readonly page                      : Page
    readonly savedFiltersCombobox      : Locator
    readonly savedFilterActionButton   : Locator
    readonly savedFilterSettingsButton : Locator
    readonly savedFilterDeleteButton   : Locator
    readonly savedFiltersDropdownButton: Locator    
    readonly savedFilterSavedList      : Locator

    constructor(page: Page){
        this.page                       = page
        this.savedFiltersCombobox       = page.getByTestId('crossfeed-saved-filter_select-wrapper').getByRole('combobox')
        this.savedFiltersDropdownButton = page.locator('.save-filter-select__indicators')
        this.savedFilterActionButton    = page.getByTestId("ZNT-floating-action-button_indicator")
        this.savedFilterSettingsButton  = page.getByText('Settings', { exact: true })
        this.savedFilterDeleteButton    = page.getByText('Delete')
        this.savedFilterSavedList       = page.locator('.save-filter-select__menu-list')
    }

    async selectExactMatchingFilter(filterName: string) {
        await this.savedFiltersCombobox.fill(filterName)
        await this.savedFilterSavedList.getByText( filterName, { exact: true }).click({ timeout: 10000 })
    }

    async selectFirstMatchingFilter(filterName: string) {
        await this.savedFiltersCombobox.fill(filterName)
        await this.savedFilterSavedList.getByText( filterName, { exact: false }).first().click()
    }

    async deleteFirstMatchingFilter(filterName: string) {
        await this.savedFiltersCombobox.fill(filterName)
        await this.savedFilterActionButton.first().click()
        await this.savedFilterDeleteButton.click()
    }
}
