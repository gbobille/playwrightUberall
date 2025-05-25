import { expect, test } from "@playwright/test";
import StoreLocatorPage from "../../../pages/websites/storeLocator";
import { testConfig } from "../../../testconfig.config";

test.describe("Search storelocator", async () => {

    test(`Check user can search for a store using postal code @prodregression @searchSF @webregression @regressionSF`, async ({ page }) => {
        const storeLocator = new StoreLocatorPage(page)
        await test.step(`Given user opens a store locator`, async () => {
            await page.goto(`${testConfig.macSF}`, { waitUntil: 'domcontentloaded' })
        })

        await test.step("When user search for a store", async () => {
            await storeLocator.searchForAStore('10')
            await storeLocator.verifyDDLDisplayed()
        })

        const selectedLocationNameAndAddress = (await storeLocator.getSuggestedLocationtext(1)).split(" - ")
        const selectedLocationStreetNo = selectedLocationNameAndAddress[1].split(',')

        await test.step("And user selects suggestion from list", async () => {
            await storeLocator.selectSuggestedLocation(1)
            await expect(await storeLocator.getLocationNameandAddressInList()).toContain(selectedLocationStreetNo[0])
            await expect(await storeLocator.getLocationInfoWindowNameandAddress()).toContain(selectedLocationStreetNo[0])
        })

        await test.step("Then the selected store is displayed in the search area and on the map", async () => {
            await expect(await storeLocator.getLocationNameandAddressInList()).toContain(selectedLocationStreetNo[0])
            await expect(await storeLocator.getLocationInfoWindowNameandAddress()).toContain(selectedLocationStreetNo[0])
        })
    }),

        test(`Check user can search for a store using streetname @prodregression @searchSF @webregression @regressionSF`, async ({ page }) => {
            const storeLocator = new StoreLocatorPage(page)
            await test.step(`Given user opens a store locator`, async () => {
                await page.goto(`${testConfig.bioSF}`, { waitUntil: 'domcontentloaded' })
            })

            await test.step("When user search for a store", async () => {
                await storeLocator.searchForAStore('Bölschestraße')
                await storeLocator.verifyDDLDisplayed()
            })

            const selectedLocationNameAndAddress = (await storeLocator.getSuggestedLocationtext(0)).split(" - ")
            const selectedLocationStreetNo = selectedLocationNameAndAddress[1].split(',')

            await test.step("And user press enter", async () => {
                await storeLocator.searchTextField.press('Enter')
                await page.waitForTimeout(5000)
                await expect(await storeLocator.getLocationNameandAddressInList()).toContain(selectedLocationStreetNo[0])
                await expect(await storeLocator.getLocationInfoWindowNameandAddress()).toContain(selectedLocationStreetNo[0])
            })

            await test.step("Then the selected store is displayed in the search area and on the map", async () => {
                await expect(await storeLocator.getLocationNameandAddressInList()).toContain(selectedLocationStreetNo[0])
                await expect(await storeLocator.getLocationInfoWindowNameandAddress()).toContain(selectedLocationStreetNo[0])
            })
        }),

        test(`Check user can search for a store using postalcode @prodregression @mobile`, async ({ page }) => {
            const storeLocator = new StoreLocatorPage(page)
            await test.step(`Given user opens a store locator`, async () => {
                await page.goto(`${testConfig.prodSF2}`, { waitUntil: 'domcontentloaded' })
            })

            await test.step("When user search for a store", async () => {
                await storeLocator.searchForAStore('10437')
                await storeLocator.verifyDDLDisplayed()
            })

            const selectedLocationNameAndAddress = (await storeLocator.getSuggestedLocationtext(0)).split(" - ")
            const selectedLocationStreetNo = selectedLocationNameAndAddress[1].split(',')

            await test.step("And user press search btn", async () => {
                await storeLocator.searchBtn.click()
            })

            await test.step("And user opens map", async () => {
                await storeLocator.openMapViewOnMobile()
            })

            await test.step("Then the selected store is displayed in the search area and on the map", async () => {
                await expect(await storeLocator.getLocationInfoWindowNameandAddress()).toContain(selectedLocationStreetNo[0])
            })
        })
})