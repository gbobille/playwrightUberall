import { Locator, Page } from '@playwright/test'

export class BulkAIResponsesModal {
    readonly page            : Page
    readonly replyButton     : Locator
    readonly backButton      : Locator
    readonly cancelButton    : Locator
    readonly errorMessage    : Locator
    readonly editReplyButton : (indexPosition: number) => Locator
    readonly regenerateButton: (indexPosition: number) => Locator
    readonly aiGeneratedReply: (indexPosition: number) => Locator

    constructor (page: Page) {
        this.page             = page
        this.replyButton      = page.getByTestId('bulk-reply-btn')
        this.backButton       = page.getByTestId('reply-back-btn')
        this.cancelButton     = page.getByTestId('cancel-bulk-reply-btn')
        this.errorMessage     = page.getByText('Oops, something went wrong!')
        this.editReplyButton  = (indexPosition: number) => page.getByTestId('edit-reply-btn').nth(indexPosition)
        this.regenerateButton = (indexPosition: number) => page.getByTestId('regenerate-reply-btn').nth(indexPosition)
        this.aiGeneratedReply = (indexPosition: number) => page.getByTestId('reply-actions').nth(indexPosition)
    } 
}
