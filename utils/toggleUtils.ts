import { Locator, Page } from '@playwright/test'

export class ToggleUtils {
    private static toggleLocator: (page: Page, nav: Locator) => Locator

    private static initializeConstructorElements() {
        this.toggleLocator = (page: Page, nav: Locator) => nav.locator("//div[@class='toggle-input-icon']")
    }

    static async toggleRadio(enable: boolean, nav: Locator) {
        this.initializeConstructorElements()
        await this.toggle(nav, enable)
    }

    private static async toggle(nav: Locator, mode: boolean) {
        this.initializeConstructorElements()
        const toggle = this.toggleLocator(nav.page(), nav)
        if (mode) {
            await toggle.click()
        }
    }
}
