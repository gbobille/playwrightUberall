import { test, expect } from "@playwright/test";
import Login from "../../../pages/components/login";
import { testConfig } from "../../../testconfig.config";
import ReviewGeneration from "../../../pages/lp/app/reviewGeneration";


test.describe("Regression on DEV - End to end test for Review Generation", () => {

    test(`Send a Review Generation email @lp_regression`, async ({ page }) => {
        const reviewGeneration = new ReviewGeneration(page)

        await test.step("Given user login to Uberall Dev", async () => {
            await page.goto(`${process.env.DASHBOARD_URL}`)
            const login = new Login(page)
            await login.userLogin(`${testConfig.reviewGenUser}`,`${testConfig.reviewGenPass}`)
        })

        await test.step("When user navigates to Review Generation page", async () => {
            //await reviewGeneration.ignoreButton("Ignore")
            await reviewGeneration.reviewGenerationTab("Review Management")
            await reviewGeneration.reviewGenerationTab("Get Reviews")        
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
            expect(await reviewGeneration.sucessMessageDisplayed("Success, your requests have been sent.")).toBeTruthy()
        })
    })

    test(`Send a Review Generation SMS @lp_regression`, async ({ page }) => {
        const reviewGeneration = new ReviewGeneration(page)

        await test.step("Given user login to Uberall Dev", async () => {
            await page.goto(`${process.env.DASHBOARD_URL}`)
            const login = new Login(page)
            await login.userLogin(`${testConfig.reviewGenUser}`,`${testConfig.reviewGenPass}`)
        })

        await test.step("When user navigates to Review Generation page", async () => {
            //await reviewGeneration.ignoreButton("Ignore")
            await reviewGeneration.reviewGenerationTab("Review Management")
            await reviewGeneration.reviewGenerationTab("Get Reviews")  
        })

        await test.step("And when user opens the New Request modal", async () => {
            await reviewGeneration.newReviewsRequestTab.click({ timeout: 30000 })
        })

        await test.step("Then when user manually inputs their information and sends an email", async() => {
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
            expect( await reviewGeneration.sucessMessageDisplayed("Success, your requests have been sent.")).toBeTruthy()
        })
    })
})
