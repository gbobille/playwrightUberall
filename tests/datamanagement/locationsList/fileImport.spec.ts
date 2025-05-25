import { expect, test } from "@playwright/test"
import { loginUberallAppAs } from "../../../utils/login-util"
import getIDFromURL from "../../../utils/getIdFromURL-util"
import FileImport from "../../../pages/datamanagement/fileImportPage"
import { dataManagementConfig } from "../dataManagement.config"
import uploadFileUtil from "../../../utils/upload-file-utils"
import BaseCall from "../../../api/uberall/baseCall"
import LocationListRevamp from "../../../pages/datamanagement/locationListRevamp"
import BasicData from "../../../pages/datamanagement/singleLocationProfile/basicDataPage"

let locationID = null
let updatedID = null

test.describe("File Import Test", { tag: '@file_import, @dm_regression' }, () => {
    test.beforeEach("Given admin user successfully logs in", async ({ page }) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    })

    test("Verify user can create a new Location with File Import", async ({ page }) => {
        const fileImportPage = new FileImport(page)
        const locationName = "New Location Automation FILE IMPORT"
        const fileName = 'File Import Location.xlsx'
        const locationListRevamp = new LocationListRevamp(page)

        await test.step(`When user is on the locations list page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user clicks the Add Location button`, async () => {
            await locationListRevamp.addLocationButton.click()
        })

        await test.step(`And user clicks the import`, async () => {
            await fileImportPage.excelImportOption.click()
        })

        await test.step(`And user clicks the button to selects the file to import`, async () => {
            await fileImportPage.selectFileButton.click()
        })

        await test.step(`And user selects the file to import`, async () => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'files', fileName)
        })

        await test.step(`And user confirms the upload of the file`, async () => {
            await fileImportPage.clickContinue()
        })

        await test.step(`And user selects the option to start the import process`, async () => {
            await fileImportPage.clickStartImport()
        })

        await test.step(`And the file import flows succeeds`, async () => {
            await fileImportPage.validateFileImportFinished()
        })

        await test.step(`Then user validates the location was created`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations?query=${locationName}`, { waitUntil: 'domcontentloaded' })
            await page.reload()
            await expect(locationListRevamp.locationByText(locationName)).toBeVisible()
            await locationListRevamp.locationByText(locationName).click()
            var location = await getIDFromURL.getLocationIDFromURL(page)
            locationID = parseInt(location.toString())
        })
    })

    test("Verify user can update a Location with File Import", async ({ page }) => {
        const fileImportPage = new FileImport(page)
        const fileName = 'Update Location.xlsx'
        const locationName = "DM_SCHEDULED_UPDATES"
        const locationListRevamp = new LocationListRevamp(page)
        const basicData = new BasicData (page)

        await test.step(`When user is on the locations list page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user clicks the Bulk Update button`, async () => {
            await locationListRevamp.bulkUpdateButton.click()
        })

        await test.step(`And user clicks the import`, async () => {
            await fileImportPage.excelImportOption.click()
        })

        await test.step(`And user clicks the button to selects the file to import`, async () => {
            await fileImportPage.selectFileButton.click()
        })

        await test.step(`And user selects the file to import`, async () => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'files', fileName)
        })

        await test.step(`And user confirms the upload of the file`, async () => {
            await fileImportPage.clickContinue()
        })

        await test.step(`And user selects the option to start the import process`, async () => {
            await fileImportPage.clickStartImport()
        })

        await test.step(`And the file import flows succeeds`, async () => {
            await fileImportPage.validateFileImportFinished()
        })

        await test.step(`And user looks for the updated location`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations?query=${locationName}`, { waitUntil: 'domcontentloaded' })
            await expect(locationListRevamp.locationByText(locationName)).toBeVisible()
            await locationListRevamp.locationByText(locationName).click()
        })

        await test.step(`Then user looks for the updates made via Bulk Update`, async () => {
            await expect (basicData.descriptionShort('File Import Short Description')).toBeVisible()
            await expect (basicData.descriptionLong('File Import Long Description')).toBeVisible()
            var location = await getIDFromURL.getLocationIDFromURL(page)
            updatedID = parseInt(location.toString())
        })
    })

    test.afterEach(async () => {
        const apiUtils = new BaseCall()
        const userToken = await apiUtils.getAccessToken(dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)

        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/x-www-form-urlencoded', "")

        //Change location status
        const requestBodyJSON1 = {
            "status": "INACTIVE",
            "temporarilyClosed": {
                "temporarilyClosed": false
            }
        }

        const requestBodyJSON2 = {
            "website": "https://www.uberall.com",
            "descriptionShort": "Short Description",
            "descriptionLong": "Long Description"
        }

        const requestBody1 = JSON.stringify(requestBodyJSON1)
        const requestBody2 = JSON.stringify(requestBodyJSON2)

        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        //Update New Location status to INACTIVE
        await apiUtils.patchRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`, requestBody1)

        //Set Updated Location back to BASELINE
        await apiUtils.patchRequest(apiContext, `/api/locations/${updatedID}?access_token=${userToken}`, requestBody2)

        //Delete location
        await apiUtils.deleteRequest(apiContext, `/api/locations/${locationID}?access_token=${userToken}`)
        locationID = null
        updatedID = null
    })
})

