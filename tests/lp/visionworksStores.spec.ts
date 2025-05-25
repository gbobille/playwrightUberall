import { expect, test } from "@playwright/test";
import Utils from "../../utils/utils";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";

test.describe("Visionworks Store Locators", async () => {
    const utils = new Utils()
    const records = await utils.readDataFromCSV('tests/lp/testData/VisionworksUrls.csv')

    records.forEach(record => {
        test (`Check header for ${record.pageType} @vw @lp-store-locator`, async ({ page }) => {
            await test.step("Given user navigates to the Store Locator", async () => {
                await page.goto(`${record.localPageUrl}`, { waitUntil: 'domcontentloaded' })
                await page.waitForLoadState("networkidle")
            })
    
            await test.step("When user checks the Navigation and Footer", async () => {
                const element = page.locator('.vw-header-container')
                await expect(element).toHaveScreenshot()
            }) 
        })
    })

    test (`Check that user can access the Store Locator and Local Page @vw @lp-store-locator`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step(`Given user navigates to the Store Locator`, async () => {
            await page.goto('https://locations.visionworks.com/', { waitUntil: 'domcontentloaded' })
            await page.waitForLoadState("networkidle")
        })

        await test.step(`When user searches Fullerton, California`, async () => {
            await storeLocator.searchLocation('Fullerton, California, United')
        })

        await test.step(`And when the locations load successfuly`, async () => {
            await expect(storeLocator.verifySearchResults('Visionworks Doctors of Optometry Fullerton 227 East Orangefair MallFullerton,')).toBeVisible({ timeout: 40000 })
            await storeLocator.localPageText('Visionworks Doctors of Optometry Fullerton 227 East Orangefair MallFullerton,').click({ timeout: 40000 })
            await expect(storeLocator.verifySearchResults('×Visionworks Doctors of')).toBeVisible({ timeout: 40000 })
        })

        await test.step(`And when user clicks a Local Page link`, async () => {
            await storeLocator.clickLocalPageButton('Visionworks Doctors of Optometry Fullerton').click({ timeout: 40000 })
        })

        await test.step(`Then user validates the Local Page is loading properly`, async () => {
            await expect(localPage.localPageHeading('Doctors of Optometry')).toBeVisible()
            await expect(localPage.localPageHeading('Fullerton')).toBeVisible()
            await expect(localPage.localPageTextIsDisplayed('Store 1462')).toBeVisible()
            await expect(localPage.mapIsDisplayed('Map to Visionworks Doctors of')).toBeVisible()
        })

        await test.step(`And user validates Meet Your Doctor section is dispalyed`, async () => {
            await expect(localPage.localPageHeading('Meet Your Doctor')).toBeVisible()
            await expect(localPage.localPageHeading('Alice Pang, O.D.')).toBeVisible()
            await expect(localPage.localPageHeading('Bio')).toBeVisible()
        })
    })

    test (`Check that user can access the Sitemap and Local Page @vw @lp-store-locator`, async ({ page }) => {
        const siteMap = new Sitemap(page)        

        await test.step(`Given user navigates to the Store Locator`, async () => {
            await page.goto('https://locations.visionworks.com/site-map', { waitUntil: 'domcontentloaded' })
            await page.waitForLoadState("networkidle")
        })

        await test.step(`When user clicks on a Sitemap link`, async () => {
            await siteMap.clickSiteMapLinks('United States').click({ timeout: 40000 })
            await siteMap.clickSiteMapLinks('Eastern Ave, Ste C').click({ timeout: 40000 })
            const page1Promise = page.waitForEvent('popup')
            const lp = await page1Promise
            await expect(lp).toHaveURL('https://locations.visionworks.com/ll/US/CA/Bell-Gardens/7121-Eastern-Ave')
        })
    })
})