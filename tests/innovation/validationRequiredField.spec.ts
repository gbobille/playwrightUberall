/* eslint-disable playwright/valid-describe-callback */
import { test } from '@playwright/test';
import Login from '../../pages/components/login';
import Messages from '../../pages/innovation/messages';

test.describe("Validate required fields for FB setups", async () => {
  test(`FB brand setup validation  @conversation`, async ({ page }) => {
    const messages = new Messages(page)

    await test.step("Given user login to Uberall", async () => {
      await page.goto(`${process.env.BASE_URL}`)
      const login = new Login(page)
      await login.goto()
      await login.userLogin(process.env.PP_ADM, process.env.PP_P)
    })

    await test.step("Proceed to New Setup Form", async () => {
      await messages.clickOnMessages()
      await messages.navigateToSetupTable()
      await messages.navigateToNewSetup()
    })

    await test.step("Fillout Few Fields", async () => {
      await messages.activateBusinessToggle()
      await messages.clickOnAccount()
      await page.locator('#react-select-5-input').fill('goo')
      await messages.selectAccountFromDropDown()
      await messages.selectFBBrandToggle()
      await messages.clickSave()
    })

    await test.step("Validate Error Messages", async () => {
      await messages.nameErrorMessage()
    })
  });

  test(`Validate Wecbchat required fields @conversation`, async ({ page }) => {
    const messages = new Messages(page)

    await test.step("Given user login to Uberall", async () => {
      await page.goto(`${process.env.BASE_URL}`)
      const login = new Login(page)
      await login.goto()
      await login.userLogin(process.env.PP_ADM, process.env.PP_P)
    })

    await test.step("Proceed to New Setup Form", async () => {
      await messages.clickOnMessages()
      await messages.navigateToSetupTable()
      await messages.navigateToNewSetup()
    })

    await test.step("Fillout Few Fields", async () => {
      await messages.activateBusinessToggle()
      await messages.clickOnAccount()
      await page.locator('#react-select-5-input').fill('goo')
      await messages.selectAccountFromDropDown()
      await messages.selectWebchatToggle()
      await messages.clickSave()
    })

    await test.step("Validate Error Messages", async () => {
      await messages.logoErrorMessage()
      await messages.languageErrorMessage()
      await messages.chatNameErrorMessage()
    })
  })
})
