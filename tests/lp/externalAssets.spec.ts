import { expect, test } from "@playwright/test";
import Utils from "../../utils/utils";


test.describe("Screenshots of External Assets", async () => {
    const utils = new Utils()

    test(`Check Native Grill and Wings Header and Footer @externalassets`, async ({ page }) => {
        await test.step("Given user navigates to the Native Grill and Wings Store Locator", async () => {
            await page.goto(`https://locations.nativegrillandwings.com/`)
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('.store-locator-container')]
            })
        })
    })

    test(`Check Robin's Donuts Header and Footer @externalassets`, async ({ page }) => {
        await test.step("Given user navigates to the Robin's Donuts Store Locator", async () => {
            await page.goto(`https://locations.robinsdonuts.com/`)
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('.store-locator-container')]
            })
        })
    })    

    test(`Check New Orleans Pizza Header and Footer @externalassets`, async ({ page }) => {
        await test.step("Given user navigates to the New Orleans Pizza Store Locator", async () => {
            await page.goto(`https://locations.neworleanspizza.com/`)
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('.store-locator-container')]
            })
        })
    })
    
    test(`Check Cricket Wireless Header and Footer @externalassets`, async ({ page }) => {
        await test.step("Given user navigates to the Cricket Wireless Store Locator", async () => {
            await page.goto(`https://www.cricketwireless.com/stores/`)
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('.store-locator-container')]
            })
        })
    })

    test(`Check Tin Drum Asian Kitchen Header and Footer @externalassets`, async ({ page }) => {
        await test.step("Given user navigates to the Tin Drum Asian Kitchen Store Locator", async () => {
            await page.goto(`https://locations.tindrumasiankitchen.com/`)
        })

        await test.step("When user checks the Navigation and Footer", async () => {
            await expect(page).toHaveScreenshot({
                fullPage: true,
                mask: [page.locator('.store-locator-container')]
            })
        })
    }) 
})