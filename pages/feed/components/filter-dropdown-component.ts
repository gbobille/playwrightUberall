import { Locator, Page } from '@playwright/test'

export class FilterDropdownComponent {
    readonly page                  : Page
    readonly filtersButton         : Locator
    readonly ownedPostsCheckbox    : Locator
    readonly brandPostsCheckbox    : Locator
    readonly directorySelectWrapper: Locator
    readonly feedbackSelectWrapper : Locator
    readonly reviewsSelectWrapper  : Locator
    readonly businessSelectWrapper : Locator
    readonly countriesSelectWrapper: Locator
    readonly locationsSelectWrapper: Locator
    readonly doneButton            : Locator
    readonly cancelButton          : Locator
    readonly saveFilterButton      : Locator
    readonly directoryResultsList  : Locator
    readonly labelsSelectWrapper   : Locator
    readonly labelsCombobox        : Locator
    readonly groupCombobox         : Locator
    readonly groupsSelectWrapper   : Locator
    readonly directoryCombobox     : Locator

    constructor(page: Page){
        this.page                   = page
        this.filtersButton          = page.getByTestId('crossfeed-filters_open-filters')
        this.brandPostsCheckbox     = page.getByTestId('crossfeed-brand_pages-filter-checkbox')
        this.ownedPostsCheckbox     = page.getByTestId('crossfeed-owned_posts-filter-checkbox')
        this.feedbackSelectWrapper  = page.locator('[data-user-event="feed-feedback-filter"]').getByTestId('ZNT-dropdown_select-wrapper')
        this.reviewsSelectWrapper   = page.locator('[data-user-event="feed-review-filter"]').getByTestId('ZNT-dropdown_select-wrapper')
        this.businessSelectWrapper  = page.getByTestId('crossfeed-accounts-filter_select-wrapper')
        this.countriesSelectWrapper = page.getByTestId('crossfeed-country-filter_select-wrapper')
        this.locationsSelectWrapper = page.getByTestId('crossfeed-location-filter_select-wrapper')
        this.labelsSelectWrapper    = page.getByTestId('crossfeed-label-filter_select-wrapper')
        this.labelsCombobox         = page.getByTestId('crossfeed-label-filter_select-wrapper').getByRole('combobox')
        this.doneButton             = page.getByTestId('crossfeed-filters_close-filters')
        this.cancelButton           = page.getByTestId('crossfeed-filters_cancel')
        this.saveFilterButton       = page.getByTestId('crossfeed-filters_save-filters')
        this.groupsSelectWrapper    = page.getByTestId('crossfeed-group-filter_select-wrapper')
        this.groupCombobox          = page.getByTestId('crossfeed-group-filter_select-wrapper').getByRole('combobox')
        this.directorySelectWrapper = page.getByTestId('crossfeed.actionbar.filter.channel.channel_type_label_select-wrapper')
        this.directoryResultsList   = page.getByTestId('crossfeed.actionbar.filter.channel.channel_type_label_select-wrapper').getByTestId('#all')
        this.directoryCombobox      = page.getByTestId('crossfeed.actionbar.filter.channel.channel_type_label_select-wrapper').getByRole('combobox')
    }

    async selectDirectoryFilter(directory: string){
        await this.page.waitForLoadState('networkidle')
        await this.directorySelectWrapper.click({timeout: 3000})
        await this.directoryResultsList.isVisible({timeout: 3000})
        await this.page.waitForLoadState('load')
        await this.directoryCombobox.fill(directory)
        await this.directorySelectWrapper.getByText(directory, { exact: true }).click()
    }

    async selectFeedbackFilter(feedback: string){
        await this.feedbackSelectWrapper.click()
        await this.feedbackSelectWrapper.getByTestId(feedback.toLowerCase()).click()
    }

    async selectReviewsTextFilter(reviewsText: string){
        await this.reviewsSelectWrapper.click()
        await this.reviewsSelectWrapper.getByTestId(reviewsText.toLowerCase()).click()
    }

    async selectLabelFilter(label: string){
        await this.labelsSelectWrapper.click()
        await this.labelsCombobox.fill(label)
        await this.page.locator('label').filter({ hasText: label }).first().click({timeout: 10000})
        await this.page.waitForLoadState('domcontentloaded')
        await this.labelsSelectWrapper.click()
    }

    async selectGroupFilterUsingClipboard(groupName: string){
        await this.groupsSelectWrapper.click()
        await this.page.waitForLoadState('domcontentloaded')
        await this.groupCombobox.fill(groupName)
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.getByText(groupName, { exact: true }).click()
        await this.page.waitForLoadState('domcontentloaded')
        await this.groupsSelectWrapper.click()
    }
}
