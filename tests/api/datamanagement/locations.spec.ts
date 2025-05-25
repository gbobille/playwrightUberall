import { expect, test } from "@playwright/test";
import BaseCall from "../../../api/uberall/baseCall";
import { dataManagementConfig } from "../../datamanagement/dataManagement.config";

const locationID = dataManagementConfig.DM_LOCATION_SUBLOCALITY
const notElegibleLocationID = dataManagementConfig.DM_LOCATION_NOT_ELEGIBLE_SUBLOCALITY
let userToken = "";
let apiContext = null;
let response = null;
let formData = new URLSearchParams()
const apiUtils = new BaseCall()

test.describe.configure({ mode: 'serial' });

test.describe("Locations Edit - Sublocality", { tag: '@Sublocality' }, () =>{

    test(`Verify it is possible to add sublocality field to a location`, async ({}) => {
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            const apiUtils = new BaseCall();
            userToken = await apiUtils.getAccessToken(dataManagementConfig.DM_ADMIN_USER_SUBLOCALITY, process.env.DM_ADMIN_PASSWORD);
        });

        await test.step(`And user sends the request to update a location with sublocality field`, async () => {
            const requestBodyJSON = {
                "sublocality": "Test Locality"
            }
            const requestBody = JSON.stringify(requestBodyJSON)
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)
        });

        await test.step(`Then user verifies the changes are properly applied`, async () => {
            await expect(response.response.location.sublocality).toBe('Test Locality')
        });
    });

    /*
    test(`Verify if the location is not placed in an elegible country it wont be possible to add sublocality`, async ({}) => {
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            const apiUtils = new BaseCall();
            userToken = await apiUtils.getAccessToken(dataManagementConfig.DM_ADMIN_USER_SUBLOCALITY, process.env.DM_ADMIN_PASSWORD);        });
        
        await test.step(`And user sends the request to update a location with sublocality field`, async () => {
            const requestBodyJSON = {
                "sublocality": "Test Locality"
            }
            const requestBody = JSON.stringify(requestBodyJSON)
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.patchRequest(apiContext, `/api/locations/${notElegibleLocationID}?access_token=${userToken}`, requestBody)
            
        });

        await test.step(`Then user verifies the changes wont be applied`, async () => {
            await expect(response.response.location).not.toContain("sublocality")
        });
    });
    */

    test(`Verify if the user doesn't have the feature enabled it wont be possible to add sublocality`, async ({}) => {
        await test.step(`Given user logs in with valid credentials for a NOT elegible sales partner`, async() => {
            const apiUtils = new BaseCall();
            userToken = await apiUtils.getAccessToken(dataManagementConfig.DM_ADMIN3_USER_SUBLOCALITY, process.env.DM_ADMIN_PASSWORD);
        });

        await test.step(`And user sends the request to update a location with sublocality field`, async () => {
            const requestBodyJSON = {
                "sublocality": "Test Locality"
            }
            const requestBody = JSON.stringify(requestBodyJSON)
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)
        });

        await test.step(`Then user verifies the changes are properly applied`, async () => {
            await expect(response.message).toBe('Missing write permissions')
        });
    });

    async function createFormData (email: string, password: string) {
        formData.append("email", email)
        formData.append("password",password)
        return formData
    }

    test.afterEach(async () => {
        //clearing formData
        formData.delete("email")
        formData.delete("password")
        
        //re populating form data with user admin with permissions
        const apiUtils = new BaseCall();
        userToken = await apiUtils.getAccessToken(dataManagementConfig.DM_ADMIN_USER_SUBLOCALITY, process.env.DM_ADMIN_PASSWORD);

        const requestBodyJSON = {
            "sublocality": ""
        }
        const requestBody = JSON.stringify(requestBodyJSON)
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        //Update location - restore sublocality to empty string
        await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody)

        //resetting variables
        formData.delete("email")
        formData.delete("password")
        response = null;
        userToken = "";
    });
});