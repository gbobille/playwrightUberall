import { expect, test } from "@playwright/test";
import StoreLocator from "../../../pages/lp/storeLocator";
import LocalPage from "../../../pages/lp/localPage";
import Utils from "../../../utils/utils";

test.describe("Store finder accessibility violations", async () => {
    const utils = new Utils()
    const records = await utils.readDataFromCSV('tests/lp/testData/QA_StoreLocators.csv')

    records.forEach(record => {
        test(`Check Store Locator: ${record.clientName} has no violations @accessibility`, async ({ page }, testInfo) => {
            await page.goto(`${record.StoreLocatorURL}`, { waitUntil: 'networkidle' })
            const storeLocator = new StoreLocator(page)

            await storeLocator.searchLocation(record.searchItem)
            await storeLocator.verifySearchResults(record.verifiedLocation)

            const violations = await utils.violationsScanner(await utils.accessibilityScanner(page),testInfo.title)
            expect(violations).toEqual([])
        })

        test(`Check Local Page: ${record.clientName} has no violations @accessibility`, async ({ page }, testInfo) => {
            await page.goto(`${record.StoreLocatorURL}`, { waitUntil: 'networkidle' })
            const storeLocator = new StoreLocator(page)
            const localPage = new LocalPage(page)

            await storeLocator.searchLocation(record.searchItem)
            await storeLocator.clickLocalPageButton(record.localPageButton)
            await localPage.localPageTextIsDisplayed(record.localPageText)
            await localPage.localPageLinkIsDisplayed(record.localPageLink)
            await localPage.localPageHoursDisplayed(record.localPageHours)

            const violations = await utils.violationsScanner(await utils.accessibilityScanner(page),testInfo.title)
            expect(violations).toEqual([])
        })
    })
 })
