import { expect, test } from "@playwright/test";
import Utils from "../../utils/utils";
import StoreLocator from "../../pages/lp/storeLocator";
import LocalPage from "../../pages/lp/localPage";
import Sitemap from "../../pages/lp/siteMap";

test.describe("Fatbrands Store Locators", async () => {

    test ("Check that user can access the Fatburger Store Locator and Local Page @fatbrands", async ( {page} ) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto("https://locations.fatburger.com/", { waitUntil: 'domcontentloaded' })
        })

        await test.step("And if user sees / doesn't see a pop-up form", async ()  => {
            await page.waitForTimeout(10000)
            await storeLocator.popUpCheck(page)
            await storeLocator.waitForResultsList()
        })

        await test.step("And user checks the Navigation and Footer", async () => {
            const element = page.locator('.header-wrapper')
            await expect(element).toHaveScreenshot()
        })

        await test.step(`And user searches for Santa Monica, California, United States`, async () => {
            await storeLocator.fatBrandsSearch('Santa Monica, California, United States') 
        })

        await test.step("And user checks the Store Locator elements are loading and navigates to a Local Page", async () => {
            await storeLocator.localPageText('0.8 mi.').click({ timeout: 40000 })
            await storeLocator.moreInfo.click()
        })

        await test.step("Then user validates the Local Page elements are properly loading", async () => {
            await expect(localPage.heroImage('Fries, burgers, onion rings')).toBeVisible()
            await localPage.fatBrandsText('(Lincoln & Pico - Santa').click()
            await localPage.fatBrandsText('Monday').click()
            await localPage.fatBrandsText('Lincoln Boulevard, Santa Monica, CA 90405').click()
        })
    })

    test ("Check that user can access the Johnny Rockets Store Locator and Local Page @fatbrands", async ( {page} ) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto("https://locations.johnnyrockets.com/", { waitUntil: 'domcontentloaded' })
        })

        await test.step("And if user sees / doesn't see a pop-up form", async ()  => {
            await page.waitForTimeout(10000)
            await storeLocator.popUpCheck(page)
        })

        await test.step("And user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: false,
                mask: [page.locator('.store-locator-container')]
            })
        })

        await test.step(`And user searches for Los Angeles, California, United States`, async () => {
            await storeLocator.fatBrandsSearch('Los Angeles, California, United States') 
        })

        await test.step("And user checks the Store Locator elements are loading and navigates to a Local Page", async () => {
            await storeLocator.localPageText('6.2 mi.').click({ timeout: 40000 })
            await storeLocator.moreInfo.click()
        })

        await test.step("Then user validates the Local Page elements are properly loading", async () => {
            await expect(localPage.heroImage('Onion rings, burgers, fries')).toBeVisible()
            await localPage.fatBrandsText('Download the official Johnny').click()
            await localPage.fatBrandsText('Monday').click()
            await localPage.fatBrandsText('6801 Hollywood Boulevard,').click()
        })
    })

    test ("Check that user can access the Buffalos Cafe Store Locator and Local Page @fatbrands", async ( {page} ) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto("https://locations.buffalos.com/", { waitUntil: 'domcontentloaded' })
        })

        await test.step("And if user sees / doesn't see a pop-up form", async ()  => {
            await page.waitForTimeout(10000)
            await storeLocator.popUpCheck(page)
        })

        await test.step("And user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: false,
                mask: [page.locator('.store-locator-container')]
            })
        })

        await test.step(`And user searches for Georgia, United States`, async () => {
            await storeLocator.fatBrandsSearch('Georgia, United States') 
        })

        await test.step("And user checks the Store Locator elements are loading and navigates to a Local Page", async () => {
            await storeLocator.localPageText('48.0 mi.').click({ timeout: 40000 })
            await storeLocator.moreInfo.click()
        })

        await test.step("Then user validates the Local Page elements are properly loading", async () => {
            await expect(localPage.heroImage('Buffalo Wings')).toBeVisible()
            await localPage.fatBrandsText('(Macon, GA)').click()
            await localPage.fatBrandsText('Monday').click()
            await localPage.fatBrandsText('Zebulon Road, Macon, GA 31210').click()
        })
    })

    test ("Check that user can access the Hurricane Wings Store Locator and Local Page @fatbrands", async ( {page} ) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto("https://locations.hurricanewings.com/", { waitUntil: 'domcontentloaded' })
        })

        await test.step("And if user sees / doesn't see a pop-up form", async ()  => {
            await page.waitForTimeout(10000)
            await storeLocator.popUpCheck(page)
        })

        await test.step("And user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: false,
                mask: [page.locator('.store-locator-container')]
            })
        })

        await test.step(`And user searches for Lindenhurst, New York, United States`, async () => {
            await storeLocator.fatBrandsSearch('Lindenhurst, New York, United States') 
        })

        await test.step("And user checks the Store Locator elements are loading and navigates to a Local Page", async () => {
            await storeLocator.localPageText('0.8 mi.').click({ timeout: 40000 })
            await storeLocator.moreInfo.click()
        })

        await test.step("Then user validates the Local Page elements are properly loading", async () => {
            await expect(localPage.heroImage('hero image')).toBeVisible()
            await localPage.fatBrandsText('(Lindenhurst, NY)').click()
            await localPage.fatBrandsText('Monday').click()
            await localPage.fatBrandsText('127 East Montauk Highway, Lindenhurst, NY 11757').click()
        })
    })

    test ("Check that user can access the Native Grill and Wings Store Locator and Local Page @fatbrands", async ( {page} ) => {
        const storeLocator = new StoreLocator(page)
        const localPage = new LocalPage(page)

        await test.step("Given user navigates to the Store Locator", async () => {
            await page.goto("https://locations.nativegrillandwings.com/", { waitUntil: 'domcontentloaded' })
        })

        await test.step("And if user sees / doesn't see a pop-up form", async ()  => {
            await page.waitForTimeout(10000)
            await storeLocator.popUpCheck(page)
        })

        await test.step("And user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: false,
                mask: [page.locator('.store-locator-container')]
            })
        })

        await test.step(`And user searches for Mesa, Arizona, United States`, async () => {
            await storeLocator.fatBrandsSearch('Mesa, Arizona, United States') 
        })

        await test.step("And user checks the Store Locator elements are loading and navigates to a Local Page", async () => {
            await storeLocator.localPageText('1.5 mi.').click({ timeout: 40000 })
            await storeLocator.moreInfo.click()
        })

        await test.step("Then user validates the Local Page elements are properly loading", async () => {
            await expect(localPage.heroImage('hero image')).toBeVisible()
            await localPage.fatBrandsText('Monday').click()
        })
    })
})