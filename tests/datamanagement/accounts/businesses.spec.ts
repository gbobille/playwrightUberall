import { expect, test } from "@playwright/test";
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig } from "../dataManagement.config";
import BusinessesPage from "../../../pages/datamanagement/businessesPage";

test.describe(`Businesses Page - Verify users can access the Businesses Page @dm_regression`, { tag: '@dm_regression' }, () => {
    test.beforeEach("Given user successfully log in to the app", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
        await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'domcontentloaded' })
    })

    test(`Verify user can view the new Businesses Page and access the Location List Page from it`, async ({ page }) => {
        const businessesPage = new BusinessesPage (page)

        await test.step('And user clicks the Business tab', async () => {
            await businessesPage.businessTab.click()
        })

        await test.step('And user types a Business name', async () => {
            await businessesPage.searchField.click()
            await businessesPage.searchField.fill('DM_DOCTOR_PLAN')
            await businessesPage.searchField.press('Enter')
        })

        await test.step('And user clicks the URL link', async() => {
            await businessesPage.businessCount.click()
        })

        await test.step('Then user verifies the filtered Location List page is loading', async() => {
            await expect(page).toHaveURL(`${process.env.BASE_URL}/en/app/uberall/locations?businessIds=2238502`)
        })
    })

    test(`Verify user can add new business`, async ({ page }) => {
        const businessesPage = new BusinessesPage (page)

        await test.step('And user clicks the Business tab', async () => {
            await businessesPage.businessTab.click()
        })

        await test.step('And user clicks the Add Business button', async() => {
            await businessesPage.addBusiness.click()
        })

        await test.step('Then user verifies correct Add a Business page', async() => {
            await expect(page).toHaveURL(`${process.env.BASE_URL}/en/app/uberall/businessCreate`)
            await expect(businessesPage.createBusinessHeading).toBeVisible()
        })
    })

    test(`Verify user can add a new location`, async ({ page }) => {
        const businessesPage = new BusinessesPage (page)

        await test.step('And user clicks the Business tab', async () => {
            await businessesPage.businessTab.click()
        })

        await test.step('And user clicks the + button to add new locations', async () => {
            await businessesPage.addLocation.click()
        })

        await test.step('Then user verifies correct Create a Location page is shown', async() => {
            await expect(page).toHaveURL(`${process.env.BASE_URL}/en/app/uberall/locationCreate/basic-data?businessId=1241868`)
        })
    })

    test(`Verify user can view the Product Plan`, async ({ page }) => {
        const businessesPage = new BusinessesPage (page)

        await test.step('And user clicks the Business tab', async () => {
            await businessesPage.businessTab.click()
        })

        await test.step('And user types a Business name: Bike Racks Smart Conversation', async () => {
            await businessesPage.searchField.click()
            await businessesPage.searchField.fill('Bike Racks Smart Conversation')
            await businessesPage.searchField.press('Enter')
        })

        await test.step('And user clicks the Product Plan: uberall listings engage', async () => {
            await businessesPage.productPlan.click()
        })

        await test.step('Then user verifies correct Product Plan page is shown', async() => {
            await expect(page).toHaveURL(`${process.env.BASE_URL}/en/app/uberall/businessDetail/1241868`)
        })
    })
})