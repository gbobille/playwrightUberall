import { expect, test } from "@playwright/test";
import Locations from "../../../pages/datamanagement/locationsList";
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig }  from "../dataManagement.config";


test.describe("User can filter by Business > All (Defect: QA-1560) @businessFilter @dmdefects", async () => {
    test.beforeEach("Given admin user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.DM_ADMIN_USER_SUBLOCALITY, process.env.DM_ADMIN_PASSWORD)
    })

    test(`Verify user can successfully filter by Business`, async ({ page }) => {
        const locationListPage = new Locations (page)

        await test.step(`And user is on the locations list page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user selects a Business`, async () => {
            await locationListPage.clickBusinessFilter()
            await locationListPage.selectBusinessName('Anna\'s Test')
        })

        await test.step(`And user verifies the correct locations are loaded from the selected business`, async () => {
            await locationListPage.locationAddress('Oranienburger Straße 66 10117')
            await locationListPage.locationAddress('main street 97439 Anywhere')
        })

        await test.step(`Then user verifies All is not part of the filters options`, async () => {
            await locationListPage.clickBusinessFilter()
            await locationListPage.validateBusinessName('All')
        })
    })
})
