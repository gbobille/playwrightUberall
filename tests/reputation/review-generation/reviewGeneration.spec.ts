import { expect } from "@playwright/test"
import { test } from "../../setup"
import { testConfig } from "../../../testconfig.config"
import ReviewGeneration from "../../../pages/lp/app/reviewGeneration"
import { loginUberallAppAs } from "../../../utils/login-util"

test.describe("End to end test for Review Generation on PROD", () => {
    test(`Send a Review Generation manual email @reviewgeneration`, async ({ page }) => {
        const reviewGeneration = new ReviewGeneration(page)

        await test.step("Given user login to Uberall PROD", async () => {
            await loginUberallAppAs(page, `${testConfig.reviewGenUser}`,`${testConfig.reviewGenPass}`)
        })

        await test.step("When user navigates to Review Generation page", async () => {
            await reviewGeneration.reviewGenerationTab("Review Management")
            await reviewGeneration.getReviewsTab2("Get Reviews")
        })

        await test.step("And when user opens the New Request modal", async () => {
            await reviewGeneration.newReviewsRequestTab.click({ timeout: 30000 })
        })

        await test.step("And when user manually inputs their information and sends an email", async() => {
            await reviewGeneration.manualButton.click()
            await reviewGeneration.firstNameField.fill("FirstName")
            await reviewGeneration.lastNameField.fill("LastName")
            await reviewGeneration.emailField.fill("ub_performance_tester1@yahoo.com")
            await reviewGeneration.chooseLocationDropdown("Choose location")
            await reviewGeneration.locationList("PPP test sync, Hussitenstraße 33, 13355 Berlin")
            await reviewGeneration.nextButton.click()
            await reviewGeneration.templateDropdown.click()
            await reviewGeneration.templateSelection.click()
            await reviewGeneration.sendNowButton.click()
            await reviewGeneration.sendNowButton.click()
        })

        await test.step("Then user verifies the email was sent successfully", async() => {
            await expect(reviewGeneration.page.getByText("Success, your requests have been sent.")).toBeVisible({ timeout: 30000 })
        })
    })

    test(`Send a Review Generation manual SMS to EU # @reviewgeneration`, async ({ page }) => {
        const reviewGeneration = new ReviewGeneration(page)

        await test.step("Given user login to Uberall PROD", async () => {
            await loginUberallAppAs(page, `${testConfig.reviewGenUser}`,`${testConfig.reviewGenPass}`)
        })

        await test.step("When user navigates to Review Generation page", async () => {
            await reviewGeneration.reviewGenerationTab("Review Management")
            await reviewGeneration.getReviewsTab2("Get Reviews")
        })

        await test.step("And when user opens the New Request modal", async () => {
            await reviewGeneration.newReviewsRequestTab.click({ timeout: 30000 })
        })

        await test.step("And when user manually inputs their information and sends an SMS number", async() => {
            await reviewGeneration.manualButton.click()
            await reviewGeneration.radioSMS.getByText('SMS').click()
            await reviewGeneration.firstSMSNameField.fill("FirstName")
            await reviewGeneration.lastSMSNameField.fill("LastName")
            await reviewGeneration.numberSMSField.fill("+13106029845")
            await reviewGeneration.chooseLocationDropdown("Choose location")
            await reviewGeneration.locationList("PPP test sync, Hussitenstraße 33, 13355 Berlin")
            await reviewGeneration.nextButton.click()
            await reviewGeneration.templateDropdown.click()
            await reviewGeneration.templateSMS.click()
            await reviewGeneration.sendNowButton.click()
            await reviewGeneration.sendNowButton.click()
        })

        await test.step("Then user verifies the email was sent successfully", async() => {
            await expect(reviewGeneration.page.getByText("Success, your requests have been sent.")).toBeVisible({ timeout: 30000 }) 
        })
    })
})
