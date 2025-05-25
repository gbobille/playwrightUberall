import { expect, test } from "@playwright/test";
import LocationPage from "../../../pages/datamanagement/singleLocationProfile/basicDataPage"
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig } from "../dataManagement.config";
import BaseCall from "../../../api/uberall/baseCall";

test.describe(`Doctor.com - Verify users have access to view and edit Doctor.com fields`, { tag: '@doctor_com, @dm_regression' }, () => {
    test("Verify US user can view Doctor.com fields when uberall.salespartner.doctorCom.hideDeprecatedFields is disabled", async ({ page }) => {
        const basicData = new LocationPage(page)

        await test.step(`When user logins and navigates to a location with doctor_com`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_DOCTOR1}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user updates the Categories`, async () => {
            await basicData.categoryField.click()
            await basicData.categoryField.fill('doctor')
            await basicData.healthCareCategory.click()
        })

        await test.step(`And user updates the Doctor-specific Categories`, async () => {
            await basicData.doctorCategoryField.click()
            await basicData.doctorCategoryField.fill('nurse')
            await basicData.doctorCategory.click()
        })

        await test.step(`And user updates the Practice Name`, async () => {
            await basicData.practiceNameField.click()
            await basicData.practiceNameField.fill('Doctor Office')
        })

        await test.step(`And user updates the NPI`, async () => {
            await basicData.npiField.click()
            await basicData.npiField.fill('1336573260')
        })

        await test.step(`And user updates the Degree`, async () => {
            await basicData.degreeField.click()
            await basicData.degreeField.fill('Dental Degree')
        })

        await test.step(`And user updates the University`, async () => {
            await basicData.universityField.click()
            await basicData.universityField.fill('University of Dentists')
        })

        await test.step(`And user updates the Hospital`, async () => {
            await basicData.hospitalField.click()
            await basicData.hospitalField.fill('Hospital of Dentists')
        })

        await test.step(`And user updates the Insurance`, async () => {
            await basicData.insuranceField.click()
            await basicData.insuranceField.fill('Insurance of Dentists')
        })

        await test.step(`And user Saves the update`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies the changes are saved successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })

        await test.step(`Submit an API request to clear the Doctor.com info and reset it to a baseline status`, async () => {
            const apiUtils = new BaseCall()
            const userToken = await apiUtils.getAccessToken(dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)

            const requestBodyJSON = {
                "categories": [],
                "doctorComData": {
                    "npi": [],
                    "credentials": [],
                    "university": [],
                    "hospitalAffiliations": [],
                    "insurancesAccepted": [],
                    "doctorCategories": [],
                    "practiceName": []
                }
            }

            const requestBody = JSON.stringify(requestBodyJSON)
            const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

            await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_DOCTOR1}?access_token=${userToken}`, requestBody)
        })
    })

    test("Verify Germany user can view Doctor.com fields when uberall.salespartner.doctorCom.hideDeprecatedFields is disabled", async ({ page }) => {
        const basicData = new LocationPage(page)

        await test.step(`When user logins and navigates to a location with doctor_com`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_DOCTOR2}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user updates the Categories`, async () => {
            await basicData.categoryField.click()
            await basicData.categoryField.fill('doctor')
            await basicData.healthCareCategory.click()
        })

        await test.step(`And user Saves the update`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies the changes are saved successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })

        await test.step(`Submit an API request to clear the Doctor.com info and reset it to a baseline status`, async () => {
            const apiUtils = new BaseCall()
            const userToken = await apiUtils.getAccessToken(dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)

            const requestBodyJSON = {
                "categories": []
            }

            const requestBody = JSON.stringify(requestBodyJSON)
            const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

            await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_DOCTOR2}?access_token=${userToken}`, requestBody)
        })
    })

    test("Verify US user can't view hidden Doctor.com fields when uberall.salespartner.doctorCom.hideDeprecatedFields is enabled", async ({ page }) => {
        const basicData = new LocationPage(page)

        await test.step(`When user logins and navigates to a location with doctor_com`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_DOCTOR3}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user updates the Categories`, async () => {
            await basicData.categoryField.click()
            await basicData.categoryField.fill('doctor')
            await basicData.healthCareCategory.click()
        })

        await test.step(`And user updates the Doctor-specific Categories`, async () => {
            await basicData.doctorCategoryField.click()
            await basicData.doctorCategoryField.fill('nurse')
            await basicData.doctorCategory.click()
        })

        await test.step(`And user updates the Practice Name`, async () => {
            await basicData.practiceNameField.click()
            await basicData.practiceNameField.fill('Doctor Office')
        })

        await test.step(`And user updates the NPI`, async () => {
            await basicData.npiField.click()
            await basicData.npiField.fill('1336573260')
        })

        await test.step(`And user updates the Degree`, async () => {
            await basicData.degreeField.click()
            await basicData.degreeField.fill('Dental Degree')
        })

        await test.step(`And user can't view the University field`, async () => {
            await expect(basicData.universityField).not.toBeVisible()
        })

        await test.step(`And user can't view the Hospital field`, async () => {
            await expect(basicData.hospitalField).not.toBeVisible()
        })

        await test.step(`And user can't view the Insurance field`, async () => {
            await expect(basicData.insuranceField).not.toBeVisible()
        })

        await test.step(`And user Saves the update`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies the changes are saved successfully`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })

        await test.step(`Submit an API request to clear the Doctor.com info and reset it to a baseline status`, async () => {
            const apiUtils = new BaseCall()
            const userToken = await apiUtils.getAccessToken(dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)

            const requestBodyJSON = {
                "categories": [],
                "doctorComData": {
                    "npi": [],
                    "credentials": [],
                    "doctorCategories": [],
                    "practiceName": []
                }
            }

            const requestBody = JSON.stringify(requestBodyJSON)
            const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

            await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_DOCTOR3}?access_token=${userToken}`, requestBody)
        })
    })
})
