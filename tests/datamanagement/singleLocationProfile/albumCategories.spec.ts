import { expect, test } from "@playwright/test";
import LocationPage from "../../../pages/datamanagement/singleLocationProfile/basicDataPage"
import PhotosAndVideos from "../../../pages/datamanagement/singleLocationProfile/photosAndVideosPage"
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig } from "../dataManagement.config";
import BaseCall from "../../../api/uberall/baseCall";

test.describe(`Categories - verify it is possible to change the location category and it reflects on the albums types`, { tag: '@dm_categories, @dm_regression' }, () => {

    test.beforeEach("Given user successfully logs in and navigates to a location page", async ({ page }) => {
        await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
        await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_CATEGORY_TEST}/basic-data`, { waitUntil: 'domcontentloaded' })
    })

    test(`Verify the category Retail > Medical Supplies > Hearing Aid Store has the album type Product`, async ({ page }) => {
        const basicData = new LocationPage(page)
        const photosAndVideosPage = new PhotosAndVideos(page)

        await test.step(`When user modifies the category to Hearing Aid Store`, async () => {
            await basicData.categoryField.click()
            await basicData.categoryField.fill('Hearing Aid Store')
            await basicData.hearingAid.click()
        })

        await test.step(`And user saves the changes`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`And user navigates to the Photos Page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_CATEGORY_TEST}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`Then user verifies the Exterior album is reflecting`, async () => {
            await expect(photosAndVideosPage.albumTab('Exterior')).toBeVisible()
        })
    })

    test(`Verify the category Social and Entertainment > Food and Drinks > Restaurant has the album type Food and Menu`, async ({ page }) => {
        const basicData = new LocationPage(page)
        const photosAndVideosPage = new PhotosAndVideos(page)

        await test.step(`When user modifies the category to Restaurant`, async () => {
            await basicData.categoryField.click()
            await basicData.categoryField.fill('Restaurant')
            await basicData.restaurant.click()
        })

        await test.step(`And user saves the changes`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`And user navigates to the Photos Page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_CATEGORY_TEST}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`Then user verifies the Food and Menu albums are reflecting`, async () => {
            await expect(photosAndVideosPage.albumTab('Food and Drink')).toBeVisible()
            await expect(photosAndVideosPage.albumTab('Menu')).toBeVisible()
        })
    })

    test(`Verify the category Healthcare > Hospitals, Clinics and Medical Centers > Hospital has the album type Teams and At Work`, async ({ page }) => {
        const basicData = new LocationPage(page)
        const photosAndVideosPage = new PhotosAndVideos(page)

        await test.step(`When user modifies the category to Hospital`, async () => {
            await basicData.categoryField.click()
            await basicData.categoryField.fill('Hospital')
            await basicData.hospital.click()
        })

        await test.step(`And user saves the changes`, async () => {
            await basicData.saveButton.click()
        })

        await test.step(`And user navigates to the Photos Page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_CATEGORY_TEST}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`Then user verifies the Teams and At Work albums are reflecting`, async () => {
            await expect(photosAndVideosPage.albumTab('Teams')).toBeVisible()
            await expect(photosAndVideosPage.albumTab('At Work')).toBeVisible()
        })
    })

    test.afterEach(`Reset Location to Baseline Status`, async ({ page }) => {
        await test.step(`Submit an API request to clear the location and reset it to a baseline status`, async () => {
            const apiUtils = new BaseCall()
            const userToken = await apiUtils.getAccessToken(dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)

            const requestBodyJSON = {
                "photos": [],
                "categories": []
            }

            const requestBody = JSON.stringify(requestBodyJSON)
            const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

            await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_CATEGORY_TEST}?access_token=${userToken}`, requestBody)
        })
    })
})