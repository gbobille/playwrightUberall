/* eslint-disable playwright/valid-describe-callback */
import { expect, test } from "@playwright/test";
import LocationPage from "../../../pages/datamanagement/singleLocationProfile/basicDataPage"
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig }  from "../dataManagement.config";
import CreateRandomString from "../../../utils/createRandomString-util";

test.describe(`Edit a Location - Basic Data @single_location_profile @dm_regression`, async () => {

    test.beforeEach("Given user successfully logs in and navigates to a location page", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
        await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/basic-data`, { waitUntil: 'domcontentloaded' });
    })

    test(`Verify user can update address line 2`, async ({ page }) => {
        const basicData = new LocationPage (page)

        await test.step(`And user modifies the address line 2`, async () => {
            await basicData.updateAddressLine2('Unit ' + await CreateRandomString.generateRandomString(3, 'numeric'))
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })

        await test.step(`And user modifies the address line 2 again`, async () => {
            await basicData.updateAddressLine2('Unit ' + await CreateRandomString.generateRandomString(3, 'numeric'))
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`And user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })

    test(`Verify user can update the mobile number`, async ({ page }) => {
        const basicData = new LocationPage (page)

        await test.step(`And user modifies the mobile number`, async () => {
            await basicData.updateMobileNumber('+63 2 ' + await CreateRandomString.generateRandomString(8, 'numeric'))
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })

        await test.step(`And user modifies the mobile number again`, async () => {
            await basicData.updateMobileNumber('+63 2 ' + await CreateRandomString.generateRandomString(8, 'numeric'))
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`And user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })

    test(`Verify user can update the fax number`, async ({ page }) => {
        const basicData = new LocationPage (page)

        await test.step(`And user modifies the fax number`, async () => {
            await basicData.updateFaxNumber('+1 847-563- ' + await CreateRandomString.generateRandomString(4, 'numeric'))
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })

        await test.step(`And user modifies the fax number again`, async () => {
            await basicData.updateFaxNumber('+63 2 ' + await CreateRandomString.generateRandomString(4, 'numeric')
        + ' ' + await CreateRandomString.generateRandomString(4, 'numeric'))
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`And user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })

    test(`Verify user can update the email`, async ({ page }) => {
        const basicData = new LocationPage (page)

        await test.step(`And user modifies the email`, async () => {
            await basicData.updateEmail('test.' + await CreateRandomString.generateRandomString(4) +'@uberall.com')
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })

        await test.step(`And user modifies the email again`, async () => {
            await basicData.updateEmail('test.' + await CreateRandomString.generateRandomString(5, 'numeric') +'@uberall.com')
        })

        await test.step(`And user saves the data`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`And user verifies changes were applied successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })
})