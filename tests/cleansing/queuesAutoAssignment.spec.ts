import { expect, test } from "@playwright/test";
import { loginGeodesyAppAs } from "../../utils/login-util";
import { cleansingConfig } from "./cleansing.config";
import CleansingDashboard from "../../pages/cleansing/cln-dashboard";
import BaseCall from "../../api/uberall/baseCall";
import createRequestBodyUtil from "../../api/uberall/utils/create-request-body-util";
import CleansingPortal from "../../pages/cleansing/cln-cleansingportal";
import CleansingList from "../../pages/cleansing/cln-cleansinglist";
import CreateRandomString from "../../utils/createRandomString-util";
import { validateCleansingStatus } from "../../utils/abe-cleansingStatusValidation-util";
const LocationID_CC_HPSP_China = cleansingConfig.UBERALL_LOCATION_CHINA_HPSP;
const LocationID_CC_HPSP_Japan = cleansingConfig.UBERALL_LOCATION_JAPAN_HPSP;
const LocationID_NonCC_HPSP_DE = cleansingConfig.UBERALL_LOCATION_DE_HPSP;
const locationID_NonCC_HPSP_US = cleansingConfig.UBERALL_LOCATION_US_HPSP
const locationID_CC_NonHPSP_China = cleansingConfig.UBERALL_LOCATION_CHINA_NOT_HPSP;
const locationID_CC_NonHPSP_Japan = cleansingConfig.UBERALL_LOCATION_JAPAN_NOT_HPSP;
const locationID_NonCC_NonHPSP_FR = cleansingConfig.UBERALL_LOCATION_FR_NOT_HPSP
const locationID_NonCC_NonHPSP_US = cleansingConfig.UBERALL_LOCATION_US_NOT_HPSP
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

const headers = {
    "cookie": process.env.COOKIE,
    "Content-Type": "application/x-www-form-urlencoded"
}
const customHeaders = {
    "cookie": process.env.COOKIE
};
const apiUtils = new BaseCall();

test.describe("Complex Countries and HP SPs Queues Assignment", { tag: ['@cln_regression', '@automatic_queues_assignment']}, () => { 
    [
        { uberallUser:cleansingConfig.SP_696_USER, locationName:"China Based - HP SP ", locationID:LocationID_CC_HPSP_China, geodesyUser:cleansingConfig.GEODESY_CLEANSER_COMPLEX_COUNTRIES},
        { uberallUser:cleansingConfig.SP_696_USER, locationName:"Japan Based - HP SP ", locationID:LocationID_CC_HPSP_Japan, geodesyUser:cleansingConfig.GEODESY_CLEANSER_COMPLEX_COUNTRIES},
        { uberallUser:cleansingConfig.SP_348_USER, locationName:"DE Based - HP SP ", locationID:LocationID_NonCC_HPSP_DE, geodesyUser:cleansingConfig.GEDOESY_CLEANSER_HP_SP},
        { uberallUser:cleansingConfig.SP_348_USER, locationName:"US Based - HP SP ", locationID:locationID_NonCC_HPSP_US, geodesyUser:cleansingConfig.GEDOESY_CLEANSER_HP_SP},
        { uberallUser:cleansingConfig.SP_260_USER, locationName:"China Based - NOT HP SP ", locationID:locationID_CC_NonHPSP_China, geodesyUser:cleansingConfig.GEODESY_CLEANSER_COMPLEX_COUNTRIES},
        { uberallUser:cleansingConfig.SP_390_USER, locationName:"Japan Based - NOT HP SP ", locationID:locationID_CC_NonHPSP_Japan, geodesyUser:cleansingConfig.GEODESY_CLEANSER_COMPLEX_COUNTRIES},
        //{ uberallUser:cleansingConfig.SP_2_USER, locationName:"FR Based - NOT HP SP ", locationID:locationID_NonCC_NonHPSP_FR, geodesyUser:cleansingConfig.GEODESY_LEAD_CLEANSER},
        //{ uberallUser:cleansingConfig.SP_2_USER, locationName:"US Based - NOT HP SP ", locationID:locationID_NonCC_NonHPSP_US, geodesyUser:cleansingConfig.GEODESY_LEAD_CLEANSER}
    ].forEach(({uberallUser, locationName, locationID, geodesyUser}) => {
        test(`Verify it is possible to see a ${locationName} location on the complex countries list`, async ({ page }) => {
            const dashboardPage = new CleansingDashboard (page);
            const cleansingList = new CleansingList (page);
            const cleansingPortal = new CleansingPortal(page);
            const randomStringSuffix = await CreateRandomString.generateRandomString(5);
            const locationUpdate = locationName+randomStringSuffix

            const userToken = await apiUtils.getAccessToken(uberallUser, process.env.GEODESY_USERS_PASSWORD)
            let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
    
            await test.step(`Given a location based on China with cleansing status CLEANSING PENDING exists`, async () => {
                const requestBody = await createRequestBodyUtil.createBody(crateUpdateLocationBody(locationUpdate, locationUpdate))
                await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)
                apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
                await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)
            });
    
            await test.step(`When a Complex Countries user has successfully logged in to the Geodesy platform`, async () => {
                await delay(5000)
                await loginGeodesyAppAs(page, geodesyUser, process.env.GEODESY_USERS_PASSWORD)
                await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list') 
            });
    
            await test.step(`And user proceeds do the cleansing queue`, async () => {
                await page.goto(`${process.env.GEODESY_BASE_URL}/cleansing-portal/cleansing/list`, { waitUntil: 'networkidle' })
            });
    
            await test.step(`And selects the option to start handling`, async () => {
                await cleansingList.startHandlingButton.click()
            });
            
            await test.step(`Then user sees the first location to appear is the complex countries location`, async () => {
                await cleansingPortal.cleanseCase(locationUpdate)
            });
    
            await test.step(`And the uberall location's cleansing status is properly updated on the ABE`, async () => {
                const result = await validateCleansingStatus(page, customHeaders, locationID)
                await delay(5000)
                expect(result).toBeTruthy()
            });
        });
    });
});

function crateUpdateLocationBody (locationName:string, locationIdentifier:string) {
    const locationBody = new Map<string, string>();
    locationBody.set("name", locationName)
    locationBody.set("identifier", locationIdentifier)
    return locationBody
}