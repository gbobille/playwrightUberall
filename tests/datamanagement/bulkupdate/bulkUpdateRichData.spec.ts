import { test, expect, Page } from '@playwright/test';
import { loginUberallAppAs } from "../../../utils/login-util";
import LocationListRevamp from "../../../pages/datamanagement/locationListRevamp";
import BulkUpdate from "../../../pages/datamanagement/bulkUpdatePage";
import { dataManagementConfig } from "../dataManagement.config";
import BaseCall from '../../../api/uberall/baseCall';
import createRequestBodyUtil from '../../../api/uberall/utils/create-request-body-util';

const location1 = 'DM_BulkUpdate_Location - I'
const location2 = 'DM_BulkUpdate_Location II'


test.describe('Bulk Update Rich Data', { tag: '@dm_regression' }, () => {
    test.beforeEach("Given admin user successfully logs in", async ({ page }) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    });
    test('Bulk Update Rich Data Page - Overwrite', async ({ page }: { page: Page }) => {
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
            await bulkUpdatePage.clickAddLocationsButton()
            await bulkUpdatePage.selectBulkLocationSearch.fill("DM_BulkUpdate_Location -")
            await bulkUpdatePage.selectBulkLocation1Value(location1).click()
            await bulkUpdatePage.selectBulkLocation2Value(location2).click()
            await bulkUpdatePage.clickSelectButton()
            //await bulkUpdatePage.clickNext()
        })
        await test.step(`And user updates the rich data page`, async () => {
            await bulkUpdatePage.clickRichDataTab();
            await bulkUpdatePage.setSocialProfiles('FACEBOOK', 'https://www.facebook.com/zuck/');
            await bulkUpdatePage.setSocialProfiles('LINKEDIN', 'https://www.linkedin.com/company/boca-rosa-company');
            await bulkUpdatePage.setSocialProfiles('YOUTUBE', 'https://www.youtube.com/@souljazzmusic28');
            await bulkUpdatePage.setSocialProfiles('TWITTER', 'https://twitter.com/elonmusk');
            await bulkUpdatePage.setAttributes();
            await bulkUpdatePage.clickNext();
        })
        await test.step(`And user validates data is correct in confirmation page and clicks Save changes button`, async () => {
            await bulkUpdatePage.validateChanges('Appointment links: https://www.appointment.com');
            await expect(bulkUpdatePage.locationNameCell(location1)).toBeVisible()
            await expect(bulkUpdatePage.locationNameCell(location2)).toBeVisible()
            await bulkUpdatePage.clickSaveChanges();
        })
        await test.step(`And user validates the success message`, async () => {
            await expect(bulkUpdatePage.successMessageUpdate).toBeVisible();
        })
    })
    test.afterEach("Reset Rich Data values to default", async ({ page }) => {
        await test.step("Restore location social profiles, attributes to default value", async () => {
            const apiUtils = new BaseCall();
            const userToken = await apiUtils.getAccessToken(
                dataManagementConfig.ADMIN_USERNAME,
                process.env.ADMIN_PASSWORD
            );

            const location1ID = dataManagementConfig.DM_LOCATION1_PHOTOS_AND_VIDEOS;
            const location2ID = dataManagementConfig.DM_LOCATION2_PHOTOS_AND_VIDEOS;

            // Update content type to JSON
            let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, "application/json", "");

            // Confirm body is JSON
            const requestBody = JSON.stringify({
                socialProfiles: [
                    { type: "YOUTUBE", url: "https://www.youtube.com/watch" },
                    { type: "FACEBOOK", url: "https://www.facebook.com/buzzfeedtasty/" },
                    { type: "LINKEDIN", url: "https://linkedin.com/company/uberall-gmbh" },
                    { type: "TWITTER", url: "https://twitter.com/IMAX" }
                ],
                attributes: [
                    {
                        externalId: "url_appointment", // This may be required!
                        displayName: "Appointment links",
                        valueType: "URL",
                        value: "https://www.appointment.com/blog"
                    }
                ]
            });

            //Executing the update on uberall side
            Response = await apiUtils.patchRequest(apiContext, `/api/locations/${location1ID}?access_token=${userToken}`, requestBody)
            Response = await apiUtils.patchRequest(apiContext, `/api/locations/${location2ID}?access_token=${userToken}`, requestBody)

            await page.close(); // Close the browser after all tests are finished
        });
    });

})
