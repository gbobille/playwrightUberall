import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Map from "../../pages/lp/components/map"
import Utils from "../../utils/utils";

test.describe("Burberry Store Locators", async () => {
    const utils = new Utils()
    const records = await utils.readDataFromCSV('tests/lp/testData/Burberry_StoreLocator.csv')

        records.forEach(record => {
            // Common test for Burberry Locators
            test(`Check: ${record.clientName} Store Locator is displayed and user can access the Local Page @burberry`, async ({ page }) => {
                const storeLocator = new StoreLocator(page)
                const localPage = new LocalPage(page)
                const map = new Map(page)

                await test.step(`Given user navigates to ${record.StoreLocatorURL}`, async () => {
                    await page.goto(`${record.StoreLocatorURL}`, { waitUntil: 'networkidle' })
                })

                await test.step(`When user validates correct translation for Store Locator Name is appearing`, async () => {
                    await storeLocator.storeLocatorName(record.locatorName).click()
                })

                await test.step(`And user searches ${record.searchItem}`, async () => {
                    await storeLocator.searchLocation(record.searchItem)
                })

                await test.step(`And user selects a location`, async () => {
                    await page.locator(`[id="\\${record.locatorID}"]`).click()
                  })
  
                  await test.step(`And user verifies mapPopUp appears on the map`, async () => {
                      await map.mapPopUpClass.click( {timeout: 40000} )
                  })
              
                await test.step(`And when the locations load successfuly`, async () => {
                    await expect(storeLocator.verifySearchResults(record.verifiedLocation)).toBeVisible({ timeout: 40000 })
                })

                await test.step(`And when user clicks on a Local Page button`, async () => {
                    await storeLocator.clickLocalPageButton(record.localPageButton).click({ timeout: 40000 })
                })

                await test.step(`Then user verifies the Local Page is loading with correct translation`, async () => {
                    await localPage.addressHeading(record.address).click()
                    await localPage.hoursHeading(record.hours).click()
                    await expect(localPage.localPageTextIsDisplayed(record.localPageText)).toBeVisible()
                    await expect(localPage.localPageLinkIsDisplayed(record.localPageLink)).toBeVisible()
                    await expect(localPage.localPageHoursDisplayed(record.localPageHours)).toBeVisible()
                })
            })
        })
    })