import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";
import Map from "../../pages/lp/components/map";

test.describe("Stewart's Shops Store Locator, Sitemap and Local Page Tests", async () => {
    const baseUrl = 'https://locations.stewartsshops.com/'

    async function navigateToStoreLocator(page) {
        await page.goto(baseUrl)
    }

    test(`Verify that user can view the Header @lp-store-locator @stewarts`, async ({ page }) => {
        await navigateToStoreLocator(page)
        const element = page.locator('.site-header')
        await expect(element).toHaveScreenshot()
    })

    test(`Store Locator is displayed and user can access the Local Page @lp-store-locator @stewarts`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await navigateToStoreLocator(page)
            await storeLocator.waitForResultsList()
        })

        await test.step(`When user searches for a location`, async () => {
            await storeLocator.searchLocation('New Jersey')
        })

        await test.step(`And when the locations load successfuly`, async () => {
            await expect(storeLocator.verifySearchResults('2525 Highway 17M')).toBeVisible({ timeout: 40000 })
        })

        await test.step(`And when user clicks on a Local Page button`, async () => {
            await storeLocator.clickLocalPageButton('Shop Info').click({ timeout: 40000 })
        })

        await test.step(`Then user verifies the Local Page is loading successfully`, async () => {
            await expect(localPage.localPageTextIsDisplayed('2525 Highway 17M')).toBeVisible()
            await expect(localPage.localPageLinkIsDisplayed('Promotions')).toBeVisible()
            await expect(localPage.localPageHoursDisplayed('Monday')).toBeVisible()
        })
    })

    test(`Check Sitemap is displayed and user can access the Local Page @lp-store-locator @stewarts`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const siteMap = new Sitemap(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await navigateToStoreLocator(page)
            await storeLocator.waitForResultsList()
        })

        await test.step(`When user clicks the Sitemap link`, async () => {
            await storeLocator.clickSitemapLink('breadcrumb').click({ timeout: 40000 })
        })

        await test.step(`And user clicks the Sitemap link`, async () => {
            await siteMap.clickSiteMapLinks('New York').click({ timeout: 80000 })
        })

        await test.step(`And user clicks a location`, async () => {
            await siteMap.clickSiteMapLinks('10546 US Route 11').click({ timeout: 40000 })
        })

        await test.step(`Then user verifies the Local Page is loading successfully`, async () => {
            await expect(localPage.localPageHeading('Adams - #399')).toBeVisible()
            await expect(localPage.localPageLinkIsDisplayed('Promotions')).toBeVisible()
            await expect(localPage.localPageHoursDisplayed('Monday')).toBeVisible()
        })
    })

    test (`Check Store Locator Map is displayed and functioning properly @lp-store-locator @stewarts`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const map = new Map(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await navigateToStoreLocator(page)
            await storeLocator.waitForResultsList()
        })

        await test.step(`When user searches for a location`, async () => {
            await storeLocator.searchLocation('New Jersey')
        })

        await test.step(`And user selects a location`, async () => {
            await map.clickResultsList('Washingtonville - #32226 East Main StreetWashingtonville').click( {timeout: 40000} )
        })

        await test.step(`Then user verifies mapPopUp appears on the map`, async () => {
            await map.mapPopUpClass.click( {timeout: 40000} )
        })
    })
})