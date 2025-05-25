import { expect, test } from "@playwright/test";
import LocationListRevamp from "../../../pages/datamanagement/locationListRevamp";
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig } from "../dataManagement.config";
import BulkUpdate from "../../../pages/datamanagement/bulkUpdatePage";
import BaseCall from "../../../api/uberall/baseCall";
import createRequestBodyUtil from "../../../api/uberall/utils/create-request-body-util";

const location1 = 'DM_BulkUpdate_Location - I'
const location2 = 'DM_BulkUpdate_Location II'

test.describe("Bulk Update Basic Data", { tag: '@dm_regression' }, () => {

    test.beforeEach("Given admin user successfully logs in", async ({ page }) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    });
    test("Bulk Update Basic Page - Overwrite", async ({ page }) => {
        const bulkUpdatePage = new BulkUpdate(page);
        const locationListRevamp = new LocationListRevamp(page)

        await test.step(`And user is on the locations list page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'load' });
        });
        await test.step(`And user clicks the Bulk Update button and clicks the Bulk Editor button`, async () => {
            await bulkUpdatePage.bulkUpdateButton.click();
            await locationListRevamp.bulkEditorButton.click();
        });
        await test.step(`And user click + Add Location, select the location and clicks Next`, async () => {
            await bulkUpdatePage.clickAddLocationsButton();
            await bulkUpdatePage.selectBulkLocationSearch.fill("DM_BulkUpdate_Location -")
            await bulkUpdatePage.selectBulkLocation1Value(location1).click()
            await bulkUpdatePage.selectBulkLocation2Value(location2).click()
            await bulkUpdatePage.clickSelectButton()
            //await bulkUpdatePage.clickNext() --Removed this as this is causing a failure since it is not needed
        });
        await test.step(`And user updates basic data page`, async () => {
            await bulkUpdatePage.updateOpeningHours()
            await bulkUpdatePage.updateBusinessInfoAndDescription()
            await bulkUpdatePage.updateLabels()
            await bulkUpdatePage.clickNext()
        });
        await test.step(`And user validates data is correct in confirmation page and click Save changes button`, async () => {
            await bulkUpdatePage.validateChanges('German')
            await bulkUpdatePage.validateChanges('Mon - Sun: 09:00-18:00')
            await bulkUpdatePage.validateChanges('Test Opening Hours Notes')
            await bulkUpdatePage.validateChanges('Short Description Text')
            await bulkUpdatePage.validateChanges('Long Description Text')
            await bulkUpdatePage.validateChanges('Imprint Test')
            await expect(bulkUpdatePage.locationNameCell(location1)).toBeVisible()
            await expect(bulkUpdatePage.locationNameCell(location2)).toBeVisible()
            await bulkUpdatePage.clickSaveChanges()
        });
        await test.step('Then the basic data update flows succeeds', async () => {
            await expect(bulkUpdatePage.successMessageUpdate).toBeVisible()
        });

    });

    test("Bulk Update Basic Page - Append", async ({ page }) => {
        const bulkUpdatePage = new BulkUpdate(page);
        const locationListRevamp = new LocationListRevamp(page);

        await test.step(`And user is on the locations list page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'load' });
        });
        await test.step(`And user clicks the Bulk Update button and clicks the Bulk Editor button`, async () => {
            await bulkUpdatePage.bulkUpdateButton.click();
            await locationListRevamp.bulkEditorButton.click();
        });
        await test.step(`And user clicks + Add Location, selects the location, and clicks Next`, async () => {
            await bulkUpdatePage.clickAddLocationsButton();
            await bulkUpdatePage.selectBulkLocationSearch.fill("DM_BulkUpdate_Location -")
            await bulkUpdatePage.selectBulkLocation1Value(location1).click()
            await bulkUpdatePage.selectBulkLocation2Value(location2).click()
            await bulkUpdatePage.clickSelectButton()
            //await bulkUpdatePage.clickNext(); --Removed this as this is causing a failure since it is not needed
        });
        await test.step(`And user updates basic data page and user validates data is correct in confirmation page and clicks Save changes button`, async () => {
            await bulkUpdatePage.updateOpeningHours();
            await bulkUpdatePage.setSpecialOpeningHoursDate(); // Assuming this method exists
            await bulkUpdatePage.selectDate.click()
            await bulkUpdatePage.clickNext();
            await bulkUpdatePage.validateChanges('Mon - Sun: 09:00-18:00')
            await bulkUpdatePage.validateSpecialChanges('Special Opening Hours');
            await expect(bulkUpdatePage.locationNameCell(location1)).toBeVisible()
            await expect(bulkUpdatePage.locationNameCell(location2)).toBeVisible()
            await bulkUpdatePage.clickSaveChanges();
        });
        await test.step('Then the basic data update flow succeeds', async () => {
            await expect(bulkUpdatePage.successMessageUpdate).toBeVisible();
        });
    });
    test.afterEach("Reset Basic Data values to default", async ({ page }) => {

        await test.step(`Restore location opening hours, short and long descriptions and imprint to default value`, async () => {
            const apiUtils = new BaseCall()
            const userToken = await apiUtils.getAccessToken(dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
            const location1ID = dataManagementConfig.DM_LOCATION1_PHOTOS_AND_VIDEOS
            const location2ID = dataManagementConfig.DM_LOCATION2_PHOTOS_AND_VIDEOS

            let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/x-www-form-urlencoded', "")
            //modifying the location's working hours
            const payload = await createRequestBodyUtil.createHoursObject([1, 2, 3, 4, 5, 6, 7], "10:00", "18:00")

            //Adding special opening hours, short description, long description, and label to clear the fields from the previous executed test
            payload.set("specialOpeningHours", [
                {
                    "date": "2028-01-07",
                    "openingHours": [
                        {
                            "from": "10:00",
                            "to": "18:00",
                            "openingType": "OPEN"
                        }
                    ]
                }
            ]);
            payload.set("openingHoursNotes", "Updated Opening Hours Notes via Automation - AfterEach")
            payload.set("descriptionShort", "Updated Short Description via automation for override method - After all method")
            payload.set("descriptionLong", "Updated Long Description via automation for override method - After all method")
            payload.set("imprint", "Updated Imprint via automation - AfterEach")
            payload.set("labels", [
                {
                    name: "automation_default_label_1",
                    adminOnly: true,
                },
                {
                    name: "automation_default_label_2",
                    adminOnly: true,
                }
            ]);

            const requestBody = await createRequestBodyUtil.createBody(payload)

            //Executing the update on uberall side
            Response = await apiUtils.patchRequest(apiContext, `/api/locations/${location1ID}?access_token=${userToken}`, requestBody)
            Response = await apiUtils.patchRequest(apiContext, `/api/locations/${location2ID}?access_token=${userToken}`, requestBody)

            await page.close();  // Close the browser after all tests are finished
        });
    });
});