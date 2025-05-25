import { Locator, Page } from '@playwright/test';

class SearchBar {
    private page: Page;
    private searchBarDiv: Locator;
    private searchBarInput: Locator;
    private searchFilterBtn: Locator;
    private clearSearchInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchBarDiv = page.locator("//div[contains(@class, 'searchBar')]");
        this.searchBarInput = page.locator("//div[contains(@class, 'searchBar')]/input");
        this.searchFilterBtn = page.locator("//div[contains(@class, 'searchBar')]/div[contains(@class, 'Button')]");
        this.clearSearchInput = page.locator("//div[@class='filter-search-box']//img[contains(@class, 'clearButton')]");
    }

    async searchFor(search: string) {
        await this.searchBarDiv.waitFor({state: 'visible', timeout: 30000})
        await this.clearSearchInputField()
        await this.searchBarInput.fill(search)
        await this.searchFilterBtn.click()
        await this.page.waitForLoadState('domcontentloaded')
    }

    async clearSearchInputField() {
        if (await this.clearSearchInput.isVisible()) {
            await this.clearSearchInput.click();
        }
    }
}

export { SearchBar };