import { Locator, Page } from "@playwright/test";

export class ToasterModal {
    readonly page                      : Page
    readonly toastContainer            : Locator
    readonly feedSuccessToaster        : Locator
    readonly savedFilterSuccessToaster : Locator
    readonly deleteFilterSuccessToaster: Locator

    constructor(page: Page) {
        this.page                       = page
        this.toastContainer             = page.getByTestId('toastcontainer')
        this.feedSuccessToaster         = this.toastContainer.getByTestId('crossfeed-success-toast')
        this.savedFilterSuccessToaster  = this.toastContainer.getByTestId('save-filters-success-toast')
        this.deleteFilterSuccessToaster = this.toastContainer.getByTestId('crossfeed-delete-filter-success-toast')
    }
}
   