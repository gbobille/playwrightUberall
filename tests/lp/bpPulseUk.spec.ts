import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";

test.describe('BpPulseUK Store Locator', { tag: ['@lp-store-locator', '@bp'] }, () => {

    test(`Bp Pulse's header is loading properly`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)

        await test.step("Given user navigates to the Bp Pulse UK Store Locator", async () => {
            await page.goto(`https://chargers.bppulse.com/`)
            await storeLocator.waitForResultsList()
        })

        await test.step("And user checks the header", async () => {
            const element = page.locator('.css-1ncp0r')
            await expect(element).toHaveScreenshot()
        })
    })

    test(`Bp Pulse's map is visible`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)

        await test.step("Given user navigates to the Bp Pulse UK Store Locator", async () => {
            await page.goto(`https://chargers.bppulse.com/`)
        })

        await test.step(`When user accepts the cookie policy`, async () => {
            await storeLocator.allow.click()
        })

        await test.step("And user checks the map is visible on the initial load", async () => {
            await expect(page.locator('.mf-map')).toBeVisible()
        })
    })

    test(`Verify that users can search for Points of Interest`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)

        await test.step("Given user navigates to the Bp Pulse UK Store Locator", async () => {
            await page.goto(`https://chargers.bppulse.com/`)
        })

        await test.step(`When user accepts the cookie policy`, async () => {
            await storeLocator.allow.click()
        })

        await test.step(`And user searches a location`, async () => {
            await storeLocator.searchLocation('Heathrow')
            await expect(page.locator('.mf-map')).toBeVisible()
            await storeLocator.waitForResultsList()
        })

        await test.step(`And user selects a filter`, async () => {
            await storeLocator.clickFiltersButton('filter button').click({ timeout: 40000 })
            await storeLocator.selectFilterButton('CONNECTOR TYPE button CHAdeMO').click({ timeout: 40000 })
            await expect(page.locator('.mf-map')).toBeVisible()
            await storeLocator.waitForResultsList()
        })
    })

    test(`Check Bp Pulse UK Store Locator and Local Page elements`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Bp Pulse UK Store Locator", async () => {
            await page.goto(`https://chargers.bppulse.com/`)
        })

        await test.step(`When user accepts the cookie policy`, async () => {
            await storeLocator.allow.click()
        })

        await test.step(`And user searches a location`, async () => {
            await storeLocator.searchLocation('Nottingham')
            await storeLocator.waitForResultsList()
            await expect(page.locator('.mf-map')).toBeVisible()
        })

        await test.step(`And user selects a filter`, async () => {
            await storeLocator.clickFiltersButton('filter button').click({ timeout: 40000 })
            await storeLocator.selectFilterButton('AMENITIES button CAFÉ').click({ timeout: 40000 })
            await storeLocator.waitForResultsList()
        })

        await test.step(`And user opens a Local Page`, async () => {
            await storeLocator.clickLocalPageButton('Wilford Lane, Nottingham Get').click({ timeout: 40000 })
        })

        await test.step(`Then user verifies Local Page Elements are loading`, async () => { 
            await localPage.localPageBreadcrumbs('UK / nottinghamshire /').click()
            await localPage.textHeading('bp pulse Charging Station').click()
            await expect(localPage.mapIsDisplayed('Map to bp pulse Charging')).toBeVisible()
            await localPage.textHeading('Our on site amenities').click()
            await localPage.amenitiesIcons('Grocery / Convenience').click()
            await localPage.amenitiesIcons('ATM').click()
            await localPage.amenitiesIcons('Cafe').click()
            // app store section
            await localPage.amenitiesIcons('Phone').click()
            await localPage.textHeading('Pricing (£/kWh)').click()
        })
    })

    test(`Check Bp Pulse UK Sitemap`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)
        const siteMap = new Sitemap(page)

        await test.step("Given user navigates to the Bp Pulse UK Sitemap", async () => {
            await page.goto(`https://chargers.bppulse.com/all`)
        })

        await test.step(`When user accepts the cookie policy`, async () => {
            await storeLocator.allow.click()
        })

        await test.step(`And user validates Sitemap is loading`, async () => {
            await siteMap.siteMapHeading('BP Pulse Locations').click()
        })

        await test.step(`And user selects a location`, async () => {
            await siteMap.sitemapLink('290 Antrim Road').click({ timeout: 80000 })
        })

        await test.step(`Then user verifies Local Page Elements are loading`, async () => { 
            await localPage.textHeading('bp pulse Charging Station').click()
            await expect(localPage.mapIsDisplayed('Map to bp pulse Charging')).toBeVisible()
            await localPage.textHeading('Our on site amenities').click()
            await localPage.amenitiesIcons('Grocery / Convenience').click()
            await localPage.amenitiesIcons('ATM').click()
            // app store section
            await localPage.amenitiesIcons('Phone').click()
            await localPage.textHeading('Pricing (£/kWh)').click()
        })
    })
})