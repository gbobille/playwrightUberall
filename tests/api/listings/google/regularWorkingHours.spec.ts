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

test.describe("Google Publishing Tests - Regular Working Hours", {tag: '@Publishing'}, () => {
    test(`Verify it is possible to publish working hours for MON-SUN from1:"09:00", to1:"13:00", from2:"17:00", to2:"20:00"`, async({page}) => {

        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });
    
        await test.step(`And user sends the request to update a location from1:"09:00", to1:"13:00", from2:"17:00", to2:"20:00" time shift for regular working hours`, async () => {
            const payload = await createRequestBodyUtil.createHoursObject([1,2,3,4,5,6,7], "09:00", "13:00", "17:00", "20:00")
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

        await test.step(`Then the listing's regular working hours have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const periods = directoryResponse.regularHours.periods
            const expectedTimes = [
                { from: "09", to: "13" },
                { from: "17", to: "20" }
            ]
            periods.forEach((workingPeriod:any, index:any) => {
                expect(workingPeriod.closeDay).toEqual(dayOfWeekAsInteger_DualHours(index))
                const expected = expectedTimes[index % 2];
                expect(workingPeriod.openTime).toEqual({ "hours": Number(expected.from) })
                expect(workingPeriod.closeTime).toEqual({ "hours": Number(expected.to) })
            });
        });      
    });

    test(`Verify it is possible to publish working hours for MON-SUN from1:"00:00", to1:"24:00"`, async({page}) => {
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });
    
        await test.step(`And user sends the request to update a location 00:00 to 24:00 time shift for regular working hours`, async () => {
            const payload = await createRequestBodyUtil.createHoursObject([1,2,3,4,5,6,7], "00:00", "24:00")
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

        await test.step(`Then the listing's regular working hours have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const periods = directoryResponse.regularHours.periods
            periods.forEach((workingPeriod:any, index:any) => {
                expect(workingPeriod.closeDay).toEqual(dayOfWeekAsInteger(index))
                expect(workingPeriod.openTime).toEqual({})
                expect(workingPeriod.closeTime).toEqual({"hours": Number("24".slice(0,2))})
            });
        });      
    });

    test(`Verify it is possible to publish working hours for MON-SUN from1:"09:00", to1:"21:00"`, async({page}) => {
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });
    
        await test.step(`And user sends the request to update a location from1:"09:00", to1:"21:00" time shift for regular working hours`, async () => {
            const payload = await createRequestBodyUtil.createHoursObject([1,2,3,4,5,6,7], "09:00", "21:00")
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
        
        await test.step(`Then the listing's regular working hours have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const periods = directoryResponse.regularHours.periods
            periods.forEach((workingPeriod:any, index:any) => {
                expect(workingPeriod.closeDay).toEqual(dayOfWeekAsInteger(index))
                expect(workingPeriod.openTime).toEqual({"hours": Number("09".slice(0,2))})
                expect(workingPeriod.closeTime).toEqual({"hours": Number("21".slice(0,2))})
            });
        });      
    });

    test(`Verify it is possible to publish working hours for MON-FRI from1:"08:00", to1:"07:00"`, async({page}) => {
        
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });
    
        await test.step(`And user sends the request to update a location from1:"08:00", to1:"07:00" time shift for regular working hours`, async () => {
            const payload = await createRequestBodyUtil.createHoursObject([1,2,3,4,5], "08:00", "07:00")
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
        
        await test.step(`Then the listing's regular working hours have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const periods = directoryResponse.regularHours.periods
            const expectedTimes = [
                { from: "08", to: "24" },
                { from: null, to: "07" }
            ];
            periods.forEach((workingPeriod:any, index:any) => {
                const expected = expectedTimes[index % 2];
                const openTime = expected.from ? { "hours": Number(expected.from) } : {};
                const closeTime = { "hours": Number(expected.to) };
                expect(workingPeriod.closeDay).toEqual(dayOfWeekAsInteger_MCDonaldsCase(index));
                expect(workingPeriod.openTime).toEqual(openTime);
                expect(workingPeriod.closeTime).toEqual(closeTime);
            });
        });      
    });
}); 
 
function dayOfWeekAsInteger(day:any) {
    return ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].at(day);
}

function dayOfWeekAsInteger_DualHours(day:any) {
    return ["SUNDAY", "SUNDAY", "MONDAY", "MONDAY", "TUESDAY", "TUESDAY", "WEDNESDAY", "WEDNESDAY", "THURSDAY", "THURSDAY", "FRIDAY", "FRIDAY", "SATURDAY", "SATURDAY"].at(day);
}

function dayOfWeekAsInteger_MCDonaldsCase(day:any) {
    return ["MONDAY", "TUESDAY", "TUESDAY", "WEDNESDAY", "WEDNESDAY", "THURSDAY", "THURSDAY", "FRIDAY", "FRIDAY", "SATURDAY"].at(day);
}

//reset global variables
test.afterEach(async () => {
    await test.step(`Restore the global variables`, async () => {
        payload.clear()
    });
});

test.afterAll(async () => {
    await test.step(`Restore location opening date to default value`, async () => {
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
        //modifying the location's working hours
        const payload = await createRequestBodyUtil.createHoursObject([1,2,3,4,5,6,7], "09:00", "21:00")
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