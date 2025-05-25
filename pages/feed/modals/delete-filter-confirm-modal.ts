import { Locator, Page } from '@playwright/test'

export class DeleteFilterConfirmModal {
    readonly page                 : Page
    readonly deleteButton         : Locator
    readonly cancelButton         : Locator

    constructor (page: Page) {
        this.page                  = page
        this.deleteButton          = page.getByTestId('crossfeed-delete-filter-button')
        this.cancelButton          = page.getByTestId('crossfeed-override-filter-modal-cancel-button')
    } 
}
