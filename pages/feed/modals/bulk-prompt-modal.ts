import { Locator, Page } from '@playwright/test'

export class BulkPromptModal {
    readonly page                : Page
    readonly generateAIButton    : Locator
    readonly manualResponseButton: Locator

    constructor (page: Page) {
        this.page                 = page
        this.generateAIButton     = page.getByTestId('bulk-generate-reply-options-btn')
        this.manualResponseButton = page.getByTestId('bulk-write-reply-options-btn')
    }
}
