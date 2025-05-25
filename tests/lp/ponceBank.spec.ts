import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";
import Utils from "../../utils/utils";

test.describe("Ponce Bank Store Locator", async () => {
    const utils = new Utils()
    const baseUrl = 'https://branches.poncebank.com/'


    test('Verify the navigation and footer menus are loading properly on the Store Locator @lp-store-locator @poncebank', async ({ page }) => {
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

    test('Verify that user can view the Store Locator and navigate to Local Page @lp-store-locator @poncebank', async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(baseUrl)
        })

        await test.step("And user verifies they can access the Store Locator", async () => {
            await storeLocator.storeLocatorName('Find a Location by Zip Code or City, State').click()
            await storeLocator.waitForResultsList()
        })

        await test.step("When user searches for New York, New York, United States", async () => {
            await storeLocator.searchLocation('New York, New York, United States')
        })

        await test.step("And selects a location from the resultsList", async () => {
            await storeLocator.localPageText('Ponce Bank Stuyvesant Town').click({ timeout: 40000 })
        })

        await test.step("And verifies mapPopUp shows", async () => {
            await storeLocator.localPageText('×Ponce Bank Stuyvesant').click({ timeout: 40000 })
        })
        
        await test.step("And user clicks the local page button", async () => {
            await storeLocator.clickLocalPageButton('View Branch').click({ timeout: 40000 })
        })

        await test.step("Then user verifies Local Page elements are loading", async () => {
            await localPage.addressHeading('Ponce Bank Stuyvesant Town').click()
            await localPage.randomText('Monday').click({timeout: 40000})
            await expect(localPage.mapIsDisplayed('Map to Ponce Bank, Stuyvesant')).toBeVisible()
            await expect(localPage.aboutText('Welcome to Ponce Bank')).toBeVisible()
            await localPage.addressHeading('Follow us on social!').click()
        })
    })

    test('Verify that user can access the Sitemap from the Store Locator @lp-store-locator @poncebank', async ({ page }) => {
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
            await siteMap.clickSiteMapLinks('5560 Broadway').click({ timeout: 40000 })
        })

        await test.step("Then user verifies Local Page elements are loading", async () => {
            await localPage.addressHeading('Ponce Bank Riverdale').click()
            await localPage.randomText('Monday').click({timeout: 40000})
            await expect(localPage.mapIsDisplayed('Map to Ponce Bank, Riverdale')).toBeVisible()
            await expect(localPage.aboutText('Welcome to Ponce Bank')).toBeVisible()
            await localPage.addressHeading('Follow us on social!').click()
        })
    })
})