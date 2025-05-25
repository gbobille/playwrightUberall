import {Locator, Page} from '@playwright/test'

export class WebhooksPage {
    static readonly url = `${process.env.BASE_URL}/en/app/uberall/settings/webhooks`

    readonly page: Page
    readonly addWebhookButton: Locator
    readonly addFirstWebhookButton: Locator
    readonly submitWebhookButton: Locator
    readonly webhookUrlInput: Locator
    readonly webhookTypeDropdown: Locator
    readonly deleteButtonSubmit: Locator
    readonly creationSuccessToast: Locator
    readonly editionSuccessToast: Locator
    readonly deletionSuccessToast: Locator
    readonly webhooksTableRows: Locator

    constructor(page: Page) {
        this.page = page
        this.addWebhookButton = page.locator("//button//span[text()= 'New Webhook']")
        this.addFirstWebhookButton = page.locator("//button//span[text()= 'Add New Webhook']")
        this.submitWebhookButton = page.locator("//button[@type='submit']")
        this.webhookUrlInput = page.locator("//input[@data-testid='webhookUrl']")
        this.webhookTypeDropdown = page.locator("//div[@data-testid='webhookType_select-wrapper']")
        this.deleteButtonSubmit = page.locator("//button//span[contains(text(), 'Delete')]")
        this.creationSuccessToast = page.locator("//span[contains(text(), 'New Webhook was succesfully created')]")
        this.editionSuccessToast = page.locator("//span[contains(text(), 'Webhook was successfully modified')]")
        this.deletionSuccessToast = page.locator("//span[contains(text(), 'Webhook was successfully deleted')]")
        this.webhooksTableRows = page.locator("//tbody[@role='rowgroup']//tr")
    }

    async goTo(): Promise<void> {
        await this.page.goto(WebhooksPage.url)
        await this.page.waitForLoadState('load')
    }

    async isAt(): Promise<boolean> {
        await this.page.waitForLoadState('load')
        await Promise.race([
            this.addFirstWebhookButton.waitFor({state: 'visible', timeout: 30000}),
            this.addWebhookButton.waitFor({state: 'visible', timeout: 30000})
        ])
        return true
    }

    async clickOnAddWebhookButton(): Promise<void> {
        if (await this.addFirstWebhookButton.isVisible()){
            await this.addFirstWebhookButton.click()
        }
        else {
            await this.addWebhookButton.click()
        }
        await this.webhookUrlInput.waitFor({state: 'visible', timeout: 50000})
        await this.webhookTypeDropdown.waitFor({state: 'visible', timeout: 50000})
    }

    async addWebhookData(pushUrl: string, type: string): Promise<void> {
        await this.inputWebhookUrl(pushUrl)
        await this.selectWebhookType(type)
        await this.submitWebhookButton.click()
    }

    async inputWebhookUrl(url: string): Promise<void> {
        await this.webhookUrlInput.waitFor({state: 'visible', timeout: 10000})
        await this.webhookUrlInput.fill(url)
    }

    async selectWebhookType(type: string): Promise<void> {
        await this.webhookTypeDropdown.waitFor({state: 'visible'})
        await this.webhookTypeDropdown.click()
        const option = this.page.locator(`//span[@title='${type}']`)
        await option.click()
    }


    async clickOnDeleteConfirmation(): Promise<void> {
        await this.deleteButtonSubmit.waitFor({state: 'visible', timeout: 10000})
        await this.deleteButtonSubmit.click()
    }

    async waitForCreationSuccessToast(): Promise<void> {
        await this.creationSuccessToast.waitFor({state: 'visible', timeout: 10000})
        await this.creationSuccessToast.waitFor({state: 'hidden', timeout: 10000})
    }

    async waitForEditionSuccessToast(): Promise<void> {
        await this.editionSuccessToast.waitFor({state: 'visible', timeout: 10000})
        await this.editionSuccessToast.waitFor({state: 'hidden', timeout: 10000})
    }

    async waitForDeletionSuccessToast(): Promise<void> {
        await this.deletionSuccessToast.waitFor({state: 'visible', timeout: 10000})
        await this.deletionSuccessToast.waitFor({state: 'hidden', timeout: 10000})
    }

    async getAllWebhooks(): Promise<WebhookInTable[]> {
        await new Promise(resolve => setTimeout(resolve, 3000))
        const webhooks: WebhookInTable[] = []
        const rows = this.webhooksTableRows
        const rowCount = await rows.count()

        async function getCellText(row: Locator, cellIndex: number): Promise<string> {
            const cellLocator = row.locator(`xpath=.//td[@role='cell'][${cellIndex}]`)
            return (await cellLocator.textContent())?.trim() || ''
        }

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i)

            const pushUrl = (await row.locator("xpath=.//div[contains(@class, 'webhooks-url-tooltip')]").textContent())?.trim() || ''
            const type = await getCellText(row, 2)
            const status = await getCellText(row, 3)
            const date = await getCellText(row, 4)
            const editButton = row.locator("xpath=.//button[@data-testid='webhook-click-edit']")
            const deleteButton = row.locator("xpath=.//button[@data-user-event='webhook-click-delete']")

            webhooks.push({
                pushUrl,
                type,
                status,
                date,
                editButton,
                deleteButton,
            })
        }

        return webhooks
    }
}

export interface WebhookInTable
{
    pushUrl: string
    type: string
    status: string
    date: string
    editButton: Locator | null
    deleteButton: Locator | null
}