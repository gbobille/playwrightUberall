import { Locator, Page, expect } from "@playwright/test";
import * as path from 'path';

export default class FileImport {
    locationTemplateTitle: Locator

    constructor(private page: Page) {
        this.locationTemplateTitle = page.getByText('Location Template Import', { exact: true })
    }

    public dropFileArea: Locator = this.page.locator('input[type="file"]')
    public continueBtn: Locator = this.page.locator('button[type=button]:has-text("Continue")')
    public startImportBtn: Locator = this.page.locator('button[type=button]:has-text("Start Import")')
    public successMessageFileImport: Locator = this.page.locator('h1[class="file-import-summary-page-header"]')
    //
    public bulkUpdateButton: Locator = this.page.locator('text=Bulk Update');
    public excelImportOption: Locator = this.page.locator('[data-testid="excel-import-option"]');
    public selectFileButton: Locator = this.page.locator('role=button[name="Select file"]');
    public continueButton: Locator = this.page.locator('role=button[name="Continue"]');
    public fileInput: Locator = this.page.locator('role=button[name="Select file"]');

    async uploadFile() {
        await this.dropFileArea.setInputFiles(path.resolve(__dirname, '../../tests/testData/File Import Location.xlsx'));
    }

    async clickContinue() {
        await this.continueBtn.click()
    }

    async clickStartImport() {
        await this.startImportBtn.click()
    }

    async validateFileImportFinished() {
        await expect(this.successMessageFileImport).toBeVisible()
    }
}


