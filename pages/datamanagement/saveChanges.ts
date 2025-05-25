import { Locator, Page, expect } from "@playwright/test";

export default class SaveChangesBar {
    constructor(private page: Page) {}
    public discardButton: Locator  = this.page.locator('button[data-testid=\"footer-discard-action\"]')
    public saveButton: Locator = this.page.locator('button[data-testid=\"save-changes-bar-save-button\"]')
    public nextButton: Locator = this.page.locator('button[data-testid=\"footer-next-action\"]')

    async clickSaveButton() {
        await this.saveButton.click()
    }

    async clickNextButton() {
        await this.nextButton.click()
    }
}