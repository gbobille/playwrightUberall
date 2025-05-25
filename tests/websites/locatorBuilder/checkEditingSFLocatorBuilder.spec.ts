import { expect, test } from "@playwright/test";
import Dashboard from "../../../pages/websites/dashboard";
import LocatorPages from "../../../pages/websites/locatorPagesPage";
import StoreLocatorPage from "../../../pages/websites/storeLocator";
import { testConfig } from "../../../testconfig.config";
import LocalPage from "../../../pages/websites/localPage";
import Login from "../../../pages/components/login";
import BaseCall from "../../../api/uberall/baseCall";
import Utils from "../../../utils/utils";
import { createSFBody as originalCreateSFBody } from "../../testData/data/createSF.json";
import { ApiEnvironmentHelper } from "../../../api/uberall/apiEnvironmentHelper";
/**
 * Testing self service 
 */

test.describe("Self service", async () => {
   let apiContext
   let createStoreFinderResponse
   const apiUtils = new BaseCall()
   const utils = new Utils()
   const privateKey = ApiEnvironmentHelper.get1098PrivateKey()

   test.beforeAll(async () => {
      apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', privateKey, "")
   })

   test(`Check that changing background color will refelect on storefinder @multi_env_regression @testselfservice @webregression`, async ({ context }) => {
      /**
       * example of saving and using state
       * const context = await browser.newContext({ storageState: 'utils/auth/loggedInState.json' })
       * const page = await context.newPage()
       */
      const page = await context.newPage()
      await test.step("Given user navigates to selfservices", async () => {
         const createSFBody = { ...originalCreateSFBody, name: utils.generateRandomName() };
         createStoreFinderResponse = await apiUtils.postRequest(apiContext, `/api/widgets/?v=20240220`, createSFBody)

         await page.goto(`${process.env.BASE_URL}`)
         const login = new Login(page)
         await login.goto()
         await login.userLogin(process.env.QA_UN, process.env.QA_P)
      })

      const dashboard = new Dashboard(page)
      const locatorBuilder = new LocatorPages(page)

      await test.step("When user opens locator builder", async () => {
         await dashboard.navigateToLocatorPages()
         await locatorBuilder.verifyLocatorPagesOpen()
      })

      await test.step("And user opens storefinder editor", async () => {
         await locatorBuilder.openStoreLocatorEditor(`${createStoreFinderResponse.response.name}`)
      })

      await test.step("And user changes the background color", async () => {
         await locatorBuilder.openColorTab()
         await locatorBuilder.changeColor("#FF0000")
         await locatorBuilder.verifyColorChange()
         await locatorBuilder.changeColor('#0000FF')
         await locatorBuilder.verifyColorChange()
         await locatorBuilder.saveChanges()
      })

      await test.step("Then the color change will reflect in the storefinder", async () => {
         const page2 = await context.newPage()
         await page2.goto(`https://uberall.store/health-check/tester?storeKey=${createStoreFinderResponse.response.storeFinderKey}&env=${process.env.WEBSITES_ENV}&src=https://locator.uberall.com/locator-assets/storeFinderWidget-v2.js&widgetoriginurl=#!/`, { waitUntil: "load" })
         const storeFinder = new StoreLocatorPage(page2)
         await storeFinder.verifyBackGroundColorChange()
      })
   }),
      test(`Check that user can select from Custom html drop down @multi_env_regression @selfservice @testselfservice @webregression`, async ({ context }) => {
         /*
            Scenario: Select from Custom HTML drop down
            Prerequesities:
               - Custom fields added from ABE
               - Custom fileds have value for the location selected
         */
         const page = await context.newPage()
         const dashboard = new Dashboard(page)
         const locatorBuilder = new LocatorPages(page)

         await test.step("Given user navigates to selfservices", async () => {
            const createSFBody = { ...originalCreateSFBody, name: utils.generateRandomName() };
            createStoreFinderResponse = await apiUtils.postRequest(apiContext, `/api/widgets/?v=20240220`, createSFBody)

            await page.goto(`${process.env.BASE_URL}`)
            const login = new Login(page)
            await login.goto()
            await login.userLogin(process.env.QA_UN, process.env.QA_P)
         })

         await test.step("When user opens locator builder", async () => {
            await dashboard.navigateToLocatorPages()
         })

         await test.step("And user edits a store locator", async () => {
            await locatorBuilder.openStoreLocatorEditor(`${createStoreFinderResponse.response.name}`)
         })

         await test.step("And user opens Pages tab", async () => {
            await locatorBuilder.openPagesTab()
         })

         await test.step("And user scrolls dows to Add section to Main Column", async () => {
            await locatorBuilder.addCustomHtmlToPrimaryColumn()
         })

         await test.step("And user selects option from Custom html drop down", async () => {
            await locatorBuilder.selectCustomHtmlInPrimaryColumn()
         })

         await test.step("And user saves changes", async () => {
            await locatorBuilder.saveChanges()
         })

         await test.step("Then local page will be updated with the selected value", async () => {
            const page2 = await context.newPage()
            await page2.goto(`https://uberall.store/health-check/tester?storeKey=${createStoreFinderResponse.response.storeFinderKey}&env=${process.env.WEBSITES_ENV}&src=https://locator.uberall.com/locator-assets/storeFinderWidget-v2.js&widgetoriginurl=#!/`, { waitUntil: "load" })
            let storeFinder = new StoreLocatorPage(page2)
            await storeFinder.selectgloc1FromList()
            let localPage = new LocalPage(page2)
            await localPage.verifyCustomFieldIsAddedToMainColumn()
            await page2.close()
            
            // Clean up
            await page.goto(`${process.env.DASHBOARD_URL}`, { waitUntil: "load" })
            await dashboard.navigateToLocatorPages()
            await locatorBuilder.deleteCustomHtmlFromMainColumn(`${createStoreFinderResponse.response.name}`)
            const page3 = await context.newPage()
            await page3.goto(`https://uberall.store/health-check/tester?storeKey=${createStoreFinderResponse.response.storeFinderKey}&env=${process.env.WEBSITES_ENV}&src=https://locator.uberall.com/locator-assets/storeFinderWidget-v2.js&widgetoriginurl=#!/`, { waitUntil: "domcontentloaded" })
            storeFinder = new StoreLocatorPage(page3)
            await storeFinder.selectgloc1FromList()
            localPage = new LocalPage(page3)
            await localPage.verifyCustomFieldIsDeletedFromMainColumnNoScreenshot()
         })
      }),
      test(`Check that user can change the sorting in secondary column @multi_env_regression @xselfservice @xwebregression`, async ({ context }) => {
         /*
         Scenario: Select from Custom HTML drop down
         Prerequesities:
            - 
            - 
         */
         const page = await context.newPage()
         const dashboard = new Dashboard(page)
         const locatorBuilder = new LocatorPages(page)

         await test.step("Given user navigates to selfservices", async () => {
            const createSFBody = { ...originalCreateSFBody, name: utils.generateRandomName() };
            createStoreFinderResponse = await apiUtils.postRequest(apiContext, `/api/widgets/?v=20240220`, createSFBody)

            await page.goto(`${process.env.BASE_URL}`)
            const login = new Login(page)
            await login.goto()
            await login.userLogin(process.env.QA_UN, process.env.QA_P)
         })

         await test.step("When user opens locator builder", async () => {
            await dashboard.navigateToLocatorPages()
         })

         await test.step("And user edits a store locator", async () => {
            await locatorBuilder.openStoreLocatorEditor(`${createStoreFinderResponse.response.name}`)
         })

         await test.step("And user scrolls dows to secondary column", async () => {
            await locatorBuilder.openPagesTab()
         })

         await test.step("And user drags Categories below Brands", async () => {
            await locatorBuilder.changeSideMenuSorting()
            await locatorBuilder.saveChanges()
         })

         await test.step("Then the sorting will change accordingly on the local page", async () => {
            const localPage = new LocalPage(page)
            await localPage.verifyCustomFieldDeletedFromMainColumn(context, `${testConfig.gloc1localPageSF2}`)

            // Clean up
            await page.goto(`${process.env.DASHBOARD_URL}`)
            await dashboard.navigateToLocatorPages()
            await locatorBuilder.revertSideMenuSorting()
         })
      })

   // Cleanup after each test, in case of success or failure
   test.afterEach(async () => {
      console.log("Cleaning up after test...")
      const deleteSF = await apiUtils.deleteRequest(apiContext, `/api/widgets/${createStoreFinderResponse.response.id}?v=20240220`)
      console.log("Delete SF - Cleanup:", deleteSF)
   })

   // Dispose of the apiContext once after all tests in the suite are complete
   test.afterAll(async () => {
      await apiContext.dispose()
   })
})
