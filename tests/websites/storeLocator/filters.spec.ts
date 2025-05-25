import { APIRequestContext, expect, test} from "@playwright/test";
import filters from "../../../pages/components/filters";
import StoreLocatorPage from "../../../pages/websites/storeLocator";
import GoogleMapSF from "../../../pages/components/map";
import Utils from "../../../utils/utils";
import {ApiEnvironmentHelper} from "../../../api/uberall/apiEnvironmentHelper";
import BaseCall from "../../../api/uberall/baseCall";
import {createSFBody as originalCreateSFBody} from "../../testData/data/createSF.json";
import LocalPage from "../../../pages/websites/localPage";

test.describe("Filters", async () => {
    let apiContext
    let createStoreFinderResponse
    const apiUtils = new BaseCall()
    const utils = new Utils()
    const privateKey = ApiEnvironmentHelper.get1098PrivateKey()

    test.beforeAll(async () => {
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', privateKey, "")
    })

    test.beforeEach(async () => {
        const createSFBody = { ...originalCreateSFBody, name: utils.generateRandomName(), defaultLanguage: "de" };
        createStoreFinderResponse = await apiUtils.postRequest(apiContext, `/api/widgets/?v=20240220`, createSFBody)
    })

    test(`Check user can filter using brands filter @filters @multi_env_regression @webregression @regressionSF`, async ({ page }) => {
        const storeFinder = new StoreLocatorPage(page)
        const localPage = new LocalPage(page)
        await test.step(`Given user opens a store locator`, async () => {
            await page.goto(`https://uberall.store/health-check/tester?storeKey=${createStoreFinderResponse.response.storeFinderKey}&env=${process.env.WEBSITES_ENV}&src=https://locator.uberall.com/locator-assets/storeFinderWidget-v2.js&filters=services,brands&widgetoriginurl=#!/`, { waitUntil: "load" })
        })

        await test.step("When user opens filters dropdown", async () => {
            await page.getByTestId(filters.filtersDropDown).click()
            await expect(page.locator(filters.filtersListOpen)).toHaveScreenshot()
        })

        await test.step("And user filter for a specific brand", async () => {
            await page.locator(filters.filtersListOpen).getByText(filters.filterGroupMarken).click()
            await page.getByText(filters.filterOptionApple).click()
            await page.locator(filters.applyFiltersBtn).click()
        })

        await test.step("Then only locations with the selected brands are displayed", async () => {
            await page.waitForFunction(() => document.fonts.ready);
            await expect(storeFinder.locationListItem).toBeVisible()
            await storeFinder.locationListItem.click()
            await localPage.verifyBrandsSectionDisplayed()
        })
    }),
        test(`Check open now check box will only displayed opened locations @filters @multi_env_regression @webregression @regressionSF`, async ({ page }) => {
            const storeFinder = new StoreLocatorPage(page)
            await test.step(`Given user opens a store locator`, async () => {
                await page.goto(`https://uberall.store/health-check/tester?storeKey=${createStoreFinderResponse.response.storeFinderKey}&env=${process.env.WEBSITES_ENV}&src=https://locator.uberall.com/locator-assets/storeFinderWidget-v2.js&filters=services,brands&widgetoriginurl=#!/`, { waitUntil: "load" })
            })

            await test.step("When user clicks on open now checkbox", async () => {
                await page.getByTestId(filters.filtersDropDown).click()
                await page.getByText(filters.filterOptionOpenNow).click()
                await page.locator(filters.applyFiltersBtn).click()
            })

            await test.step("Then only open now locations are displayed", async () => {
                await page.waitForFunction(() => document.fonts.ready);
                await page.waitForLoadState("domcontentloaded")
                await expect(storeFinder.locationListItem).toBeVisible()
                await expect(storeFinder.storeInListOpenningHours).toHaveText(/Jetzt geöffnet/)
            })
        }),
        test(`Check that more than one filter can be applied @filters @webregression @multi_env_regression @regressionSF`, async ({ page }) => {
            const storeFinder = new StoreLocatorPage(page)
            const localPage = new LocalPage(page)
            await test.step(`Given user opens a store locator`, async () => {
                await page.goto(`https://uberall.store/health-check/tester?storeKey=${createStoreFinderResponse.response.storeFinderKey}&env=${process.env.WEBSITES_ENV}&src=https://locator.uberall.com/locator-assets/storeFinderWidget-v2.js&filters=services,brands&widgetoriginurl=#!/`, { waitUntil: "load" })
            })

            await test.step("When user opens filters dropdown", async () => {
                await page.getByTestId(filters.filtersDropDown).click()
                await expect(page.locator(filters.filtersListOpen)).toHaveScreenshot()
            })

            await test.step("And user selects Apple and Samsung", async () => {
                await page.locator(filters.filtersListOpen).getByText(filters.filterGroupMarken).click()
                await page.getByText(filters.filterOptionApple).click()
                await page.getByText(filters.filterOptionSamsung).click()
                await page.getByText(filters.filterOptionOpenNow).click()
                await page.locator(filters.applyFiltersBtn).click()
            })

            await test.step("Then only locations with Apple and Samsung brand will be displayed", async () => {
                await page.waitForFunction(() => document.fonts.ready)
                await page.waitForLoadState("domcontentloaded")
                await expect(storeFinder.locationListItem).toBeVisible()
                await expect(storeFinder.storeInListOpenningHours).toHaveText(/Jetzt geöffnet/)
                await storeFinder.locationListItem.click()
                await localPage.verifyBrandsSectionDisplayed()
            })
        }),
        test(`Check user can filter using brands filter @multi_env_regression @mobile`, async ({ page }) => {
            const storeFinder = new StoreLocatorPage(page)
            const localPage = new LocalPage(page)
            await test.step(`Given user opens a store locator`, async () => {
                await page.goto(`https://uberall.store/health-check/tester?storeKey=${createStoreFinderResponse.response.storeFinderKey}&env=${process.env.WEBSITES_ENV}&src=https://locator.uberall.com/locator-assets/storeFinderWidget-v2.js&filters=services,brands&widgetoriginurl=#!/`, { waitUntil: "load" })
            })

            await test.step("When user opens filters dropdown", async () => {
                await storeFinder.openMapViewOnMobile()
                await page.getByTestId(filters.filtersDropDown).click()
                await expect(page.locator(filters.filtersListOpen)).toHaveScreenshot()
            })

            await test.step("And user filter for a specific brand", async () => {
                await page.locator(filters.filtersListOpen).getByText(filters.filterGroupMarken).click()
                await page.getByText(filters.filterOptionApple).click()
                await page.getByText(filters.filterOptionOpenNow).click()
                await page.locator(filters.applyFiltersBtn).click()
            })

            await test.step("Then only locations with the selected brands are displayed", async () => {
                await page.waitForFunction(() => document.fonts.ready);
                await storeFinder.openLocationListButton.click()
                await expect(storeFinder.locationListItem).toBeVisible()
                await storeFinder.locationListItem.click()
                await localPage.verifyBrandsSectionDisplayed()
            })
        }),
        test(`Check open now check box will only displayed opened locations @multi_env_regression @mobile`, async ({ page }) => {
            const map = new GoogleMapSF(page)
            const storeFinder = new StoreLocatorPage(page)
            const localPage = new LocalPage(page)
            await test.step(`Given user opens a store locator`, async () => {
                await page.goto(`https://uberall.store/health-check/tester?storeKey=${createStoreFinderResponse.response.storeFinderKey}&env=${process.env.WEBSITES_ENV}&src=https://locator.uberall.com/locator-assets/storeFinderWidget-v2.js&filters=services,brands&widgetoriginurl=#!/`, { waitUntil: "load" })
            })

            await test.step("When user clicks on open now checkbox", async () => {
                await storeFinder.openMapViewOnMobile()
                await page.getByTestId(filters.filtersDropDown).click()
                await page.waitForLoadState("domcontentloaded")
                await page.getByText(filters.filterOptionOpenNow).click()
                await page.waitForLoadState("domcontentloaded")
                await page.locator(filters.applyFiltersBtn).click()
            })

            await test.step("Then only open now locations are displayed", async () => {
                await page.waitForFunction(() => document.fonts.ready);
                await map.clickOnMapLocationMobile()
                await map.openLocationFromMap()
                await localPage.verifyOpenNowLabel()
            })
        })

    // Cleanup after each test, in case of success or failure
    test.afterEach(async () => {
        console.log("Cleaning up after test...")
        const deleteSF = await apiUtils.deleteRequest(apiContext, `/api/widgets/${createStoreFinderResponse.response.id}?v=20240220`)
        console.log("Delete SF - Cleanup:", deleteSF)
    })

    // Dispose of the apiContext once after all tests in the suite are complete
    test.afterAll(async () => {
        await apiContext.dispose()
    })
})