import { expect, test } from "@playwright/test";
import { testConfig } from "../../../testconfig.config";
import sitemap from "../../../pages/websites/sitemap";
import LocalPage from "../../../pages/websites/localPage";
import Utils from "../../../utils/utils";
import { ApiEnvironmentHelper } from "../../../api/uberall/apiEnvironmentHelper";
import BaseCall from "../../../api/uberall/baseCall";
import { createSFBody as originalCreateSFBody } from "../../testData/data/createSF.json";

test.describe("Sitemap", async () => {
    let apiContext
    let createStoreFinderResponse
    const apiUtils = new BaseCall()
    const utils = new Utils()
    const privateKey = ApiEnvironmentHelper.get1098PrivateKey()

    test.beforeAll(async () => {
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', privateKey, "")
    })

    test.beforeEach(async () => {
        const createSFBody = { ...originalCreateSFBody, name: utils.generateRandomName(), defaultLanguage: "en" };
        createStoreFinderResponse = await apiUtils.postRequest(apiContext, `/api/widgets/?v=20240220`, createSFBody)
    })

    test(`Check user opens a local page through sitemap @multi_env_regression @sitemap @webregression @regressionSF`, async ({ page }) => {
        const localPage = new LocalPage(page)
        await test.step(`Given user opens a store locator`, async () => {
            await page.goto(`https://uberall.store/health-check/tester?storeKey=${createStoreFinderResponse.response.storeFinderKey}&env=${process.env.WEBSITES_ENV}&src=https://locator.uberall.com/locator-assets/storeFinderWidget-v2-withoutMap.js&filters=services,brands&widgetoriginurl=#!/`, { waitUntil: "load" })
        })

        await test.step("When user clicks on the required city", async () => {
            await page.getByTestId(sitemap.sitemapGroupLink).getByText('Berlin').click()
        })

        await test.step("And user selects a store from the list of stores", async () => {
            await page.getByRole("link", { name: sitemap.sitemapLocationLink }).click()
        })

        await test.step("Then the required location page has been displayed successfully", async () => {
            await localPage.verifyLocationTitle()
            await expect(localPage.locationPageTitle).toHaveText('g-loc-1')
            await expect(localPage.similarLocationsListItem).toBeVisible()
        })
    })
})