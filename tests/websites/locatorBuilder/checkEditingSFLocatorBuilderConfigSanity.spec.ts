import { expect, test } from "@playwright/test";
import { apitestConfig } from "../../testData/apitestconfig.config";
import { createSFBody } from "../../testData/data/createSF.json";
import { resposeBody } from "../../testData/data/SFconfigRes.json";
import BaseCall from "../../../api/uberall/baseCall";
import { testConfig } from "../../../testconfig.config";
import Login from "../../../pages/components/login";
import Dashboard from "../../../pages/websites/dashboard";
import LocatorPages from "../../../pages/websites/locatorPagesPage";
import StoreLocatorPage from "../../../pages/websites/storeLocator";
import {ApiEnvironmentHelper} from "../../../api/uberall/apiEnvironmentHelper";
/**
 * Testing self service 
 */
test.describe("Self service", async () => {
   let apiContext
   let createSF
   let getSFOptions
   let deleteSF
   const apiUtils = new BaseCall()
   const privateKey = ApiEnvironmentHelper.get1098PrivateKey()


   test.beforeEach(async () => {
      apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', privateKey, "")
      createSF = await apiUtils.postRequest(apiContext, apitestConfig.createSFPath, createSFBody)
   });

   test(`Check that changing SF configs will refelct on SF settings @pipeline`, async ({ page }) => {
      /**
       * 
       */

      await test.step("Given user creates a SF", async () => {
         await page.goto(`${process.env.BASE_URL}`)
         const login = new Login(page)
         await login.userLogin(process.env.QA_UN, process.env.QA_P)
      })

      const dashboard = new Dashboard(page)
      const locatorBuilder = new LocatorPages(page)

      await test.step("And user opens storefinder config", async () => {
         await dashboard.validateHomePageIsOpenNewNav()
         await dashboard.navigateToLocatorPagesNewNav()
         await locatorBuilder.searchForLocator(createSF.response.name)
         await locatorBuilder.openStoreLocator()
      })

      await test.step("And user enable favorite store, custom location sorting and CTA btn", async () => {
         await locatorBuilder.addCustomSorting()
         await locatorBuilder.enableFavoriteLocationBtn()
         await locatorBuilder.enableCTABtn()
      })

      await test.step("When user save the changes", async () => {
         await locatorBuilder.saveChanges()
      })

      await test.step("Then changes will refelct on store locator", async () => {
         getSFOptions = await apiUtils.getRequest(apiContext, `/api/widgets/${createSF.response.id}`)
         const SFconfigs = getSFOptions.response.config
         await expect(SFconfigs).toStrictEqual(resposeBody)

         await page.goto(`https://uberall.store/health-check/tester?storeKey=${createSF.response.storeFinderKey}&env=locator.development.uberall.com&src=https://locator.development.uberall.com/${process.env.BRANCH_NAME}/storeFinderWidget-v2.js&bundleUrl=https://locator.development.uberall.com/${process.env.BRANCH_NAME}/store-finder-widget-bundle-v2-modern.js&assetsFolderUrl=https://locator.development.uberall.com/${process.env.BRANCH_NAME}&widgetoriginurl=#!/`, { waitUntil: "load" })
         
         await page.waitForTimeout(5000)
         
         console.log(`https://uberall.store/health-check/tester?storeKey=${createSF.response.storeFinderKey}&env=locator.development.uberall.com&src=https://locator.development.uberall.com/${process.env.BRANCH_NAME}/storeFinderWidget-v2.js&bundleUrl=https://locator.development.uberall.com/${process.env.BRANCH_NAME}/store-finder-widget-bundle-v2-modern.js&assetsFolderUrl=https://locator.development.uberall.com/${process.env.BRANCH_NAME}&widgetoriginurl=#!/`)
         await expect(page).toHaveScreenshot({
            fullPage: true,
            mask: [page.locator('//ul[@class="ubsf_locations-list-item-additional-info"]')]
         })
      })

   }),
   
   test(`Check location local page is diplayed correctly @pipeline`, async ({ page }) => {

      const storeLocator = new StoreLocatorPage(page)

      await test.step("Given user open storefinder", async () => {
         await page.goto(`https://uberall.store/health-check/tester?storeKey=${createSF.response.storeFinderKey}&env=locator.development.uberall.com&src=https://locator.development.uberall.com/${process.env.BRANCH_NAME}/storeFinderWidget-v2.js&bundleUrl=https://locator.development.uberall.com/${process.env.BRANCH_NAME}/store-finder-widget-bundle-v2-modern.js&assetsFolderUrl=https://locator.development.uberall.com/${process.env.BRANCH_NAME}&widgetoriginurl=#!/`, { waitUntil: "load" })
      })

      await test.step("When user selects a location from the map", async () => {
          await storeLocator.selectLocationFromMapDev()
          await storeLocator.verifyLocationDataInfoWindowDev('g-loc-4Hohenzollernstraße 15280797 München', '+49 30 208479320', 'DirectionsDetail Page')
          await storeLocator.openLocationDev()
      })

      await test.step("Then location local page will be open", async () => {
          await expect(page).toHaveScreenshot({
              fullPage: true,
              mask: [page.locator('.ubsf_opening-hours-wrapper')]
          })
      })
  }),

      test.afterEach(async () => {
         // Dispose all responses.
         deleteSF = await apiUtils.deleteRequest(apiContext, `/api/widgets/${createSF.response.id}?v=20240220`)
         console.log(deleteSF)
         await apiContext.dispose()
      });
})