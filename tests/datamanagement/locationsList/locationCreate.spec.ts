import { expect, test } from "@playwright/test";
import LocationListRevamp from "../../../pages/datamanagement/locationListRevamp";
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig } from "../dataManagement.config";
import BasicData from "../../../pages/datamanagement/singleLocationProfile/basicDataPage";
import getIDFromURL from "../../../utils/getIdFromURL-util";
import BaseCall from "../../../api/uberall/baseCall";

let locationID = null;

test.describe(`Location Create - Verify user can create a new location from the Location List`, { tag: '@location_create, @dm_regression' }, () => {
    
    test(`Verify user can create a location manually`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp(page)
        const basicData = new BasicData(page)

        await test.step(`Given user logs in to the app and navigates to a location`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user clicks the Manual button`, async () => {
            await locationListRevamp.addLocationButton.click()
            await locationListRevamp.manualButton.click()
        })

        await test.step(`And user fills out the location data`, async () => {
            await basicData.fillBasicData()
        })

        await test.step(`And user saves the changes and creates a new location`, async () => {
            await basicData.saveButton.click()
            await basicData.buyNow.click()
        })

        await test.step(`Then user validates the location was created`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations?query=DM_DOCTOR_LOCATION_AUTOMATED`, { waitUntil: 'domcontentloaded' });
            await expect(locationListRevamp.locationByText('DM_DOCTOR_LOCATION_AUTOMATED')).toBeVisible()
            await locationListRevamp.locationByText('DM_DOCTOR_LOCATION_AUTOMATED').click()
            var location = await getIDFromURL.getLocationIDFromURL(page)
            locationID = parseInt(location.toString())
        })
    })

    test.afterEach(async () => {
        const apiUtils = new BaseCall()
        const userToken = await apiUtils.getAccessToken(dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/x-www-form-urlencoded', "")

        //Change location status
        const requestBodyJSON = {
            "status": "INACTIVE",
            "temporarilyClosed": {
                "temporarilyClosed": false
            }
        }
        const requestBody = JSON.stringify(requestBodyJSON)
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        //Update location status to INACTIVE
        await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)

        //Delete location
        await apiUtils.deleteRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`)
        locationID = null;
    })
})

