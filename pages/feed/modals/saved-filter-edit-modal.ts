import { Locator, Page } from '@playwright/test'

export class SavedFilterSettingsModal {
    readonly page           : Page
    readonly filterNameField: Locator
    readonly subscribeToggle: Locator
    readonly shareToggle    : Locator
    readonly cancelButton   : Locator
    readonly saveButton     : Locator

    constructor(page: Page){
        this.page            = page
        this.filterNameField = page.getByTestId("crossfeed-save-edit-filter-name-input")
        this.subscribeToggle = page.getByTestId("crossfeed-save-edit-filter-subscribe-toggle")
        this.shareToggle     = page.getByTestId("crossfeed-save-edit-filter-share-toggle")
        this.saveButton      = page.getByTestId("crossfeed-save-edit-filter-button")
        this.cancelButton    = page.getByTestId("crossfeed-save-edit-filter-button")
    }
}
