import { expect, Locator, Page } from "@playwright/test";

export default class Messages {
    messagesSetup: Locator
    setupTable: Locator
    newSetupButton: Locator


    constructor(public page: Page) {
        this.messagesSetup = page.getByRole('link', { name: 'Messages' })
        this.setupTable = page.getByRole('link', { name: 'Setup' })
    }

    async clickOnMessages() {
        await this.messagesSetup.click({ timeout: 50000 })
    }

    async navigateToSetupTable() {
        await this.setupTable.click({ timeout: 50000 })
    }

    async navigateToNewSetup() {
        await this.page.getByRole('button', { name: 'New Setup' }).click({ timeout: 50000 })
    }

    async activateBusinessToggle() {
        await this.page.getByTestId('chatbot-form-business-toggle').click()
    }

    async clickOnAccount() {
        await this.page.locator('.css-ackcql').click()
    }

    async selectAccountFromDropDown() {
        await this.page.getByTestId('1465457').click()
    }

    async selectFBBrandToggle() {
        await this.page.getByTestId('facebook-business-level-toggle').check()
    }

    async selectWebchatToggle() {
        await this.page.getByTestId('toggle-widget-channel').check()
    }

    async clickSave() {
        await this.page.getByTestId('save-chatbot-settings').click()
    }

    async nameErrorMessage() {
        await this.page.getByText('Please fill setup name').click()
    }

    async logoErrorMessage() {
        await this.page.getByText("Please upload logo").click()
    }
    
    async languageErrorMessage() {
        await this.page.getByText("Please select language").click()
    }
       
    async chatNameErrorMessage() {
        await this.page.getByText("Please fill chat name").click()
    }
       

}