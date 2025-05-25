import { expect, test } from "@playwright/test"
import LocationPage from "../../../pages/datamanagement/singleLocationProfile/basicDataPage"
import { loginUberallAppAs } from "../../../utils/login-util"
import { dataManagementConfig } from "../dataManagement.config"

test.describe(`AI Business Description is applied when AI_LOCATION_INFORMATION is enabled`, { tag: '@ai_business_description, @dm_regression' }, () => {
    test(`Verify users can view Adjust Tone when working on Short Description field`, async ({ page }) => {
        const basicData = new LocationPage(page)

        await test.step(`Given user logs in to the app and navigates to a location`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user updates the Short Description`, async () => {
            await basicData.shortDescription.click()
            await basicData.shortDescription.fill('This is a retail store.')
        })

        await test.step(`And user opens the Adjust Tone modal`, async () => {
            await basicData.shortDescriptionAdjustTone.click()
        })

        await test.step(`Then user selects PROFESSIONAL tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('PROFESSIONAL').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user selects INSPIRATIONAL tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('INSPIRATIONAL').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user selects CASUAL tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('CASUAL').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user selects FUN tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('FUN').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user selects HELPFUL tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('HELPFUL').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user Submits the tone`, async () => {
            await basicData.submitTone.click()
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`And user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })

    test(`Verify users can view Adjust Tone when working on Long Description field`, async ({ page }) => {
        const basicData = new LocationPage(page)

        await test.step(`Given user logs in to the app and navigates to a location`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user updates the Long Description`, async () => {
            await basicData.longDescription.click()
            await basicData.longDescription.fill('This is a long description.')
        })

        await test.step(`And user opens the Adjust Tone modal`, async () => {
            await basicData.longDescriptionAdjustTone.click()
        })

        await test.step(`Then user selects PROFESSIONAL tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('PROFESSIONAL').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user selects INSPIRATIONAL tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('INSPIRATIONAL').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user selects CASUAL tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('CASUAL').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user selects FUN tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('FUN').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user selects HELPFUL tone and verifies tone is adjusted`, async () => {
            await basicData.toneStyle('HELPFUL').click()
            const response = await page.waitForResponse('https://dev.uberall.com/api/ai/adjust-tone?v=20191203')
            const responseBody = await response.json()
            await expect(basicData.adjustedText(responseBody.response.adjustedText)).toBeVisible()
        })

        await test.step(`And user Submits the tone`, async () => {
            await basicData.submitTone.click()
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`And user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })

    test(`Verify Adjust Tone is not visible when adding a location to a Business (Product Plan) that doesn't have AI_LOCATION_INFORMATION`, async ({ page }) => {
        const basicData = new LocationPage(page)

        await test.step(`Given user logs in to the app and navigates to a location`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationCreate/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects a Business without`, async () => {
            await basicData.businessSearchField.click()
            await basicData.businessSearchField.fill('Schweinske')
            await basicData.business_with_ai.click()
        })

        await test.step(`And user updates the Short Description`, async () => {
            await basicData.shortDescription.click()
            await basicData.shortDescription.fill('This is a retail store.')
        })

        await test.step(`Then user can't locate the Adjust Tone modal`, async () => {
            await expect(basicData.shortDescriptionAdjustTone).not.toBeVisible()
        })
    })

    test(`Verify Adjust Tone is visible when adding a location to a Business (Product Plan) that has AI_LOCATION_INFORMATION`, async ({ page }) => {
        const basicData = new LocationPage(page)

        await test.step(`Given user logs in to the app and navigates to a location`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationCreate/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects a Business without`, async () => {
            await basicData.businessSearchField.click()
            await basicData.businessSearchField.fill('Bike Racks Smart Conversation')
            await basicData.business_with_no_ai.click()
        })

        await test.step(`And user updates the Short Description`, async () => {
            await basicData.shortDescription.click()
            await basicData.shortDescription.fill('This is a retail store.')
        })

        await test.step(`Then user can't locate the Adjust Tone modal`, async () => {
            await expect(basicData.shortDescriptionAdjustTone).toBeVisible()
        })
    })

    test(`Verify users can generate an AI description`, async ({ page }) => { 
        const basicData = new LocationPage(page)

        await test.step(`Given user logs in to the app and navigates to a location`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user clicks the AI Generator icon and submits a prompt`, async () => {
            await basicData.aiGeneratorIcon.click()
            await basicData.aiPrompt.click()
            await basicData.aiPrompt.fill('this is a tiny coffee shop')
            await basicData.aiPrompt.press('Enter')
        })

        await test.step(`Then user verifies the generated description is appearing`, async() => {
            const response = await page.waitForResponse('https://dev.uberall.com/api/location-ai/generate-description')
            const responseBody = await response.json()
            await expect(basicData.description(responseBody.description)).toBeVisible()
        })
    })
})