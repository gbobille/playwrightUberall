import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Map from "../../pages/lp/components/map"
import Utils from "../../utils/utils";

test.describe("Customer Store Locators", async () => {
    const utils = new Utils()
    const records = await utils.readDataFromCSV('tests/lp/testData/ChairmanBrands_StoreLocators.csv')
    

        records.forEach(record => {

            test (`Check: ${record.clientName} Store Locator Map and Local Page are displayed and functioning properly @lp-store-locator @chairmanbrands`, async ({ page }) => {
                const storeLocator = new StoreLocator(page)
                const localPage = new LocalPage(page)
                const map = new Map(page)

                await test.step(`Given user navigates to ${record.StoreLocatorURL}`, async () => {
                    await page.goto(`${record.StoreLocatorURL}`, { waitUntil: 'networkidle' })
                    await storeLocator.waitForResultsList()
                })

                await test.step("When user checks the Navigation and Footer", async () => {
                    await expect(page).toHaveScreenshot({
                        fullPage: true,
                        mask: [page.locator('.store-locator-container')]
                    })
                })

                await test.step(`When user searches ${record.searchItem}`, async () => {
                    await storeLocator.searchLocation(record.searchItem)
                })

                await test.step(`And when the locations load successfuly`, async () => {
                    await expect(storeLocator.verifySearchResults(record.verifiedLocation)).toBeVisible({ timeout: 40000 })
                })

                await test.step(`And user selects a location`, async () => {
                    await map.clickResultsList(record.resultsList).click( {timeout: 40000} )
                })

                await test.step(`And user verifies mapPopUp appears on the map`, async () => {
                    await map.mapPopUpClass.click( {timeout: 40000} )
                })

                await test.step(`And when user clicks on a Local Page button`, async () => {
                    await storeLocator.clickLocalPageButton(record.localPageButton).click({ timeout: 40000 })
                })

                await test.step(`Then user verifies the Local Page is loading successfully`, async () => {
                    await localPage.localPageTextIsDisplayed(record.localPageText)
                    await expect(localPage.localPageLinkIsDisplayed(record.localPageLink)).toBeVisible()
                    await expect(localPage.localPageHoursDisplayed(record.localPageHours)).toBeVisible()
                    await localPage.mapIsDisplayed(record.localPage)
                })
            })
        })
})