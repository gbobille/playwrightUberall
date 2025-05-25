import { Page, Locator, expect } from '@playwright/test';

export class TablePage {
    private page: Page;
    private tableLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.tableLocator = page.locator('div.posting-list');
    }

    async getRowCount(): Promise<number> {
        return await this.tableLocator.locator('tbody tr').count();
    }

}