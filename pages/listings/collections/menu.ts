import { Page, expect, Locator } from "@playwright/test";
export default class Menu {
    updateButton: Locator

    constructor(page: Page) {
        this.updateButton = page.getByTestId('actions-bar-update')
    }
}