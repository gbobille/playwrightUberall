import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";

test.describe("Golden Krust Store Locator", async () => {
    const baseUrl = 'https://locations.goldenkrust.com/'

    test('Verify the navigation and footer menus are loading properly on the Store Locator @lp-store-locator @goldenkrust', async ({ page }) => {
        const storeLocator = new StoreLocator(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(baseUrl)
            await storeLocator.waitForResultsList()
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await storeLocator.closeButton.click({ timeout: 40000 })
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('.store-locator-content')]
            })
        })
    })

    test('Verify that user can view the Store Locator and navigate to Local Page @lp-store-locator @goldenkrust', async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(baseUrl)
            await storeLocator.closeButton.click({ timeout: 40000 })
        })

        await test.step("And user verifies they can access the Store Locator", async () => {
            await storeLocator.storeLocatorName('Find a Location by Zip Code or City, State').click()
            await storeLocator.waitForResultsList()
        })

        await test.step("And selects a location from the resultsList", async () => {
            await storeLocator.localPageText('Sutphin Blvd').click({ timeout: 40000 })
        })
        
        await test.step("And user clicks the local page button", async () => {
            await storeLocator.clickLocalPageButton('View Menu').click({ timeout: 40000 })
        })

        await test.step("Then user verifies Local Page elements are loading", async () => {
            await localPage.addressHeading('Sutphin Blvd').click()
            await expect(localPage.heroImageAlt('Hero Image')).toBeVisible()
            await localPage.randomText('Monday').click({timeout: 40000})
            await expect(localPage.mapIsDisplayed('Map to Golden Krust Caribbean')).toBeVisible()
            await expect(localPage.aboutText('About Golden Krust')).toBeVisible()
            await expect(localPage.menuItems('Breakfast')).toBeVisible()
            await expect(localPage.menuItems('Patties')).toBeVisible()
        })
    })

    test('Verify that user can access the Sitemap from the Store Locator @lp-store-locator @goldenkrust', async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)
        const siteMap = new Sitemap(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(baseUrl)
            await storeLocator.closeButton.click({ timeout: 40000 })
        })

        await test.step("And user verifies they can access the Store Locator", async () => {
            await storeLocator.storeLocatorName('Find a Location by Zip Code or City, State').click()
            await storeLocator.waitForResultsList()
        })

        await test.step("When user clicks the link to Sitemap", async () => {
            await storeLocator.clickBreadcrumb('breadcrumbs').click()
        })

        await test.step("And when user clicks a location", async () => {
            await siteMap.clickSiteMapLinks('Albany Avenue').click({ timeout: 40000 })
        })

        await test.step("Then user verifies Local Page elements are loading", async () => {
            await localPage.randomText('Monday').click({timeout: 40000})
            await expect(localPage.heroImageAlt('Hero Image')).toBeVisible()
            await expect(localPage.mapIsDisplayed('Map to Golden Krust Caribbean')).toBeVisible()
            await expect(localPage.aboutText('About Golden Krust')).toBeVisible()
            await expect(localPage.menuItems('Breakfast')).toBeVisible()
            await expect(localPage.menuItems('Patties')).toBeVisible()
        })
    })
})