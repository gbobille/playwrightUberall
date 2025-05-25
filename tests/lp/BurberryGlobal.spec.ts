import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Map from "../../pages/lp/components/map"
import Utils from "../../utils/utils";

test.describe("Burberry Store Locators", async () => {
    const utils = new Utils()
    const records = await utils.readDataFromCSV('tests/lp/testData/Burberry_Global_StoreLocator.csv')

    test(`Verify the navigation and footer menus are loading properly on the Store Locator @burberryglobal`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        
        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(`https://stores.burberry.com/en`)
            await storeLocator.waitForResultsList()
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('#customContainer')]
            })
        })
    })

        records.forEach(record => {
            // Common test for Burberry Locators
            test(`Check: ${record.clientName} Store Locator is displayed and user can access the Local Page in different languages @burberryglobal`, async ({ page }) => {
                const storeLocator = new StoreLocator(page)
                const localPage = new LocalPage(page)
                const map = new Map(page)

                await test.step(`Given user navigates to ${record.StoreLocatorURL}`, async () => {
                    await page.goto(`${record.StoreLocatorURL}`, { waitUntil: 'networkidle' })
                    await page.waitForLoadState('domcontentloaded')
                })

                await test.step(`When user accepts the One Trust Cookie agreement`, async () => {
                    await storeLocator.accept.click({ timeout: 20000 })
                })

                await test.step(`When user validates correct Store Locator Name - ${record.locatorName} is appearing`, async () => {
                    await storeLocator.storeLocatorName(record.locatorName).click()
                    await storeLocator.waitForResultsList()
                })

                await test.step(`And user searches ${record.searchItem}`, async () => {
                    await storeLocator.searchLocation(record.searchItem)
                })

                await test.step(`And user checks the results are divided by Region - ${record.region}`, async () => {
                    await storeLocator.region(record.region).click({ timeout: 40000 })
                })

                await test.step(`And user selects a location`, async () => {
                    await page.locator(`[id="\\${record.locatorID}"]`).click()
                  })
  
                  await test.step(`And user verifies mapPopUp appears on the map`, async () => {
                      await map.mapPopUpClass.click( {timeout: 40000} )
                  })
              
                await test.step(`And when the location - ${record.pageName} loads successfuly`, async () => {
                    await storeLocator.localPageName(record.pageName).click()
                })

                await test.step(`And when user clicks on a Local Page button`, async () => {
                    await storeLocator.clickLocalPageButton(record.localPageButton).click({ timeout: 40000 })
                })

                await test.step(`Then user verifies the Local Page - ${record.pageName} is loading with correct translations`, async () => {
                    await localPage.addressHeading(record.address).click()
                    await localPage.multilingualTextDisplayed(record.hours).click()
                    await localPage.multilingualTextDisplayed(record.streetAddress).click()
                    await expect(localPage.paymentOptions(record.paymentOption1)).toBeVisible()
                    await expect(localPage.paymentOptions(record.paymentOption2)).toBeVisible()
                })

                await test.step(`And user clicks the ${record.localPageLink}`, async () => {
                    await localPage.multilingualLinkDisplayed(record.localPageLink).click()
                    const appointmentPage = page.waitForEvent('popup')
                    const apptLink = await appointmentPage
                    await expect(apptLink).toHaveURL(/.*\/appointment-booking/)
                })
            })
        })
    })