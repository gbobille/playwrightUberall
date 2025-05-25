import { expect, test } from "@playwright/test";
import { loginGeodesyAppAs } from "../../utils/login-util";
import { cleansingConfig } from "./cleansing.config";
import CleansingDashboard from "../../pages/cleansing/cln-dashboard";
import BaseCall from "../../api/uberall/baseCall";
import createRequestBodyUtil from "../../api/uberall/utils/create-request-body-util";
import CleansingDataManagement from "../../pages/cleansing/cln-datamanagement";
import CleansingPois from "../../pages/cleansing/cln-pois";
import CleansingPortal from "../../pages/cleansing/cln-cleansingportal";
import CreateRandomString from "../../utils/createRandomString-util";
const locationID = cleansingConfig.UBERALL_GEODESY_LOCATION_ID_NAME
const locationName = 'Geodesy Location Automation - Name Updated '
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

const headers = {
    "cookie": process.env.COOKIE,
    "Content-Type": "application/x-www-form-urlencoded"
}
const customHeaders = {
    "cookie": process.env.COOKIE
};

test.skip("Location Cleansing", { tag: ['@cln_regression_chrome', '@location_cleansing'] }, () => { 
    const apiUtils = new BaseCall();

    test(`Verify it is possible to cleanse a location's name manually`, async ({ page }) => {
        test.setTimeout(180000)
        const dashboardPage = new CleansingDashboard (page);
        const dataManagementPage = new CleansingDataManagement (page);
        const poisPage = new CleansingPois(page);
        const cleansingPortal = new CleansingPortal(page);

        await test.step(`Given a location with cleansing status CLEANSING PENDING exists`, async () => {
            const userToken = await apiUtils.getAccessToken(cleansingConfig.SP_348_USER, process.env.GEODESY_USERS_PASSWORD)
            const randomStringSuffix = await CreateRandomString.generateRandomString(5);
            const locationUpdate = locationName+randomStringSuffix
            const requestBody = await createRequestBodyUtil.createBody(crateUpdateLocationBody(locationUpdate, locationUpdate))
            let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)

            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)

            await page.setExtraHTTPHeaders(customHeaders);
            await page.goto(`${process.env.BASE_URL}/en/admin/location/show/${locationID}`, { waitUntil: 'domcontentloaded' })
            await expect(page.getByText('Cleansing StatusPENDING')).toBeVisible()
        });

        await test.step(`And user has successfully logged in to the Geodesy platform`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_ADMIN_USERNAME, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('data-management/pois') 
        });

        await test.step(`And user accessed to the location that was modified`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/data-management/pois`, { waitUntil: 'domcontentloaded' })
            await dataManagementPage.searchForLocation('Search', locationID)
            await dataManagementPage.singleLocationFromList(locationID).first().click()
        });

        await test.step(`And user verified the status is pending re cleansing`, async () => {
            await expect(poisPage.locationStatus('PENDING_RECLEANSING')).toBeVisible()
        });

        await test.step(`When user cleanses the location`, async () => {
            await expect(poisPage.cleanseButton).toBeVisible()
            await poisPage.cleanseButton.click();
            await poisPage.cleansingReasonButton.click();
            await poisPage.openClnPanelButton.click();
            expect(cleansingPortal.originalDetailsField(locationName).isVisible()).toBeTruthy()
            expect(cleansingPortal.cleansedDetailsField(locationName).isVisible()).toBeTruthy()
            await expect(cleansingPortal.mapLabel).toBeVisible()
            await delay(5000)
            await expect(cleansingPortal.saveButton).toBeVisible()
            await cleansingPortal.saveButton.click();
        });

        /*
        await test.step(`Then POI's status is properly updated`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/data-management/pois`, { waitUntil: 'networkidle' })
            await expect(dataManagementPage.mainFilter('Search')).toBeVisible()
            await dataManagementPage.searchForLocation('Search', locationID);
            await dataManagementPage.singleLocationFromList(locationID).first().click();
            expect(poisPage.locationStatus('CLEANSED').isVisible()).toBeTruthy();
        });
        */

        await test.step(`And the uberall location's cleansing status is properly updated on the ABE`, async () => {
            await page.setExtraHTTPHeaders(customHeaders);
            await page.goto(`${process.env.BASE_URL}/en/admin/location/show/${locationID}`, {waitUntil:'domcontentloaded', timeout:90000})
            
            //In case the cleansed notification doesn't get to uberall, execute the cleanse manually
            if (await page.getByText('Cleansing StatusCLEANSED').isVisible() == false) {
                await page.locator('button[name="cleanse"]').click()
            }
            await expect(page.getByText('Cleansing StatusCLEANSED')).toBeVisible()
        });
    });

    test.afterEach(async () => {
        await test.step(`Restore location opening date to default value`, async () => {
            const userToken = await apiUtils.getAccessToken(cleansingConfig.SP_348_USER, process.env.GEODESY_USERS_PASSWORD)
            const locationUpdate = "Geodesy Location Automation - After Each Method"
            const requestBody = await createRequestBodyUtil.createBody(crateUpdateLocationBody(locationUpdate, locationUpdate))
            const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)
        })
    });
});

function crateUpdateLocationBody (locationName:string, locationIdentifier:string) {
    const locationBody = new Map<string, string>();
    locationBody.set("name", locationName)
    locationBody.set("identifier", locationIdentifier)
    return locationBody
}