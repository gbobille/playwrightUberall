import { expect, test } from "@playwright/test";
import StoreLocatorPage from "../../../../pages/websites/storeLocator";
import { testConfig } from "../../../../testconfig.config";
import Utils from "../../../../utils/utils";

test.describe("Store finder accessibility violations", async () => {
    const utils = new Utils()

    test(`Check store finder accessibility violations wcag2a @accessibility @accessibilitySF`, async ({ page }, testInfo) => {
       //Open uberall logged in
       await page.goto(`${testConfig.prodSF2}`, { waitUntil: 'networkidle' })
       const storeLocator = new StoreLocatorPage(page)
       await expect(storeLocator.searchBtn).toBeVisible()
       //const violations = await utils.accessibilityScanner(page);
       const violations = await utils.violationsScanner(await utils.accessibilityScanner(page),testInfo.title)
       expect(violations).toEqual([])
    })

    test(`Check store finder local page accessibility violations wcag2a @accessibility @accessibilitySF`, async ({ page },testInfo) => {
      //Open uberall logged in
      await page.goto(`${testConfig.prodSF2}`, { waitUntil: 'networkidle' })
      const storeLocator = new StoreLocatorPage(page)
      await expect(storeLocator.searchBtn).toBeVisible()
      await storeLocator.clickOnTheFirstStore()
      //const violations = await utils.accessibilityScanner(page);
      const violations = await utils.violationsScanner(await utils.accessibilityScanner(page), testInfo.title)
      expect(violations).toEqual([])
   })
 
 })
