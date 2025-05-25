import { test, expect } from '@playwright/test';
import StoreLocatorPage from '../../../../pages/websites/storeLocator';
import Utils from '../../../../utils/utils';

test.describe("Check customers SF accessibility violations", async () => {
    const utils = new Utils()
    const records = await utils.readDataFromCSV('tests/testData/LocatorsURLs.csv')

    records.forEach(record => {
        test(`Check: ${record.name} has no violations @accessibility`, async ({ page }, testInfo) => {
            await page.goto(`${record.UberallLocatorURL}`, { waitUntil: 'networkidle' })
            const storeLocator = new StoreLocatorPage(page)
            await storeLocator.acceptCookies(`${record.CookieString}`)
            await expect(storeLocator.searchBtn).toBeVisible()
            //const violations = await utils.accessibilityScanner(page);
            const violations = await utils.violationsScanner(await utils.accessibilityScanner(page), testInfo.title)
            expect(violations).toEqual([])
        });

        test(`Check: ${record.name} location local page has no violations @accessibility`, async ({ page }, testInfo) => {
            await page.goto(`${record.UberallLocatorURL}`, { waitUntil: 'networkidle' })
            const storeLocator = new StoreLocatorPage(page)
            await storeLocator.acceptCookies(`${record.CookieString}`)
            await expect(storeLocator.searchBtn).toBeVisible()
            await storeLocator.clickOnTheFirstStore()
            //const violations = await utils.accessibilityScanner(page);
            const violations = await utils.violationsScanner(await utils.accessibilityScanner(page), testInfo.title)
            expect(violations).toEqual([])
        });

    });
})