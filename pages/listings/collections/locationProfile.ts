import { Page, Locator } from "@playwright/test";
export default class Menu {
    addSoh: Locator
    selectDays: Locator
    applyButton: Locator
    dateToday: Locator
    saveButton: Locator
    successMessage: Locator

    constructor(page: Page) {
        this.addSoh = page.getByRole('link', { name: '+ Add further special opening' })
        this.selectDays = page.getByRole('button', { name: 'Select day(s)' })
        this.applyButton = page.getByRole('button', { name: 'Apply' })
        this.dateToday = page.locator('.DayPicker-Day--today')
        this.saveButton = page.getByTestId('save-changes-bar-save-button')
        this.successMessage = page.locator('div').filter({ hasText: /^Changes have been saved successfully\.$/ }).nth(3)
    }
}