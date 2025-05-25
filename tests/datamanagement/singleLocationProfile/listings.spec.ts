import { expect, test } from "@playwright/test";
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig } from "../dataManagement.config";
import LocationListings from "../../../pages/datamanagement/singleLocationProfile/listingsPage"

test.describe(`Listings Page - Verify Listings are Connected`, { tag: '@dm_regression' }, () => {
    test("Verify Facebook listing is connected to location", async ({ page }) => {
        const locationListings = new LocationListings(page)

        await test.step(`When user logins and navigates to a location with Facebook connection`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationDetail/${dataManagementConfig.DM_FACEBOOK_LISTING}/listings`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user checks for Facebook connectivity`, async () => {
            await expect(locationListings.facebookText).toBeVisible()
            await locationListings.openFacebook.click()
        })

        await test.step(`Then user verifies the correct Facebook page is opened`, async () => {
            const pagePromise = page.waitForEvent('popup')
            const facebook = await pagePromise
            await expect(facebook).toHaveURL(/https:\/\/(www|web)\.facebook\.com\/people\/Brownie-Encino\/100090111720936\//);
        })
    })

    test("Verify Instagram listing is connected to location", async ({ page }) => {
        const locationListings = new LocationListings(page)

        await test.step(`When user logins and navigates to a location with Instagram connection`, async () => {
            await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationDetail/${dataManagementConfig.DM_INSTAGRAM_LISTING}/listings`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`And user checks for Instagram connectivity`, async () => {
            await expect(locationListings.instagramText).toBeVisible()
            await locationListings.openInstagram.click()
        })

        await test.step(`Then user verifies the correct Instagram page is opened`, async () => {
            const pagePromise = page.waitForEvent('popup')
            const instagram = await pagePromise
            await expect(instagram).toHaveURL('https://www.instagram.com/explore/locations/449579854915318/')
        })
    })
})
