import { expect, test } from "@playwright/test";
import StoreLocatorPage from "../../../pages/websites/storeLocator";
import { testConfig } from "../../../testconfig.config";
import LocalPage from "../../../pages/websites/localPage";


test.describe("Location local page", async () => {
    test(`Check location local page is diplayed correctly @localpage @webregression @prodregression`, async ({ page }) => {

        const storeLocator = new StoreLocatorPage(page)
        const localPage = new LocalPage(page)

        await test.step("Given user open storefinder", async () => {
            await page.goto(`${testConfig.prodSF2}`)
        })

        await test.step("When user selects a location from the map", async () => {
            await storeLocator.selectLocationFromMap()
            await storeLocator.verifyLocationDataInfoWindow('g-loc-5Van Stolkweg 12585 JL Den Haag', 'Open now Open 24 hours', '+49 30 208479320', 'DirectionsDetail Page')
            await storeLocator.openLocation()
        })

        await test.step("Then location local page will be open", async () => {
            await expect(localPage.locationPageTitle).toHaveText('g-loc-5')
        })
    }),

        test(`Check location local page is diplayed correctly from mapbox @localpage @webregression @prodregression`, async ({ page }) => {

            const storeLocator = new StoreLocatorPage(page)
            const localPage = new LocalPage(page)

            await test.step("Given user open storefinder", async () => {
                await page.goto(`${testConfig.prodSFMapbox}`)
            })

            await test.step("When user selects a location from the map", async () => {
                await storeLocator.selectClusterFromMapboxMap()
                await storeLocator.selectLocationFromMapbox()
                await storeLocator.verifyLocationDataInfoWindow('Test BusinessHohenzollernstr. 15280797 Munich', 'Open now Open 24 hours', '+49 15602 322141', 'DirectionsDetail Page')
                await storeLocator.openLocation()
            })

            await test.step("Then location local page will be open", async () => {
                await expect(localPage.locationPageTitle).toHaveText('Test Business')
            })
        }),

        test(`Check location local page is diplayed correctly from googlemaps @mobile @prodregression`, async ({ page }) => {
            const storeLocator = new StoreLocatorPage(page)
            const localPage = new LocalPage(page)

            await test.step("Given user open storefinder", async () => {
                await page.goto(`${testConfig.prodSF2}`)
            })

            await test.step("When user selects a location from the map", async () => {
                await storeLocator.openMapViewOnMobile()
                await storeLocator.selectLocationFromMap()

                await storeLocator.verifyLocationDataInfoWindowMobile('g-loc-5Van Stolkweg 12585 JL Den Haag', 'Open now Open 24 hours', 'DirectionsCallDetail Page')
                await storeLocator.openLocation()
            })

            await test.step("Then location local page will be open", async () => {
                await expect(localPage.locationPageTitle).toHaveText('g-loc-5')
            })
        }),

        test('Check local page images are displayed correctly @localpage @webregression @prodregression @visualtests', async ({ page }) => {
            const localPage = new LocalPage(page)
            await test.step('Given user open storefinder local page', async () => {
                await page.goto(`${testConfig.gloc1localPageSF3}`, { waitUntil: "networkidle" })
                await expect(page).toHaveScreenshot({
                    fullPage: true,
                    mask: [page.locator('.ubsf_opening-hours-wrapper')],
                    animations: "disabled"
                })
            })
            await test.step('When user clicks on more images', async () => {
                await localPage.clickOnShowMorePhotos()
            })
            await test.step('Then image will be displayed in the right resolution', async () => {
                await expect(page).toHaveScreenshot()
            })

        })

})