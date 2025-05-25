 import { APIRequestContext, APIResponse, expect, test } from "@playwright/test";
import BaseCall from "../../../../api/uberall/baseCall";
import { listingsConfig } from "../../../listings/listings.config";
import createRequestBodyUtil from "../../../../api/uberall/utils/create-request-body-util";

const locationID = listingsConfig.LIS_LOCATION_GOOGLE_PUBLISHING;
const googleListingID = listingsConfig.GOOGLE_LISTINGS_GOOGLE_PUBLISHING;
let userToken = "";
let apiContext: APIRequestContext;
let response: APIResponse;
const apiUtils = new BaseCall()
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))
const headers = {
    "cookie": process.env.COOKIE as string,
    "Content-Type": "application/x-www-form-urlencoded"
}

//Content Collection Parameters
const payload = new Map<any, any>()

test.describe.configure({ mode: 'serial' });

test.describe("Google Publishing Tests - Special Opening Hours", { tag: '@Publishing'}, ()=> {
    
    test(`Verify it is possible to publish special opening hours`, async ({page}) => {
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });
    
        await test.step(`And user sends the request to update a location to be CLOSED on Dec 24th as special opening hours`, async () => {
            const payload = await createRequestBodyUtil.createSpecialOpeningHoursObject("2025-12-25", "", "", "", "", true)
            const requestBody = await createRequestBodyUtil.createBody(payload)
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)
        });

        await test.step(`And user clears the update history`, async () => {
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)
        });
        
        await test.step(`When user syncs the listing`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')
        });

        await test.step(`And user pushes the update`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
        });

        await test.step(`Then the listing's special working hours have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const periods = directoryResponse.specialHours.specialHourPeriods
            periods.forEach((workingPeriod:any) => {
                expect(workingPeriod.endDate.month).toEqual(12)
                expect(workingPeriod.endDate.year).toEqual(2025)
                expect(workingPeriod.endDate.day).toEqual(25)
                expect(workingPeriod.startDate.month).toEqual(12)
                expect(workingPeriod.startDate.year).toEqual(2025)
                expect(workingPeriod.startDate.day).toEqual(25)
                expect(workingPeriod.closed).toEqual(true)
            });
        });        
    });

    test(`Verify it is possible to publish special opening hours - OPEN multiple intervals`, async ({page}) => {

        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });
    
        await test.step(`And user sends the request to update a location to be OPEN on June 23rd as special opening hours`, async () => {
            const payload = await createRequestBodyUtil.createSpecialOpeningHoursObject("2025-06-23", "08:30", "12:30", "17:45", "21:45", false)
            const requestBody = await createRequestBodyUtil.createBody(payload)
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)
        });

        await test.step(`And user clears the update history`, async () => {
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)
        });
        
        await test.step(`When user syncs the listing`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')
        });

        await test.step(`And user pushes the update`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
        });

        await test.step(`Then the listing's special working hours have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const periods = directoryResponse.specialHours.specialHourPeriods
            periods.forEach((workingPeriod:any) => {
                expect(workingPeriod.endDate.month).toEqual(6)
                expect(workingPeriod.endDate.year).toEqual(2025)
                expect(workingPeriod.endDate.day).toEqual(23)
            });
            const expectedHours = [
                { from: "8", to: "12" },
                { from: "17", to: "21" }
            ]
            const expectedMinutes = [
                { from: "30", to: "30" },
                { from: "45", to: "45" }
            ]
            periods.forEach((workingPeriod:any, index:any) => {
                const expectedHr = expectedHours[index];
                expect(workingPeriod.closeTime.hours).toEqual(Number(expectedHr.to))
                expect(workingPeriod.openTime.hours).toEqual(Number(expectedHr.from))
            });

            periods.forEach((workingPeriod:any, index:any) => {
                const expectedMin = expectedMinutes[index];
                expect(workingPeriod.closeTime.minutes).toEqual(Number(expectedMin.to))
                expect(workingPeriod.openTime.minutes).toEqual(Number(expectedMin.from))
            });
        });        
    });

});

//reset global variables
test.afterEach(async () => {
    await test.step(`Restore the global variables`, async () => {
        payload.clear()
    });
});

test.afterAll(async () => {
    await test.step(`Restore location opening date to default value`, async () => {
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
        
        //modifying the location's special opening hours
        const payload = await createRequestBodyUtil.createSpecialOpeningHoursObject("2025-11-11", "", "", "", "", true)
        const requestBody = await createRequestBodyUtil.createBody(payload)
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
        response = await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)
        
        //Executing the update on uberall side
        response = await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)

        //creating new api context object as it needs the headers
        apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
        response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)

        //syncing the listingßß
        await delay(5000)
        response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')

        //publishing the data
        await delay(5000)
        response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
    });
});