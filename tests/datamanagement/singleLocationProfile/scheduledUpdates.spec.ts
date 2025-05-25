import { expect, test } from "@playwright/test"
import LocationPage from "../../../pages/datamanagement/singleLocationProfile/basicDataPage"
import RichData from "../../../pages/datamanagement/singleLocationProfile/richDataPage"
import ScheduledUpdate from "../../../pages/datamanagement/singleLocationProfile/scheduledUpdatesPage"
import PhotosAndVideos from "../../../pages/datamanagement/singleLocationProfile/photosAndVideosPage"
import uploadFileUtil from "../../../utils/upload-file-utils"
import { loginUberallAppAs } from "../../../utils/login-util"
import { dataManagementConfig }  from "../dataManagement.config"
import { getRandomFutureDate } from "../../../utils/randomFutureDateUtils"

test.describe("Scheduled Updates - Basic Data", { tag: '@scheduled_updates, @dm_regression' }, () => {
    test.beforeEach("Given user successfully logs in and navigates to a location page", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
        await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/basic-data`, { waitUntil: 'domcontentloaded' })
    })

    test("Verify user can perform a schedule update on the Basic Data page", async ({ page }) => {
        const basicData = new LocationPage (page)
        const scheduledUpdate = new ScheduledUpdate (page)
        const date = await getRandomFutureDate()

        await test.step(`And user modifies the address line 2`, async () => {
            await basicData.updateAddressLine2('Unit 14')
        })

        await test.step(`When user clicks Schedule Update button`, async () => {
            await scheduledUpdate.scheduleButton.click()
        })

        await test.step(`And user updates the date and time`, async() => {
            await scheduledUpdate.datePicker.waitFor({state: "visible"})
            await scheduledUpdate.datePicker.click()
            await scheduledUpdate.datePicker.fill(date)
            await scheduledUpdate.openTimeMenu.click()
            await scheduledUpdate.timePicker.click()
        })

        await test.step(`And user confirms the schedule`, async() => {
            await scheduledUpdate.nextButton.click()
            await scheduledUpdate.createScheduleButton.click()
        })

        await test.step(`And user verifies the Success Message is displayed`, async() => {
            await scheduledUpdate.scheduleSuccessMessage.click()
        })

        await test.step(`Then user navigates to the Scheduled Updates page to ensure the schedule was created`, async() => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/scheduled-updates`)
            await expect(scheduledUpdate.getDate(date)).toBeVisible()
        })

        await test.step(`And user deletes the scheduled update`, async() => {
            await scheduledUpdate.deleteButton.click()
            await scheduledUpdate.confirmDelete.click()
        })
    })
})

test.describe("Scheduled Updates - Rich Data", { tag: '@scheduled_updates, @dm_regression' }, () => {
    test.beforeEach("Given user successfully logs in and navigates to a location page", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
        await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/rich-data`, { waitUntil: 'domcontentloaded' })
    })

    test("Verify user can perform a schedule update on the Rich Data page", async ({ page }) => {
        const richData = new RichData (page)
        const scheduledUpdate = new ScheduledUpdate (page)
        const date1 = await getRandomFutureDate()

        await test.step(`And user updates the language`, async () => {
            await richData.selectLanguage.click()
        })

        await test.step(`And user selects Danish`, async () => {
            await richData.selectDanish.click()
        })

        await test.step(`And user clicks Schedule Button`, async () => {
            await scheduledUpdate.scheduleButton.click()
        })

        await test.step(`And user updates the date and time`, async() => {
            await scheduledUpdate.datePicker.waitFor({state: "visible"})
            await scheduledUpdate.datePicker.click()
            await scheduledUpdate.datePicker.fill(date1)
            await scheduledUpdate.openTimeMenu.click()
            await scheduledUpdate.timePicker.click()
        })

        await test.step(`And user confirms the schedule`, async() => {
            await scheduledUpdate.nextButton.click()
            await scheduledUpdate.createScheduleButton.click()
        })

        await test.step(`And user verifies the Success Message is displayed`, async() => {
            await scheduledUpdate.scheduleSuccessMessage.click()
        })

        await test.step(`Then user navigates to the Scheduled Updates page to ensure the schedule was created`, async() => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/scheduled-updates`)
            await expect(scheduledUpdate.getDate(date1)).toBeVisible()
        })

        await test.step(`And user deletes the scheduled update`, async() => {
            await scheduledUpdate.deleteButton.click()
            await scheduledUpdate.confirmDelete.click()
        })
    })
})

    test.describe("Scheduled Updates - Logo and Cover Photos", { tag: '@scheduled_updates, @dm_regression' }, () => {
        test.beforeEach("Given user successfully logs in and navigates to a location page", async ({page}) => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/photos-videos`, { waitUntil: 'domcontentloaded' })
        })

        test("Verify user can perform a schedule update with Logo and Cover", async ({ page }) => {
            const photosAndVideosPage = new PhotosAndVideos (page)
            const scheduledUpdate = new ScheduledUpdate (page)
            const date2 = await getRandomFutureDate()

            await test.step(`When user selects the logo placeholder`, async() => {
                await photosAndVideosPage.logoCoverPlaceholder('LOGO').click()
            })

            await test.step(`When user uploads a photo`, async() => {
                await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'Logo.png')
            })

            await test.step(`And user confirms the changes`, async() => {
                await photosAndVideosPage.confirmButton.click()
            })

            await test.step(`And user clicks Schedule Button`, async () => {
                await scheduledUpdate.scheduleButton.click()
            })
    
            await test.step(`And user updates the date and time`, async() => {
                await scheduledUpdate.datePicker.waitFor({state: "visible"})
                await scheduledUpdate.datePicker.click()
                await scheduledUpdate.datePicker.fill(date2)
                await scheduledUpdate.openTimeMenu.click()
                await scheduledUpdate.timePicker.click()
            })
    
            await test.step(`And user confirms the schedule`, async() => {
                await scheduledUpdate.nextButton.click()
                await scheduledUpdate.createScheduleButton.click()
            })
    
            await test.step(`And user verifies the Success Message is displayed`, async() => {
                await scheduledUpdate.scheduleSuccessMessage.click()
            })

            await test.step(`Then user navigates to the Scheduled Updates page to ensure the schedule was created`, async() => {
                await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_GENERAL_TESTS}/scheduled-updates`)
                await expect(scheduledUpdate.getDate(date2)).toBeVisible()
            })
    
            await test.step(`And user deletes the scheduled update`, async() => {
                await scheduledUpdate.deleteButton.click()
                await scheduledUpdate.confirmDelete.click()
            })
        })
    })