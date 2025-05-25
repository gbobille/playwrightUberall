import { expect, test } from "@playwright/test";
import { loginGeodesyAppAs } from "../../utils/login-util";
import { cleansingConfig } from "./cleansing.config";
import CleansingDashboard from "../../pages/cleansing/cln-dashboard";
import BaseCall from "../../api/uberall/baseCall";
import createRequestBodyUtil from "../../api/uberall/utils/create-request-body-util";
import TaskManagement from "../../pages/cleansing/cln-taskmanagement";
import CleansingList from "../../pages/cleansing/cln-cleansinglist";
import CreateRandomString from "../../utils/createRandomString-util";
import CleansingPortal from "../../pages/cleansing/cln-cleansingportal";
import CleansingPois from "../../pages/cleansing/cln-pois";
const LocationID_TaskManager_US = cleansingConfig.UBERALL_LOCATION_US_TASKMANAGEMENT;
const LocationID_TaskManager_PoiFilter_1 = cleansingConfig.UBERALL_LOCATION_TH_TASKMANAGEMENT_POIFILTER_1
const LocationID_TaskManager_PoiFilter_2 = cleansingConfig.UBERALL_LOCATION_PH_TASKMANAGEMENT_POIFILTER_2
const LocationID_TaskManager_Unassign = cleansingConfig.UBERALL_LOCATION_UNASSIGN_TASK
const LocationID_TaskManager_Invalidate = cleansingConfig.UBERALL_LOCATION_INVALIDATE_TASK
const LocationID_TaskManager_RemoveFromQueue = cleansingConfig.UBERALL_LOCATION_REMOVE_FROM_QUEUE
const uberallUser_sp348 = cleansingConfig.SP_348_USER
const uberallUser_sp696 = cleansingConfig.SP_696_USER
const geodesyAdminUser = cleansingConfig.GEODESY_ADMIN_USERNAME
const geodesyGeneral = cleansingConfig.GEODESY_CLEANSER_GENERAL
const geodesyCCUser = cleansingConfig.GEODESY_CC_REMOVE_FROM_QUEUE
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))
import { validateCleansingStatus } from "../../utils/abe-cleansingStatusValidation-util"
import CleansingDataManagement from "../../pages/cleansing/cln-datamanagement";

const headers = {
    "cookie": process.env.COOKIE,
    "Content-Type": "application/x-www-form-urlencoded"
}
const customHeaders = {
    "cookie": process.env.COOKIE
};
const apiUtils = new BaseCall();


test.describe("Task Management", () => { 

    test(`Verify it is possible to create and execute an "Assign and push to top" task via source Location ID`, { tag: ['@cln_regression', '@task_management']}, async ({ page }) => {
        test.setTimeout(240000)
        const dashboardPage = new CleansingDashboard (page);
        const cleansingList = new CleansingList(page)
        const taskManagement = new TaskManagement(page);
        const cleansingPortal = new CleansingPortal(page);
        const randomStringSuffix = await CreateRandomString.generateRandomString(5);
        const nameUpdated = "Push to Top and Assing Task "+randomStringSuffix
        const identifierUpdated = "Push to Top and Assing Task "+randomStringSuffix

        const userToken = await apiUtils.getAccessToken(uberallUser_sp348, process.env.GEODESY_USERS_PASSWORD)
        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        await test.step(`Given a location has been modified on uberall platform`, async () => {
            const requestBody = await createRequestBodyUtil.createBody(crateUpdateLocationBody(nameUpdated, identifierUpdated))
            await apiUtils.patchRequest(apiContext, `/api/locations/${LocationID_TaskManager_US}?access_token=${userToken}`, requestBody)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${LocationID_TaskManager_US}`)
        });

        await delay(30000)

        await test.step(`And a task to assign the location to GENERAL user already finished and was created by ADMIN user`, async () => {
            await loginGeodesyAppAs(page, geodesyAdminUser, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list') 
            await page.goto(`${process.env.GEODESY_BASE_URL}/task-management/executor/batches`, { waitUntil: 'networkidle' })
            await taskManagement.createTask_Step1('Type', 'Push To Top And Assign', 'Source', 'Location Id List')
            await taskManagement.locationListIds.fill(LocationID_TaskManager_US)
            await taskManagement.nextButton('2Paste location ids').click()
            await taskManagement.assigneesList.click()
            await taskManagement.assigneesList.fill('Automation_Cleanser_General')
            await taskManagement.listSelectedOption('Automation_Cleanser_General').click()
            await taskManagement.nextButton('3Select size and assignees').click()
            await taskManagement.initiateButton('4Overview').click({delay:5000})
            await dashboardPage.userProfileButton.click()
            await dashboardPage.logOutButton.click()
        });

        await delay(10000)

        await test.step(`When GENERAL user from prev step logs in to the application`, async () => {
            await loginGeodesyAppAs(page, geodesyGeneral, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list')
        });

        await test.step(`And GENERAL user accesses to the cleansing list`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/cleansing-portal/cleansing/list`, { waitUntil: 'networkidle' })
        });

        await test.step(`And GENERAL user sees the location assigned to it`, async () => {
            await expect (cleansingList.locationListDisplayName(nameUpdated).first()).toBeVisible()
        });

        await test.step(`And GENERAL user selects the location to cleanse it`, async () => {
            await cleansingList.locationListDisplayName(nameUpdated).first().click()
        });

        await test.step(`And user cleanses the location`, async () => {
            await expect(cleansingPortal.originalDetailsField(nameUpdated)).toBeVisible()
            await expect(cleansingPortal.cleansedDetailsField(nameUpdated)).toBeVisible()
            await cleansingPortal.saveButton.click();
        });

        await test.step(`Then the uberall location's cleansing status is properly updated on the ABE`, async () => {
            await page.setExtraHTTPHeaders(customHeaders);
            await page.goto(`${process.env.BASE_URL}/en/admin/location/show/${LocationID_TaskManager_US}`, {timeout:90000})
            
            //In case the cleansed notification doesn't get to uberall, execute the cleanse manually
            if (await page.getByText('Cleansing StatusCLEANSED').isVisible() == false) {
                await page.locator('button[name="cleanse"]').click()
            }
            await expect(page.getByText('Cleansing StatusCLEANSED')).toBeVisible()
        });

    });

    test(`Verify it is possible to create a "Push to top" task via source POI Filter`, { tag: ['@cln_regression_chrome', '@task_management']},async ({ page }) => {
        test.setTimeout(180000)
        const dashboardPage = new CleansingDashboard (page);
        const cleansingList = new CleansingList(page)
        const taskManagement = new TaskManagement(page);
        const cleansingPortal = new CleansingPortal(page);
        const randomStringSuffix = await CreateRandomString.generateRandomString(5);
        const nameUpdated_ph_location = "Task Mgr Automation - PH Location "+randomStringSuffix
        const nameUpdated_th_location = "Task Mgr Automation - TH Location "+randomStringSuffix
        const userToken = await apiUtils.getAccessToken(uberallUser_sp348, process.env.GEODESY_USERS_PASSWORD)
        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        await test.step(`Given a location has been modified on uberall platform`, async () => {
            const requestBody_ph = await createRequestBodyUtil.createBody(crateUpdateLocationBody(nameUpdated_ph_location, nameUpdated_ph_location))
            const requestBody_th = await createRequestBodyUtil.createBody(crateUpdateLocationBody(nameUpdated_th_location, nameUpdated_th_location))

            await apiUtils.patchRequest(apiContext, `/api/locations/${LocationID_TaskManager_PoiFilter_1}?access_token=${userToken}`, requestBody_th)
            await apiUtils.patchRequest(apiContext, `/api/locations/${LocationID_TaskManager_PoiFilter_2}?access_token=${userToken}`, requestBody_ph)
            
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${LocationID_TaskManager_PoiFilter_1}`)
            await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${LocationID_TaskManager_PoiFilter_2}`)
        });

        await test.step(`And a task to Push to Top is created by ADMIN user`, async () => {
            await loginGeodesyAppAs(page, geodesyAdminUser, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list') 
            await page.goto(`${process.env.GEODESY_BASE_URL}/task-management/executor/batches`, { waitUntil: 'networkidle' })
            await taskManagement.createTask_Step1('Type', 'Push To Top', 'Source', 'Poi Filter')
            await taskManagement.listSelected('Sales partner').click()
            await taskManagement.filterSearch.pressSequentially('Sales Partner 348', { delay: 200})
            await delay(5000)
            await taskManagement.listSelectedOption('Sales Partner 348').click()
            await page.keyboard.press('Escape', {delay:1000})
            await taskManagement.listSelected('Brands').click()
            await taskManagement.filterSearch.pressSequentially(nameUpdated_ph_location, { delay: 200})
            await delay(3000)
            await taskManagement.listSelectedOption(nameUpdated_ph_location).click()
            await page.keyboard.press('Escape',{delay:1000})
            await taskManagement.listSelected('Brands').click()
            await taskManagement.filterSearch.pressSequentially(nameUpdated_th_location, { delay: 200})
            await delay(3000)
            await taskManagement.listSelectedOption(nameUpdated_th_location).click()
            await page.keyboard.press('Escape',{delay:1000})
            await taskManagement.nextButton_filters('2Select filters').click()
            await taskManagement.nextButton('3Select sizeOptional').click()
            await taskManagement.initiateButton('4Overview').click({delay:3000})
        });

        await test.step(`And GENERAL user accesses to the cleansing list`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/cleansing-portal/cleansing/list`, { waitUntil: 'networkidle' })
        });

        await test.step(`And GENERAL user selects the option to start handling`, async () => {
            await cleansingList.startHandlingButton.click()
        });
        
        await test.step(`And GENERAL user sees both locations on the queue`, async () => {
            await cleansingPortal.cleanseCase(nameUpdated_ph_location, nameUpdated_th_location)
        });

        await test.step(`Then the PH based location's cleansing status is properly updated on the ABE`, async () => {
            const result = await validateCleansingStatus(page, customHeaders, LocationID_TaskManager_PoiFilter_1)
            expect(result).toBeTruthy()
        });

        await test.step(`And the TH based location's cleansing status is properly updated on the ABE`, async () => {
            const result = await validateCleansingStatus(page, customHeaders, LocationID_TaskManager_PoiFilter_2)
            expect(result).toBeTruthy()
        });
    });

    test(`Verify it is possible to "Unassign a queue item" task via source Location ID`, { tag: ['@cln_regression', '@task_management']}, async ({ page }) => {
        test.setTimeout(180000)
        const dashboardPage = new CleansingDashboard (page);
        const cleansingList = new CleansingList(page)
        const taskManagement = new TaskManagement(page);
        const randomStringSuffix = await CreateRandomString.generateRandomString(5);
        const nameUpdated = "Unassign Task "+randomStringSuffix
        const identifierUpdated = "Unassign Task "+randomStringSuffix

        const userToken = await apiUtils.getAccessToken(uberallUser_sp696, process.env.GEODESY_USERS_PASSWORD)
        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        await test.step(`Given a task to assign a location to GENERAL user has been created and executed`, async () => {
            const requestBody = await createRequestBodyUtil.createBody(crateUpdateLocationBody(nameUpdated, identifierUpdated))
            await apiUtils.patchRequest(apiContext, `/api/locations/${LocationID_TaskManager_Unassign}?access_token=${userToken}`, requestBody)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${LocationID_TaskManager_Unassign}`)

            await loginGeodesyAppAs(page, geodesyAdminUser, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list') 
            await page.goto(`${process.env.GEODESY_BASE_URL}/task-management/executor/batches`, { waitUntil: 'networkidle' })
            await taskManagement.createTask_Step1('Type', 'Push To Top And Assign', 'Source', 'Location Id List')
            await taskManagement.locationListIds.fill(LocationID_TaskManager_Unassign)
            await taskManagement.nextButton('2Paste location ids').click()
            await taskManagement.assigneesList.click()
            await taskManagement.assigneesList.fill('Automation_Cleanser_General')
            await taskManagement.listSelectedOption('Automation_Cleanser_General').click()
            await taskManagement.nextButton('3Select size and assignees').click()
            await taskManagement.initiateButton('4Overview').click({delay:2000})
            await delay(10000)
            await dashboardPage.userProfileButton.click()
            await dashboardPage.logOutButton.click()
        });

        await test.step(`And GENERAL user logs in to the application`, async () => {
            await loginGeodesyAppAs(page, geodesyGeneral, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list')
        });

        await test.step(`And GENERAL user accesses to the cleansing list`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/cleansing-portal/cleansing/list`, { waitUntil: 'networkidle' })
        });

        await test.step(`And GENERAL user sees the location assigned to it`, async () => {
            await expect (cleansingList.locationListDisplayName(nameUpdated).first()).toBeVisible()
        });

        await test.step(`And GENERAL user logs out`, async () => {
            await delay(5000)
            await dashboardPage.userProfileButton.click()
            await dashboardPage.logOutButton.click()
        });

        await test.step(`When ADMIN user logs back in to create a task to unassign the location from GENERAL user`, async () => {
            await loginGeodesyAppAs(page, geodesyAdminUser, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list') 
            await page.goto(`${process.env.GEODESY_BASE_URL}/task-management/executor/batches`, { waitUntil: 'networkidle' })
            await taskManagement.createTask_Step1('Type', 'Unassign Queue Item', 'Source', 'Location Id List')
            await taskManagement.locationListIds.fill(LocationID_TaskManager_Unassign)
            await taskManagement.nextButton('2Paste location ids').click({delay:3000})
            await taskManagement.initiateButton('3Overview').click()
            await delay(10000)
            await dashboardPage.userProfileButton.click()
            await dashboardPage.logOutButton.click()
        });

        await test.step(`And GENERAL user logs in to the application`, async () => {
            await loginGeodesyAppAs(page, geodesyGeneral, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list')
        });

        await test.step(`And GENERAL user accesses to the cleansing list`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/cleansing-portal/cleansing/list`, { waitUntil: 'networkidle' })
        });

        await test.step(`Then GENERAL user WONT SEE the location assigned to it`, async () => {
            await expect (cleansingList.locationListDisplayName(nameUpdated).first()).toBeHidden()
        });
    });

    test(`Verify it is possible to create an "Inactivate by POI ID" task via source POI ID`, { tag: ['@cln_regression_chrome', '@task_management']},async ({ page }) => {
        test.setTimeout(180000)
        const dashboardPage = new CleansingDashboard (page);
        const taskManagement = new TaskManagement(page);
        const poisPage = new CleansingPois(page);
        const dataManagementPage = new CleansingDataManagement (page);
        const cleansingPortal = new CleansingPortal(page);
        const randomStringSuffix = await CreateRandomString.generateRandomString(5);
        const nameUpdated = "Task Mgr Automation - Invalidate Case "+randomStringSuffix
        const userToken = await apiUtils.getAccessToken(uberallUser_sp348, process.env.GEODESY_USERS_PASSWORD)
        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
        let poiID = ""

        await test.step(`Given a location has been modified on uberall platform`, async () => {
            const requestBody = await createRequestBodyUtil.createBody(crateUpdateLocationBody(nameUpdated, nameUpdated))
            await apiUtils.patchRequest(apiContext, `/api/locations/${LocationID_TaskManager_Invalidate}?access_token=${userToken}`, requestBody)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${LocationID_TaskManager_Invalidate}`)
        });

        await test.step(`And user has successfully logged in to the Geodesy platform`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_ADMIN_USERNAME, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('data-management/pois') 
        });

        await test.step(`And user gets the POI ID`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/data-management/pois`, { waitUntil: 'domcontentloaded' })
            await dataManagementPage.searchForLocation('Search', LocationID_TaskManager_Invalidate)
            await dataManagementPage.singleLocationFromList(LocationID_TaskManager_Invalidate).first().click()
            await delay(5000)
            poiID = await poisPage.poiID.textContent()
            console.log(`POI ID: ${poiID}`)
        });

        await test.step(`When user creates and executes a task to INACTIVATE by POI ID`, async () => { 
            await page.goto(`${process.env.GEODESY_BASE_URL}/task-management/executor/batches`, { waitUntil: 'domcontentloaded' })
            await taskManagement.createTask_Step1('Type', 'Poi Inactivation', 'Source', 'Poi Id List')
            await taskManagement.poiIDList.fill(poiID)
            await taskManagement.nextButton('2Paste poi ids').click()
            await taskManagement.initiateButton('3Overview').click({delay:3000})
            await delay(5000)
        });

        await test.step(`Then POI ID is INACTIVE`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/data-management/pois`, { waitUntil: 'domcontentloaded' })
            await dataManagementPage.searchForLocation('Search', LocationID_TaskManager_Invalidate)
            await dataManagementPage.singleLocationFromList(LocationID_TaskManager_Invalidate).first().click()
            await delay(5000)
            await expect(poisPage.locationStatus('INACTIVE')).toBeVisible()
        });

        await test.step(`And user cleanses the location`, async () => {
            await poisPage.cleanseButton.click();
            await poisPage.cleansingReasonButton.click({delay:3000});
            await poisPage.openClnPanelButton.click({delay:3000});
            await expect(cleansingPortal.mapLabel).toBeVisible()
            await delay(5000)
            await expect(cleansingPortal.saveButton).toBeVisible()
            await cleansingPortal.saveButton.click();
        });  
    });

    test(`Verify it is possible to create a "Remove queue item" task via Location ID`, { tag: ['@cln_regression', '@task_management']}, async ({ page }) => {    
        test.setTimeout(240000)
        const dashboardPage = new CleansingDashboard (page);
        const cleansingList = new CleansingList(page)
        const taskManagement = new TaskManagement(page);
        const cleansingPortal = new CleansingPortal(page);
        const poisPage = new CleansingPois(page);
        const dataManagementPage = new CleansingDataManagement (page);
        const randomStringSuffix = await CreateRandomString.generateRandomString(5);
        const nameUpdated = "Remove Queue Item Task "+randomStringSuffix
        const identifierUpdated = "Remove Queue Item Task "+randomStringSuffix

        const userToken = await apiUtils.getAccessToken(uberallUser_sp696, process.env.GEODESY_USERS_PASSWORD)
        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        await test.step(`Given a location has been modified on uberall platform`, async () => {
            const requestBody = await createRequestBodyUtil.createBody(crateUpdateLocationBody(nameUpdated, identifierUpdated))
            await apiUtils.patchRequest(apiContext, `/api/locations/${LocationID_TaskManager_RemoveFromQueue}?access_token=${userToken}`, requestBody)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${LocationID_TaskManager_RemoveFromQueue}`)
        });

        await delay(5000)

        await test.step(`And a Complex Countries user has successfully logged in to the Geodesy platform`, async () => {
            await loginGeodesyAppAs(page, geodesyCCUser, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list') 
        });

        await test.step(`And user proceeds do the cleansing queue`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/cleansing-portal/cleansing/list`, { waitUntil: 'domcontentloaded' })
        });

        await test.step(`And selects the option to start handling`, async () => {
            await cleansingList.startHandlingButton.click()
        });

        await test.step(`And user sees the location to appear on the queue`, async () => {
            await cleansingPortal.cleanseCases_noRestrictions()
        });

        await test.step(`And user sees the location appearing on the cleansing list`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/cleansing-portal/cleansing/list`, { waitUntil: 'domcontentloaded' })
            await expect (cleansingList.locationListDisplayName(nameUpdated).first()).toBeVisible()
            await dashboardPage.userProfileButton.click()
            await dashboardPage.logOutButton.click()
        });

        await test.step(`When an ADMIN user creates and executes a task to remove the location from the queue`, async () => {
            await loginGeodesyAppAs(page, geodesyAdminUser, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list') 
            await page.goto(`${process.env.GEODESY_BASE_URL}/task-management/executor/batches`, { waitUntil: 'networkidle' })
            await taskManagement.createTask_Step1('Type', 'Remove Queue Item', 'Source', 'Location Id List')
            await taskManagement.locationListIds.fill(LocationID_TaskManager_RemoveFromQueue)
            await taskManagement.nextButton('2Paste location ids').click()
            await taskManagement.initiateButton('3Overview').click({delay:2000})
            await dashboardPage.userProfileButton.click()
            await dashboardPage.logOutButton.click()
        });

        await delay(5000)

        await test.step(`And Complex Countries user logs back in to the Geodesy platform`, async () => {
            await loginGeodesyAppAs(page, geodesyCCUser, process.env.GEODESY_USERS_PASSWORD)
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list') 
            await delay(5000)
        });

        await test.step(`And Complex Countries user accesses to the cleansing list`, async () => {
            await page.goto(`${process.env.GEODESY_BASE_URL}/cleansing-portal/cleansing/list`, { waitUntil: 'networkidle' })
        });

        await test.step(`Then Complex Countries user WONT SEE the location assigned to it`, async () => {
            await expect (cleansingList.locationListDisplayName(nameUpdated).first()).toBeHidden()
        });

        await test.step(`And the location is cleansed`, async () => {
            await dataManagementPage.searchForLocation('Enter PoI Id', LocationID_TaskManager_RemoveFromQueue)
            await poisPage.cleanseButton.click({delay:3000});
            await poisPage.cleansingReasonButton.click({delay:3000});
            await poisPage.openClnPanelButton.click({delay:3000});
            await expect(cleansingPortal.mapLabel).toBeVisible()
            await delay(5000)
            await expect(cleansingPortal.saveButton).toBeVisible()
            await cleansingPortal.saveButton.click();
        });

    });
    
});

function crateUpdateLocationBody (locationName:string, locationIdentifier:string) {
    const locationBody = new Map<string, string>();
    locationBody.set("name", locationName)
    locationBody.set("identifier", locationIdentifier)
    return locationBody
}