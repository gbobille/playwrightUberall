import { expect, Page, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";

test.describe("AAA Meemic Store Locator, Sitemap and Local Page Tests", async () => {
    const baseUrl = 'https://locator.meemic.com/search'

    async function navigateToStoreLocator(page: Page) {
        await page.goto(baseUrl)
    }

    test(`Verify that user can view the Header and Footer @meemic @aaa`, async ({ page }) => {
        await navigateToStoreLocator(page)
        await expect(page).toHaveScreenshot({
            fullPage: true,
            mask: [page.locator('#customContainer')]
        })
    })

    test(`Verify that users can search by location on the store locator and navigate to a local page @meemic @aaa`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await navigateToStoreLocator(page)
            await storeLocator.storeLocatorName('Find an agent near you').click()
            await storeLocator.waitForResultsList()
        })

        await test.step("And user searches for a location", async () => {
            await storeLocator.searchLocation('48060')
            const locationLink = page.locator('[id="\\34 436582"]')
            await expect(locationLink).toBeVisible()
            await locationLink.click()
    
            await expect(storeLocator.verifySearchResults('Pine Grove Avenue')).toBeVisible({ timeout: 40000 })
            await storeLocator.aaaName('Presnell Insurance Agency').click()
        })

        await test.step("And verify that the user can navigate to a local page", async () => {
            await localPage.localPageHeading('Presnell Insurance Agency').click()
            await localPage.checkMap('Map to Presnell Insurance Agency').click()
            await expect(localPage.localPageHeading('Locations')).toBeVisible()
            await expect(localPage.localPageHeading('Featured')).toBeVisible()
            await localPage.openButton('John.Presnell@Meemic.com').click()
    
            const getQuotePromise = page.waitForEvent('popup')
            await localPage.getAQuote('Get a Quote').click()
            const getQuotePage = await getQuotePromise
            await expect(getQuotePage).toHaveURL(/.*\/auto-insurance\?refBranch=EWH/)
        })
    })

    test(`Verify address hidden for certain locations @meemic @aaa`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)
        
        await test.step("Given user navigates to the Store Locator", async () => {
            await navigateToStoreLocator(page)
        })

        await test.step("And user searches for a location", async () => {
            await storeLocator.storeLocatorName('Find an agent near you').click()
            await storeLocator.searchLocation('48888')
    
            const addressLink = page.locator('[id="\\34 546790"]')
            await expect(addressLink).toBeVisible()
            await addressLink.click()
        })

        await test.step("And validates that the address is hidden on the store locator", async () => {
            await expect(storeLocator.verifySearchResults('Lou.Kitchenmaster@Meemic.com')).toBeVisible({ timeout: 40000 })
            await expect(storeLocator.hiddenAddress('4495 West Stanton Road')).toHaveCount(0)
            await storeLocator.aaaName('Kitchenmaster Agency LLC').click()
        })

        await test.step("And validates that the address is hidden on the local page", async () => {
            await expect(localPage.localPageHeading('Locations')).toBeVisible()
            await localPage.checkMap('Map to Kitchenmaster Agency LLC').click()
            await localPage.checkAddress('Stanton').click()
            await expect(localPage.hiddenAddress('4495 West Stanton Road')).toHaveCount(0)
        })
    })

    test(`Access Sitemap from the Store Locator and navigate to a local page @meemic @aaa`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)
        const siteMap = new Sitemap(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await navigateToStoreLocator(page)
            await storeLocator.clickSitemapLink('View All Meemic Locations').click({ timeout: 40000 })
        })

        await test.step("And user navigates to sitemap", async () => {
            await siteMap.siteMapHeading('Meemic Locations').click()
            await siteMap.siteMapHeadingLink('Michigan').click()
            await siteMap.siteMapGetTitle('Port Huron').click()
            await siteMap.sitemapLink('Presnell Insurance Agency').click({ timeout: 80000 })
        })

        await test.step("And verify that the user can navigate to a local page", async () => {
            await localPage.localPageHeading('Presnell Insurance Agency').click()
            await localPage.checkMap('Map to Presnell Insurance Agency').click()
            await localPage.clickButton('Get Directions').click({ timeout: 40000 })
        })
    })

    test(`Verify that users can search by name on the store locator and open a local page @meemic @aaa`, async ({ page }) => {
        const storeLocator = new StoreLocator(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await navigateToStoreLocator(page)
            await storeLocator.waitForResultsList()
        })

        await test.step("And user searches for a location by name", async () => {
            await storeLocator.searchByName('Engels')
            const agentLink = page.locator('[id="\\34 409176"]').getByRole('link', { name: 'Engels Insurance Agency' })
            await expect(agentLink).toBeVisible()
            await agentLink.click()
        })

        await test.step("Verify that the local page redirects to the correct URL", async () => {
            await expect(page).toHaveURL('https://locator.meemic.com/mi/ludington/engels-agency')
        })
    })
})