import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";

test.describe("AAA ACG Store Locator, Sitemap and Local Page Tests", async () => {

test(`Verify the navigation and footer menus are loading properly on the Store Locator @aaa`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
    
        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(`https://locator.acg.aaa.com/search`)
            await storeLocator.waitForResultsList()
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('#customContainer')]
            })
        })
    })

    test(`Verify that user can view the Store Locator and navigate to an Agent page @aaa`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(`https://locator.acg.aaa.com/search`)
        })

        await test.step("When user checks the Store Locator", async () => {
            await storeLocator.storeLocatorName('Find a location').click()
        })

        await test.step("And user searches a zip code 62704", async () => {
            await storeLocator.searchLocation('62704')
        })
        
        await test.step("When user validates results are returned and can navigate to a Local Page", async () => {
            await storeLocator.aaaName('AAA Insurance - Rambach').click()
        })

        await test.step("Then user validates they can access the Local Page and elements are loading", async () => {
            await expect(localPage.localPageHeading('AAA Insurance Rambach Insurance Agency')).toBeVisible()
            await expect(localPage.mapIsDisplayed('Map to AAA Insurance -')).toBeVisible()
            await expect(localPage.localPageHeading('Featured Products')).toBeVisible()
            await expect(localPage.localPageHeading('Services')).toBeVisible()
        })

        await test.step("And user opens the Send an Email form", async () => {
            await localPage.openButton('zrrambach@acg.aaa.com').click()
            await localPage.textHeading('Send an Email').click()
            await localPage.openButton('Close').click()
        })

        await test.step("And user opens the Get a Quote form", async () => {
            await localPage.getAQuote('Get a Quote').click()
            await localPage.formHeading('AAA Insurance').click()
            await localPage.openButton('Close').click()
        })
    })

    test(`Verify that user can view the Store Locator and navigate to a Branch page @aaa`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(`https://locator.acg.aaa.com/search`)
        })

        await test.step("When user checks the Store Locator", async () => {
            await storeLocator.storeLocatorName('Find a location').click()
        })

        await test.step("And user searches Missouri", async () => {
            await storeLocator.searchLocation('Colorado, United States')
        })

        await test.step("And user validates results are returned and can navigate to a Local Page", async () => {
            await storeLocator.aaaName('AAA Colorado AutoSource: Car').click()
        })

        await test.step("Then user validates Agent Local Page is loading properly", async () => {
            await localPage.localPageHeading('AAA Colorado AutoSource: Car Buying Service and Used Car Center in Denver, CO').click()
            await expect(localPage.mapIsDisplayed('Map to AAA Colorado')).toBeVisible()
            await localPage.serviceText('AAA Colorado AutoSource').click()
            await localPage.nearbyLocations('AAA Locations Near Denver, CO').click()
            await localPage.nearbyLocations('8055 West Bowles Avenue #700').click()
        })
    })

    test(`Verify that user can view the Store Locator and navigate to Sitemap @aaa`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const siteMap = new Sitemap(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(`https://locator.acg.aaa.com/search`)
        })

        await test.step("When user clicks the link to Sitemap", async () => {
            await storeLocator.clickSitemapLink('View all AAA locations').click({ timeout: 40000 })
        })

        await test.step("And user verifies the Sitemap is loading", async () => {
            await siteMap.sitemapText('All Locations').click({ timeout: 40000 })
            await siteMap.siteMapHeading('AAA Locations').click()
            await siteMap.sitemapText('states of the').click({ timeout: 40000 })
        })

        await test.step("And user can click a State", async () => {
            await siteMap.sitemapLink('Colorado').click({ timeout: 80000 })
            await siteMap.sitemapText('in Colorado').click({ timeout: 40000 })
        })

        await test.step("And user can click a City", async () => {
            await siteMap.sitemapLink('Denver').click({ timeout: 80000 })
            await siteMap.sitemapText('in Denver, Colorado').click({ timeout: 40000 })
        })

        await test.step("And user can view the location cards", async () => {
            await siteMap.sitemapText('South Platte River Drive').click({ timeout: 40000 })
            await siteMap.sitemapText('Denver, CO 80223').click({ timeout: 40000 })
        })

        await test.step("And user click on the Local Page", async () => {
            await siteMap.siteMapHeading('AAA Colorado AutoSource: Car').click()
        })

        await test.step("Then verifies local page is loading properly", async () => {
            await localPage.localPageHeading('AAA Colorado AutoSource: Car Buying Service and Used Car Center in Denver, CO').click()
            await expect(localPage.mapIsDisplayed('Map to AAA Colorado')).toBeVisible()
        })
    })

    test(`Verify that user can access the Puerto Rico location from Store Locator and Local Page @aaa`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto(`https://locator.acg.aaa.com/search`)
        })

        await test.step("When user checks the Store Locator", async () => {
            await storeLocator.storeLocatorName('Find a location').click()
        })

        await test.step("And user searches Puerto Rico", async () => {
            await storeLocator.searchLocation('Puerto Rico')
        })

        await test.step("And user validates results are returned and can navigate to a Local Page", async () => {
            await storeLocator.aaaName('AAA Puerto Rico').click()
        })

        await test.step("Then user validates Puerto Rico Local Page is loading properly", async () => {
            await localPage.localPageHeading('AAA Puerto Rico in San Juan, San Juan').click()
            await expect(localPage.mapIsDisplayed('Map to AAA Puerto Rico')).toBeVisible()
            await localPage.branchServiceText('Services at AAA Puerto Rico').click()
        })
    })

    test(`Verify that user can access the Puerto Rico location from Sitemap @aaa`, async ({ page }) => {
        const localPage = new LocalPage(page)
        const siteMap = new Sitemap(page)

        await test.step("Given user navigates to the Sitemap", async () => {
            await page.goto(`https://locator.acg.aaa.com/`)
        })

        await test.step("When user clicks the Puerto Rico", async () => {
            await siteMap.sitemapLink('Puerto Rico').click()
        })

        await test.step("Then user validates Puerto Rico Local Page is loading properly", async () => {
            await localPage.localPageHeading('AAA Puerto Rico in San Juan, San Juan').click()
            await expect(localPage.mapIsDisplayed('Map to AAA Puerto Rico')).toBeVisible()
            await localPage.branchServiceText('Services at AAA Puerto Rico').click()
        })
    })
})