import { test, expect } from "@playwright/test"
import { dataManagementConfig }  from "../dataManagement.config"
import SaveChangesBar from "../../../pages/datamanagement/saveChanges"
import PhotosAndVideos from "../../../pages/datamanagement/singleLocationProfile/photosAndVideosPage"
import BaseCall from "../../../api/uberall/baseCall"
import uploadFileUtil from "../../../utils/upload-file-utils"
import { loginUberallAppAs } from "../../../utils/login-util"

test.describe("Locations Photos And Videos - Logos and Cover Photos", { tag: '@single_location_profile, @dm_regression' }, () => {
    test.beforeEach("Given user successfully logs in", async ({ page }) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    })

    test(`Verify users can upload Logos`, async({ page }) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_MEDIAMANAGER}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the logo placeholder`, async() => {
            await photosAndVideosPage.logoCoverPlaceholder('LOGO').click()
        })

        await test.step(`When user uploads a photo`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'Logo.png')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })

        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })
    })

    test(`Verify users can upload Squared Logo`, async({ page }) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_MEDIAMANAGER}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the logo placeholder`, async() => {
            await photosAndVideosPage.logoCoverPlaceholder('SQUARED_LOGO').click()
        })

        await test.step(`When user uploads a photo`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'squared-logo.png')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the logo`, async() => {
            await photosAndVideosPage.saveItem.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })

        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })
    })

    test(`Verify users can upload Google Cover Photo`, async({ page }) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_MEDIAMANAGER}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the Google placeholder`, async() => {
            await photosAndVideosPage.logoCoverPlaceholder('LANDSCAPE').click()
        })

        await test.step(`When user uploads a photo`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'Landscape.jpeg')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the logo`, async() => {
            await photosAndVideosPage.saveItem.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })

        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })

    })

    test(`Verify users can upload Facebook Cover Photo`, async({ page }) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_MEDIAMANAGER}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the Facebook placeholder`, async() => {
            await photosAndVideosPage.logoCoverPlaceholder('FACEBOOK_LANDSCAPE').click()
        })

        await test.step(`When user uploads a photo`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'FacebookCover.jpeg')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the logo`, async() => {
            await photosAndVideosPage.saveItem.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })

        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })
    })

    test(`Verify users can upload Locator Cover Photo`, async({ page }) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_DOCTORCOM_US_PHOTO_TYPE}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the Locator Cover Photo placeholder`, async() => {
            await photosAndVideosPage.logoCoverPlaceholder('STOREFINDER_COVER').click()
        })

        await test.step(`When user uploads a photo`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'store-finder-cover.png')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the logo`, async() => {
            await photosAndVideosPage.saveItem.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })

        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })
    })

    test(`Verify users can upload Locator Logo Photo`, async({ page }) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_DOCTORCOM_US_PHOTO_TYPE}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the Locator Logo Photo placeholder`, async() => {
            await photosAndVideosPage.logoCoverPlaceholder('STOREFINDER_LOGO').click()
        })

        await test.step(`When user uploads a photo`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'store-finder-logo.png')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })

        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })
    })

    test(`Verify users can upload Portrait Photo (Doctor.com) Photo`, async({ page }) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_DOCTORCOM_US_PHOTO_TYPE}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the Portrait Photo (Doctor.com) Photo placeholder`, async() => {
            await photosAndVideosPage.logoCoverPlaceholder('DOCTOR_COM_PORTRAIT').click()
        })

        await test.step(`When user uploads a photo`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'SquaredLogo.jpeg')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })

        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })
    })
})

test.describe("Location Photos and Videos - Apple Maps Cover", { tag: '@single_location_profile, @dm_regression' }, () => {
    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.AUTONATION_ADMIN, process.env.ADMIN_PASSWORD)
    })

    test(`Verify users can upload Apple Maps Photo`, async({ page }) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_APPLE_MAPS_PHOTO_TYPE}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the Apple Photo placeholder`, async() => {
            await photosAndVideosPage.logoCoverPlaceholder('APPLE_LANDSCAPE').click()
        })

        await test.step(`When user uploads a photo`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'apple-landscape.jpeg')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the logo`, async() => {
            await photosAndVideosPage.saveItem.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })

        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })

        await test.step(`Submit an API request to clear the location and reset it to a baseline status`, async () => {
            const apiUtils = new BaseCall()
            const userToken = await apiUtils.getAccessToken(dataManagementConfig.AUTONATION_ADMIN, process.env.ADMIN_PASSWORD)

            const requestBodyJSON = {
                "photos": [],
                "videos": []
            }

            const requestBody = JSON.stringify(requestBodyJSON)
            const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

            await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_APPLE_MAPS_PHOTO_TYPE}?access_token=${userToken}`, requestBody)
        })
    })
})

test.describe("Locations Photos And Videos - Albums", { tag: '@single_location_profile, @dm_regression, @Production' }, () => {
    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    })

    test(`Verify it is possible to add an Additional Photo to an album`, async({page}) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_MEDIAMANAGER}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the album Additional Photos`, async() => {
            await photosAndVideosPage.clickAlbumTab('Additional Photos')
        })

        await test.step(`And user clicks the button to upload a photo`, async() => {
            await photosAndVideosPage.uploadPhotoButton.click()
        })

        await test.step(`And user selects the photo to upload`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'Exterior.jpg')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })

        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })
    })
})

test.describe("Locations Photos And Videos - Videos", { tag: '@Videos' }, () => {
    
    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    })

    test(`Verify it is possible to add video`, async({page}) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_MEDIAMANAGER}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the option to upload a video`, async() => {
            await photosAndVideosPage.uploadVideoButton.click()
        })

        await test.step(`And user selects the video to upload`, async() => {
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'videos', 'Video.mp4')
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })
        
        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })
    })
})

test.describe("Locations Photos And Videos - Youtube URL Videos", { tag: '@Videos, @dm_regression' }, () => {
    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    })

    test(`Verify it is possible to add video using a Youtube URL`, async({page}) => {
        const photosAndVideosPage = new PhotosAndVideos (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location photos and videos page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_MEDIAMANAGER}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`When user selects the option to upload a video`, async() => {
            await photosAndVideosPage.uploadVideoButton.click()
        })

        await test.step(`And user selects the option to post a video url`, async() => {
            await photosAndVideosPage.postVideoUrlButton.click()
        })

        await test.step(`And user adds a Youtube URL`, async() => {
            await photosAndVideosPage.inputVideoUrl.click()
            await photosAndVideosPage.inputVideoUrl.fill('https://www.youtube.com/watch?v=9Fg_1YYARYg')
            await photosAndVideosPage.addVideoUrl.click()
        })

        await test.step(`And user confirms the changes`, async() => {
            await photosAndVideosPage.confirmButton.click()
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.saveButton.click()
        })
        
        await test.step(`Then the modifications are persistent`, async() => {
            await expect(photosAndVideosPage.photoUploaded).toBeVisible()
        })
    })
})

test.describe("Locations Photos And Videos - Reset Locations to Baseline Status", { tag: '@single_location_profile, @dm_regression' }, () => {
    test(`Reset Locations to Baseline Status`, async({page}) => {
        await test.step(`Submit an API request to clear the location and reset it to a baseline status`, async () => {
            const apiUtils = new BaseCall()
            const userToken = await apiUtils.getAccessToken(dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)

            const requestBodyJSON = {
                "photos": [],
                "videos": [],
                "albums": []
            }

            const requestBody = JSON.stringify(requestBodyJSON)
            const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

            await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_MEDIAMANAGER}?access_token=${userToken}`, requestBody)
            await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_APPLE_MAPS_PHOTO_TYPE}?access_token=${userToken}`, requestBody)
            await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_DOCTORCOM_US_PHOTO_TYPE}?access_token=${userToken}`, requestBody)
        })
    })
})