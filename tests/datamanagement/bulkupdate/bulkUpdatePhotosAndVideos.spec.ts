import { test, expect, Page } from '@playwright/test';
import { loginUberallAppAs } from "../../../utils/login-util";
import LocationListRevamp from "../../../pages/datamanagement/locationListRevamp";
import BulkUpdate from "../../../pages/datamanagement/bulkUpdatePage";
import { dataManagementConfig } from "../dataManagement.config";
import PhotosAndVideos from '../../../pages/datamanagement/singleLocationProfile/photosAndVideosPage';
import uploadFileUtil from "../../../utils/upload-file-utils"

const location1 = 'DM_BulkUpdate_Location - I'
const location2 = 'DM_BulkUpdate_Location II'

test.describe('Bulk Update Photos and Videos', { tag: ['@Videos']  }, () => {

    test.beforeEach("Given admin user successfully logs in", async ({ page }) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    });
    test('Verify it is possible to update locations in bulk with videos urls - Overwrite', async ({ page }: { page: Page }) => {

        const bulkUpdatePage = new BulkUpdate(page);
        const locationListRevamp = new LocationListRevamp(page)
        const photosAndVideosPage = new PhotosAndVideos(page)

        await test.step(`And user is on the locations list page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'load' });
        });
        await test.step(`And user clicks the Bulk Update button and clicks the Bulk Editor button`, async () => {
            await bulkUpdatePage.bulkUpdateButton.click();
            await locationListRevamp.bulkEditorButton.click();
        });
        await test.step(`And user click + Add Location, select the location and clicks Next`, async () => {
            await bulkUpdatePage.clickAddLocationsButton()
            await bulkUpdatePage.selectBulkLocationSearch.fill("DM_BulkUpdate_Location -")
            await bulkUpdatePage.selectBulkLocation1Value(location1).click()
            await bulkUpdatePage.selectBulkLocation2Value(location2).click()
            await bulkUpdatePage.clickSelectButton()
            await bulkUpdatePage.clickNext()
        })
        await test.step(`And user updates the videos URL`, async () => {
            await expect(bulkUpdatePage.tapPhotosAndVideosTab).toBeVisible();
            await bulkUpdatePage.tapPhotosAndVideosTab.click();
            await photosAndVideosPage.clickUploadVideo();
            await bulkUpdatePage.uploadUrlVideo()
            await photosAndVideosPage.clickConfirmUpload();
            await bulkUpdatePage.clickNext();
        })
        await test.step(`And user verifies data is correct in confirmation page and clicks Save changes button`, async () => {
            await bulkUpdatePage.validateChanges('1 video(s)')
            await expect(bulkUpdatePage.locationNameCell(location1)).toBeVisible()
            await expect(bulkUpdatePage.locationNameCell(location2)).toBeVisible()
            await bulkUpdatePage.clickSaveChanges();
        })
        await test.step(`And user validates the success message`, async () => {
            await expect(bulkUpdatePage.successMessageUpdate).toBeVisible();
        })
        await test.step(`Then the modifications are persistent`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION1_PHOTOS_AND_VIDEOS}/photos-videos`, { waitUntil: 'load' })
            await expect(photosAndVideosPage.videoURLUploaded.isVisible()).toBeTruthy()
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION2_PHOTOS_AND_VIDEOS}/photos-videos`, { waitUntil: 'load' })
            await expect(photosAndVideosPage.videoURLUploaded.isVisible()).toBeTruthy()
        })
    });
    //if it is for video upload, you need to use chrome. Chromium + videos upload are not working. Thats the reason I have a separated pipeline for videos upload
    test('Verify it is possible to update locations in bulk with video files - Overwrite', async ({ page }) => {
        const bulkUpdatePage = new BulkUpdate(page);
        const locationListRevamp = new LocationListRevamp(page)
        const photosAndVideosPage = new PhotosAndVideos(page)

        await test.step(`And user is on the locations list page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'load' });
        });
        await test.step(`And user clicks the Bulk Update button and clicks the Bulk Editor button`, async () => {
            await bulkUpdatePage.bulkUpdateButton.click();
            await locationListRevamp.bulkEditorButton.click();
        });
        await test.step(`And user click + Add Location, select the location and clicks Next`, async () => {
            await bulkUpdatePage.clickAddLocationsButton()
            await bulkUpdatePage.selectBulkLocationSearch.fill("DM_BulkUpdate_Location -")
            await bulkUpdatePage.selectBulkLocation1Value(location1).click()
            await bulkUpdatePage.selectBulkLocation2Value(location2).click()
            await bulkUpdatePage.clickSelectButton()
            await bulkUpdatePage.clickNext()
        })
        await test.step(`And user updates the videos URL`, async () => {
            await bulkUpdatePage.tapPhotosAndVideosTab.click();
            await photosAndVideosPage.clickUploadVideo();
            await photosAndVideosPage.uploadVideoBulkButton.isVisible();
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'videos', 'Video.mp4')
            await photosAndVideosPage.clickConfirmUpload();
            await bulkUpdatePage.clickNext();
        })
        await test.step(`And user verifies data is correct in confirmation page and clicks Save changes button`, async () => {
            await bulkUpdatePage.validateChanges('1 video(s)')
            await expect(bulkUpdatePage.locationNameCell(location1)).toBeVisible()
            await expect(bulkUpdatePage.locationNameCell(location2)).toBeVisible()
            await bulkUpdatePage.clickSaveChanges();
        })
        await test.step(`And user validates the success message`, async () => {
            await expect(bulkUpdatePage.successMessageUpdate).toBeVisible();
        })
        await test.step(`Then the modifications are persistent`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION1_PHOTOS_AND_VIDEOS}/photos-videos`, { waitUntil: 'load' })
            await expect(photosAndVideosPage.videoFileUploaded.isVisible()).toBeTruthy()
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION2_PHOTOS_AND_VIDEOS}/photos-videos`, { waitUntil: 'load' })
            await expect(photosAndVideosPage.videoFileUploaded.isVisible()).toBeTruthy()
        })
    });
    test.afterEach("Close browser", async ({ page }) => {
        await page.close();  // Close the browser after all tests are finished
    });
});
