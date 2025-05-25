import { test, Page } from "@playwright/test";
import LocationHub from "../../../pages/websites/locationHub";
import WidgetWebPage from "../../../pages/websites/widgetWebPage";
import BaseCall from "../../../api/uberall/baseCall";
import { loginUberallAppAs } from "../../../utils/login-util";
import { websiteWidgetConfig } from "./websiteWidget.config";
import { tileTester } from "../../../pages/websites/tileTester";
import tileUpdateData from "../../testData/data/tileUpdate.json";

async function loginUser(page: Page) {
  await loginUberallAppAs(page, process.env.LP_LM_UN, process.env.LP_P)
}

async function navigateToWidgetPage(page: Page) {
  const tile = new tileTester()
  await tile.navigateToWidgetPage(page)
  return new WidgetWebPage(page)
}

test.describe('Website Widget', () => {

  test('Check that users can edit the review tile settings @websitewidget @webregression @multi_env_regression', async ({page}) => {
    await test.step('Given user logs in to Uberall PROD', async () => {
      await loginUser(page)
    })

    await test.step('When user opens the location hub', async () => {
      const locationHub = new LocationHub(page)
      await locationHub.openLocationHub()
      await locationHub.searchAndSelectLocation({
        identifier: websiteWidgetConfig.LOCATION_IDENTIFIER,
        name: websiteWidgetConfig.LOCATION_NAME
      })
    })

    await test.step('Verify that users can edit the review tile', async () => {
      const locationHub = new LocationHub(page)
      await locationHub.editReviewTile()
    })

    await test.step('Verify that the review tile changes reflect on the webpage', async () => {
      const widgetWebPage = await navigateToWidgetPage(page)
      await widgetWebPage.verifyReviewEdits()
    })
  })

  test('Check that users can revert the changes on the review tile @websitewidget @webregression @multi_env_regression', async ({page}) => {
    await test.step('Revert the widget edits via API', async() => {
      const apiUtils = new BaseCall()
      const formData = new URLSearchParams()
    
      formData.append("email", process.env.LP_LM_UN)
      formData.append("password", process.env.LP_P)
      let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/x-www-form-urlencoded', "")
      const response = await apiUtils.postRequest(apiContext, '/api/users/login', formData.toString())
      const userToken = response.response.access_token
    
      const requestBody = JSON.stringify(tileUpdateData)
      apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
      await apiUtils.patchRequest(apiContext, `/api/locations/${websiteWidgetConfig.LOCATION_ID}/widgets?v=20191203&access_token=${userToken}`, requestBody)
    })

    await test.step('Verify that the reverted changes reflect on the webpage', async () => {
      const widgetWebPage = await navigateToWidgetPage(page)
      await widgetWebPage.verifyRevertEdits()
    })
  })

  test('Check that users can discard the changes and copy the snippets @websitewidget @webregression @multi_env_regression', async ({page}) => {
    await loginUser(page)
    const locationHub = new LocationHub(page)
    await locationHub.openLocationHub()
    await locationHub.searchAndSelectLocation({
      identifier: websiteWidgetConfig.LOCATION_IDENTIFIER,
      name: websiteWidgetConfig.LOCATION_NAME
    })

    await test.step('Verify that users can discard changes made anywhere on the widget', async () => {
      await locationHub.discardChanges()
    })

    await test.step('Verify that users can copy the widget snippets', async () => {
      await locationHub.copySnippet()
    })
  })
})