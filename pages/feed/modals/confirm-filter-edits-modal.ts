import { Locator, Page } from '@playwright/test'

export class ConfirmFilterEditsModal {
    readonly page                 : Page
    readonly saveButton           : Locator
    readonly cancelButton         : Locator
    readonly saveChangesOption    : Locator
    readonly saveToNewFilterOption: Locator

    constructor (page: Page) {
        this.page                  = page
        this.saveButton            = page.getByTestId('crossfeed-override-filter-modal-save-button')
        this.cancelButton          = page.getByTestId('crossfeed-override-filter-modal-cancel-button')
        this.saveChangesOption     = page.getByText('Save changes to filter')
        this.saveToNewFilterOption = page.getByText('Save as new filter')
    }
}