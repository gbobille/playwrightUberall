import { expect, test } from "@playwright/test";
import StoreLocatorPage from "../../../pages/websites/storeLocator";
import Utils from "../../../utils/utils";

test.describe("Customer storelocators", async () => {
    const utils = new Utils()
    const records = await utils.readDataFromCSV('tests/testData/LocatorsURLs.csv')

    records.forEach(record => {
        test(`Check: ${record.name} store locator is displayed @prodregression @customersSF @webregression @regressionSF`, async ({ page }) => {
                const storeLocator = new StoreLocatorPage(page)
                await test.step(`Given user navigates to ${record.UberallLocatorURL}`, async () => {
                    await page.goto(`${record.UberallLocatorURL}`, { waitUntil: 'domcontentloaded' })
                })

                await test.step("When user accepts the cookies", async () => {
                    await storeLocator.acceptCookies(`${record.CookieString}`)
                    await page.reload()
                    await page.reload()
                    await page.waitForLoadState('domcontentloaded')
                })

                await test.step("Then the storefinder is loaded successfully", async () => {
                    await expect(storeLocator.searchBtn).toBeVisible()
                    await storeLocator.verifyFirstLocationData()
                    await storeLocator.verifyMapIsVisible()
                })
            })
    })

    // test.afterEach(async ({ page }) => {
    //         await page.close()
    // })

})