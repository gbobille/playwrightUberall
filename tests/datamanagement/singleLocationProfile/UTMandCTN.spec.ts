/* eslint-disable playwright/valid-describe-callback */
import { expect, test } from "@playwright/test";
import LocationPage from "../../../pages/datamanagement/singleLocationProfile/basicDataPage"
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig }  from "../dataManagement.config";

test.describe(`Edit a Location - Basic Data @single_location_profile`, async () => {

    test.beforeEach("Given user successfully logs in and navigates to a location page", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
        await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_CTN_UTM}/basic-data`, { waitUntil: 'domcontentloaded' });
    })

    test(`Verify user can add CTN to Location`, async ({ page }) => {
        const basicData = new LocationPage (page)

        await test.step(`And user user sets CTN`, async () => {
            await basicData.setCTN()
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })

    
    test(`Verify user can add UTM to Location`, async ({ page }) => {
        const basicData = new LocationPage (page)

        await test.step(`And user user sets UTM`, async () => {
            await basicData.setUTM()
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })

    test(`Verify user can clear UTM and CTN to Location`, async ({ page }) => {
        const basicData = new LocationPage (page)

        await test.step(`And user user sets UTM`, async () => {
            await basicData.clearCTnandUTM()
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })
 
})