import { expect, Locator, Page } from "@playwright/test";

export default class storeLocatorMap {
    readonly page: Page;
    readonly mapPopUpClass: Locator
    readonly clickResultsList: (resultsList: string) => Locator

    constructor(page: Page) {
        this.page = page
        this.mapPopUpClass = page.locator('.mf-popup-content')
        this.clickResultsList = (resultsList: string) => this.page.getByText(`${resultsList}`)
    }
}
