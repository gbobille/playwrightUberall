import { Page, TestInfo } from "@playwright/test";

/**
 * Captures a screenshot of the given page and saves it to the specified path in the project.
 * @param {Page} page - The Playwright page object.
 * @param {string} path - The path where the screenshot will be saved.
 * @returns {Promise<void>}
 */
export async function captureScreenshotToPath(page: Page, path: string) {
    const formattedDate = new Date().toISOString();
    await page.screenshot({ path: `./test-results/screenshots/${path}/screenshot-${formattedDate}.png`, fullPage: true })
}

/**
 * Captures a screenshot of the given page and attaches it to the test report.
 * @param {Page} page - The Playwright page object.
 * @param {TestInfo} testInfo - The Playwright test information object accessible by all test functions. 
 *                              It contains information about the currently running test, such as its title, 
 *                              status, and any attachments.
 * @returns {Promise<void>}
 */
export async function captureScreenshotToReport(page: Page, testInfo: TestInfo) {
    const formattedDate = new Date().toISOString();
    const screenshot = await page.screenshot({ path: `./test-results/screenshots/${testInfo.title}/screenshot-${formattedDate}.png`, fullPage: true })
    testInfo.attach(`${testInfo.title} -- Screenshot`, {
        body: screenshot,
        contentType: 'image/png',
    })
}
