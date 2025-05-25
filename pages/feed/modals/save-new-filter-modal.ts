import { Locator, Page } from "@playwright/test";

export class SaveNewFilterModal {
    readonly page                  : Page
    readonly filterNameInputBox    : Locator
    readonly subscribeToEmailToggle: Locator
    readonly shareFilterToggle     : Locator
    readonly saveButton            : Locator
    readonly cancelButton          : Locator
    readonly immediatelyRadioButton: Locator
    readonly dailyRadioButton      : Locator

    constructor(page: Page){
        this.page                   = page
        this.filterNameInputBox     = page.getByTestId('crossfeed-save-edit-filter-name-input')
        this.subscribeToEmailToggle = page.getByTestId('crossfeed-save-edit-filter-subscribe-toggle')
        this.shareFilterToggle      = page.getByTestId('crossfeed-save-edit-filter-share-toggle')
        this.saveButton             = page.getByTestId('crossfeed-save-edit-filter-button')
        this.cancelButton           = page.getByRole('button', { name: 'Cancel' })
        this.immediatelyRadioButton = page.locator('label').filter({ hasText: 'Immediately' }).locator('span').nth(1)
        this.dailyRadioButton       = page.locator('label').filter({ hasText: 'Daily' }).locator('span').nth(1)
    }

    async enableSubscribeToEmail(immediatelyOptionEnabled: boolean){
        await this.subscribeToEmailToggle.click()
        if(immediatelyOptionEnabled){
            await this.immediatelyRadioButton.click()
        }
    }
}
