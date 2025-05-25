import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";
import Utils from "../../utils/utils";

test.describe('Mortgage World Store Locator', { tag: ['@lp-store-locator', '@mortgageworld'] }, () => {
    const utils = new Utils()
    const baseUrl = 'https://mortgageworld.llp.prod.momentfeed.com/'

    test('Verify the navigation and footer menus are loading properly on the Store Locator', async ({ page }) => {
        const storeLocator = new StoreLocator(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(baseUrl)
            await storeLocator.waitForResultsList()
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('.store-locator-container')]
            })
        })
    })

    test('Verify that user can view the Store Locator and navigate to Local Page', async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(baseUrl)
        })

        await test.step("And user verifies they can access the Store Locator", async () => {
            await storeLocator.storeLocatorName('Find a Location by Zip Code or City, State').click()
            await storeLocator.waitForResultsList()
        })

        await test.step("When user searches for New York, United States", async () => {
            await storeLocator.searchLocation('New York, United States')
            await storeLocator.waitForResultsList()
        })

        await test.step("And selects a location from the resultsList", async () => {
            await storeLocator.localPageText('Astoria - Head Quarters').click({ timeout: 40000 })
        })
        
        await test.step("And user clicks the local page button", async () => {
            await storeLocator.clickLocalPageButton('View Branch').click({ timeout: 40000 })
        })

        await test.step("Then user verifies Local Page elements are loading", async () => {
            await localPage.addressHeading('Astoria - Head Quarters').click()
            await localPage.randomText('Monday').click({timeout: 40000})
            await expect(localPage.mapIsDisplayed('Map to Mortgage World Bankers')).toBeVisible()
            await expect(localPage.aboutText('Ponce Bank and Mortgage World Bankers Stronger Together - Bankers with')).toBeVisible()
            await localPage.addressHeading('Follow us on social!').click()
        })
    })

    test('Verify that user can access the Sitemap from the Store Locator', async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)
        const siteMap = new Sitemap(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(baseUrl)
        })

        await test.step("And user verifies they can access the Store Locator", async () => {
            await storeLocator.storeLocatorName('Find a Location by Zip Code or City, State').click()
            await storeLocator.waitForResultsList()
        })

        await test.step("When user clicks the link to Sitemap", async () => {
            await storeLocator.clickSitemapLink('breadcrumbs').click({ timeout: 40000 })
        })

        await test.step("And when user clicks United States", async () => {
            await siteMap.clickSiteMapLinks('United States').click({ timeout: 40000 })
        })

        await test.step("And when user clicks a location", async () => {
            await siteMap.clickSiteMapLinks('-60 82nd Street , 3rd Floor').click({ timeout: 40000 })
        })

        await test.step("Then user verifies Local Page elements are loading", async () => {
            await localPage.addressHeading('Astoria - Head Quarters').click()
            await localPage.randomText('Monday').click({timeout: 40000})
            await expect(localPage.mapIsDisplayed('Map to Mortgage World Bankers')).toBeVisible()
            await expect(localPage.aboutText('Ponce Bank and Mortgage World Bankers Stronger Together - Bankers with')).toBeVisible()
            await localPage.addressHeading('Follow us on social!').click()
        })
    })
})