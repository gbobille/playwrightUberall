import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";


test.describe('Arvest Bank Store Locator, Sitemap and Local Page Tests', { tag: ['@lp-store-locator', '@arvestbank'] }, () => {

    test('Verify the navigation and footer menus are loading properly on the Store Locator', async ({ page }) => {
        const storeLocator = new StoreLocator(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto('https://locations.arvest.com/')
            await storeLocator.waitForResultsList()
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('.container')]
            })
        })

        await test.step("And user clicks the California residents only: Do Not Sell or Share My Personal Information link", async () => {
            await storeLocator.clickFooterLink('Do Not Sell or Share My Personal Information').click()
        })

        await test.step("Then user verifies the California Privacy Statement page is accessible from modal", async () => {
            await storeLocator.clickCaliforniaResidentsLink('California residents’ rights').click()
            const caPrivacyPage = page.waitForEvent('popup')
            const newTab = await caPrivacyPage
            await expect(newTab).toHaveURL(/.*\/about\/privacy-and-security\/state-specific-privacy/)
        })
    })

    test(`Check that user can access the Store Locator and Local Page`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto('https://locations.arvest.com/', { waitUntil: 'domcontentloaded' })
            await storeLocator.waitForResultsList()
            await expect(storeLocator.storeLocatorText('Arvest Bank serves customers')).toBeVisible()
        })

        await test.step("When user searches Rogers, Arkansas, United States", async () => {
            await storeLocator.searchLocation('Rogers, Arkansas, United States')
            await storeLocator.waitForResultsList()
        })

        await test.step("And user selects a filter", async () => {
            await storeLocator.clickFiltersButton('filter button').click({ timeout: 40000 })
            await storeLocator.clickArvestFilter('Store button ATM').click()     
            await storeLocator.clickFiltersButton('filter button').click({ timeout: 40000 })
            await storeLocator.waitForResultsList()
            await expect(storeLocator.storeLocatorText('ATM in Rogers, Arkansas,')).toBeVisible()
        })

        await test.step("And user verifies the correct location are appearing", async () => {
            await storeLocator.clickLocalPageText('201 West Walnut Street').click()
            await expect(storeLocator.verifySearchResults('×Rogers Downtown 201 West')).toBeVisible({ timeout: 40000 })
        })

        await test.step("And user clicks a Local Page button", async () => {
            await storeLocator.arvestLPBtn.click()
        })

        await test.step("Then user verifies Local Page elements are loading", async () => {
            await expect(localPage.localPageHeading('Rogers')).toBeVisible()
            await expect(localPage.localPageTextIsDisplayed('Address 201 West Walnut')).toBeVisible()
            await expect(localPage.scheduleButton('Schedule an Appointment')).toBeVisible()
            await expect(localPage.serviceIsDisplayed('Checking Accounts')).toBeVisible()
            await expect(localPage.serviceIsDisplayed('Savings Accounts')).toBeVisible()
        })

        await test.step("And user verifies Nearby Locations are displayed", async () => {
            await expect(localPage.nearbyCard('Arvest Bank, Rogers1801 West')).toBeVisible()
            await expect(localPage.nearbyCard('Arvest Bank, Rogers701 West')).toBeVisible()
        })

        await test.step("And user can access a location from the Nearby Card", async () => {
            await localPage.locationDetails('Location Details').click()
            await expect(localPage.localPageHeading('Rogers')).toBeVisible()
        })
    })

    test(`Check that user can access sitemap`, async ({ page }) => {
        const localPage = new LocalPage(page)
        const siteMap = new Sitemap(page)

        await test.step("Given user navigates to the sitemap page", async () => {
            await page.goto('https://locations.arvest.com/site-map', { waitUntil: 'domcontentloaded' })
            await siteMap.siteMapHeading('Arvest Bank Locations').click({ timeout: 40000 })
            await siteMap.siteMapHeadingLink('United States').click()
            await siteMap.siteMapHeadingLink('Arkansas').click()
            await siteMap.siteMapGetTitle('Benton').click()
            await siteMap.sitemapLink('Military Road').click({ timeout: 80000 })
        })

        await test.step("Then user verifies Local Page elements are loading", async () => {
            await expect(localPage.localPageHeading('Benton')).toBeVisible()
            await expect(localPage.localPageTextIsDisplayed('Military Road')).toBeVisible()
            await expect(localPage.serviceIsDisplayed('Learn More About Arvest')).toBeVisible()
            await expect(localPage.mapIsDisplayed('map showing the location of')).toBeVisible()
        })
    })
})