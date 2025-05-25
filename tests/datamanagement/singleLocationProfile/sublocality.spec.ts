import { expect, test } from "@playwright/test";
import LocationPage from "../../../pages/datamanagement/singleLocationProfile/basicDataPage"
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig }  from "../dataManagement.config";


test.describe(`Sublocality field is displaying properly @single_location_profile @sublocality @dm_regression`, async () => {

    test(`Verify user can successfully view Sublocality on a Location eligible for uberall.sublocality.eligible.countries`, async ({ page }) => {
        const basicData = new LocationPage (page)

        await test.step(`Given admin user successfully logs in`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_ADMIN_USER_SUBLOCALITY, process.env.DM_ADMIN_PASSWORD)
        })

        await test.step(`When user navigates to a location with uberall.sublocality.eligible.countries`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_SUBLOCALITY}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`Then user verifies Sublocality is appearing on the Location Page`, async () => {
            await expect(basicData.sublocalityElement).toBeVisible()        
        })
    })

    test(`Verify user can't view Sublocality on a Location not eligible for uberall.sublocality.eligible.countries `, async ({ page }) => {
        const basicData = new LocationPage (page)
        
        await test.step(`Given admin user successfully logs in`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_ADMIN_USER_SUBLOCALITY, process.env.DM_ADMIN_PASSWORD)
        })

        await test.step(`When user navigates to a location without uberall.sublocality.eligible.countries`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_NO_SUBLOCALITY}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`Then user verifies Sublocality is not appearing on the Location Page`, async () => {
            await expect(basicData.sublocalityElement).not.toBeVisible()
        })
    })

    test(`Verify user can't view Sublocality on an Sales Partner not eligible for uberall.sublocality.eligible.salesPartners`, async ({ page }) => {
        const basicData = new LocationPage (page)
        
        await test.step(`Given admin user successfully logs in`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
        })

        await test.step(`And user navigates to a location without uberall.sublocality.eligible.countries`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_CATEGORY_TEST}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`Then user verifies Sublocality is not appearing on the Location Page`, async () => {
            await expect(basicData.sublocalityElement).not.toBeVisible()
        })
    })

    test(`Verify user without SUBLOCALITY on location_write can't modify the sublocality field`, async ({ page }) => {
        const basicData = new LocationPage (page)
        
        await test.step(`Given admin user successfully logs in`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
        })

        await test.step(`When user navigates to a location with uberall.sublocality.eligible.countries`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_SUBLOCALITY}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user verifies Sublocality is appearing on the Location Page`, async () => {
            await expect(basicData.sublocalityElement).toBeVisible()
        })

        await test.step(`Then user tries to modify the Sublocality field`, async () => {
            await expect(basicData.sublocalityField).toHaveClass('location-form-input read-only')
        })
    })

    test(`Verify user with SUBLOCALITY on location_write can modify the sublocality field`, async ({ page }) => {
        const basicData = new LocationPage (page)

        await test.step(`Given admin user successfully logs in`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_ADMIN_USER_SUBLOCALITY, process.env.DM_ADMIN_PASSWORD)
        })

        await test.step(`When user navigates to a location with uberall.sublocality.eligible.countries`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_SUBLOCALITY_PH}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user modifies Sublocality field and saves the changes`, async () => {
            await expect(basicData.sublocalityElement).toBeVisible()    
            await basicData.updateSublocality('Manila')
            await basicData.saveButton.click()
        })

        await test.step(`Then user verifies saving the value was successful`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })

        await test.step(`And user modifies reverts the Sublocality and saves the changes`, async () => {
            await basicData.updateSublocality('Laguna')
            await basicData.saveButton.click()
        })

        await test.step(`And user verifies saving the value was successful`, async () => {
            await expect(basicData.successMessage).toBeVisible()
        })
    })
})