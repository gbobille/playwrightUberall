import { expect, test } from "@playwright/test";
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig }  from "../dataManagement.config";
import ProfileSuggestion from "../../../pages/datamanagement/singleLocationProfile/profileSuggestionPage"

test.describe(`Profile Suggestions are appearing on the Profile Suggestion Page`, () => {

    test.beforeEach("Given user successfully logs in and navigates to the Profile Suggestion page", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.DM_SP4100_ADMIN, process.env.ADMIN_PASSWORD)
        await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_SP4100_LOCATION}/datareview`, { waitUntil: 'domcontentloaded' })
    })

    test("Verify user can view suggestions from Google on the Location's Profile Suggestion Page", async ({ page }) => {
        const profileSuggestion = new ProfileSuggestion (page)
        
        await test.step(`When user clicks a Google Photo Suggestion`, async () => {
            await profileSuggestion.googlePhotoSuggestion.click()
        })

        await test.step(`Then user verifies a photo is loading`, async () => {
            await expect(profileSuggestion.googlePhotoExpanded).toBeVisible()
        })
    })
})