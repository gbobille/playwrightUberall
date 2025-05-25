import { expect, test } from "@playwright/test";
import { createSFBody as originalCreateSFBody } from "../../testData/data/createSF.json";
import { resposeBody } from "../../testData/data/SFconfigRes.json";
import Login from "../../../pages/components/login";
import Dashboard from "../../../pages/websites/dashboard";
import LocatorPages from "../../../pages/websites/locatorPagesPage";
import BaseCall from "../../../api/uberall/baseCall";
import Utils from "../../../utils/utils";
import { ApiEnvironmentHelper } from "../../../api/uberall/apiEnvironmentHelper";

/**
 * Testing self service
 */
test.describe("Self service", async () => {
   let apiContext
   let createStoreFinderResponse
   let getSFOptions
   const apiUtils = new BaseCall()
   const utils = new Utils()
   const privateKey = ApiEnvironmentHelper.get1098PrivateKey()

   test.beforeAll(async () => {
      apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', privateKey, "")
   })

   test(`Check that changing SF configs will refelct on SF settings @apitest @multi_env_regression @testselfservice @webregression`, async ({ page }) => {
      const dashboard = new Dashboard(page)
      const locatorBuilder = new LocatorPages(page)

      await test.step("Given user creates a SF", async () => {
         const createSFBody = { ...originalCreateSFBody, name: utils.generateRandomName() };
         createStoreFinderResponse = await apiUtils.postRequest(apiContext, `/api/widgets/?v=20240220`, createSFBody)

         await page.goto(`${process.env.BASE_URL}`)
         const login = new Login(page)
         await login.goto()
         await login.userLogin(process.env.QA_UN, process.env.QA_P)
      })

      await test.step("And user opens storefinder config", async () => {
         await dashboard.validateHomePageIsOpenNewNav()
         await dashboard.navigateToLocatorPagesNewNav()
         await locatorBuilder.searchForLocator(`${createStoreFinderResponse.response.name}`)
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
         getSFOptions = await apiUtils.getRequest(apiContext, `/api/widgets/${createStoreFinderResponse.response.id}`)
         const SFconfigs = getSFOptions.response.config
         await expect(SFconfigs).toStrictEqual(resposeBody)
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
});
