 
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

test.describe("Google Publishing Tests - Past Opening Date", { tag: '@Publishing' }, () => { 

    test(`Verify it is possible to publish an opening date from the past`, async ({page}) => {
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });
        
        await test.step(`And user sends the request to update a location with a past date for the opening date`, async () => {
            const payload = new Map<any, any>()
            payload.set("openingDate", "2021-05-05")
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

        await test.step(`Then the listing's opening date has been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            expect(directoryResponse.openInfo.openingDate.month).toEqual(5)
            expect(directoryResponse.openInfo.openingDate.year).toEqual(2021)
            expect(directoryResponse.openInfo.openingDate.day).toEqual(5)
        });
    });
});

test.afterAll(async () => {
    await test.step(`Restore location opening date to default value`, async () => {
        payload.clear()
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        //Adding opening date to clear that field from the previous executed test
        payload.set("openingDate", "2024-09-09")
        const requestBody = await createRequestBodyUtil.createBody(payload)
        
        //Executing the update on uberall side
        response = await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)

        //creating new api context object as it needs the headers
        apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
        response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)

        //syncing the listing
        await delay(5000)
        response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')

        //publishing the data
        await delay(5000)
        response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
    });
});