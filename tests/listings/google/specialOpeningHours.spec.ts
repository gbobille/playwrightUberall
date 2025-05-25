import { APIRequestContext, expect, test } from "@playwright/test"
import { loginUberallAppAs } from "../../../utils/login-util"
import { listingsConfig } from "../listings.config"
import LocationProfile from "../../../pages/listings/collections/locationProfile"
import BaseCall from "../../../api/uberall/baseCall"
import { getRandomFutureDate } from "../../../utils/randomFutureDateUtils"

test.describe("Google Special Opening Hours Publishing - RUN", { tag: '@lis_google_soh_run, @lis_google_run, @lis_regression_run' }, () => {

    test.beforeEach("GIVEN admin user successfully logs in", async ({ page }) => {
        await loginUberallAppAs(page, listingsConfig.CHILD_ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    })

    test("Verify user can publish Special Opening Hours to Google", async ({ page }) => {
        const locationProfile = new LocationProfile(page)

        await test.step(`WHEN user is on the Location Profile page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${listingsConfig.LIS_LOCATION_GOOGLE_PUBLISHING}/basic-data`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`AND user selects today's date and marks it as Closed`, async () => {
            await locationProfile.addSoh.click()
            await locationProfile.selectDays.click()
            await locationProfile.dateToday.click()
            await locationProfile.applyButton.click()
        })

        await test.step(`THEN user clicks the Save button`, async () => {
            await locationProfile.saveButton.click()
            await expect(locationProfile.successMessage).toBeVisible()
        })
    })
})

test.describe("Google Special Opening Hours - ASSERT", { tag: '@lis_google_soh_assert, @lis_google_assert, @lis_regression_assert' }, () => {
    const headers = {
        "cookie": process.env.COOKIE as string,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    test("Assert the responses from Google's API", async ({ page }) => {
        await test.step(`GIVEN user logs in to view the showDirectoryResponse`, async () => {
            await page.setExtraHTTPHeaders(headers)
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${listingsConfig.GOOGLE_LISTINGS_GOOGLE_PUBLISHING}`, { waitUntil: 'networkidle' })
        })

        await test.step(`THEN user verifies the updates sent are received by Google`, async () => {
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const specialHours = directoryResponse.specialHours
            const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }))
            const year = today.getFullYear()
            const month = today.getMonth() + 1 // Months are 0-indexed
            const day = today.getDate()

            const expectedSpecialHourPeriods = [
                {
                    endDate: { month: month, year: year, day: day },
                    closed: true,
                    startDate: { month: month, year: year, day: day },
                  },
            ]

            expect(specialHours).toEqual({ specialHourPeriods: expectedSpecialHourPeriods })

            specialHours.specialHourPeriods.forEach((period: any, index: number) => {
                expect(period.endDate).toEqual(expectedSpecialHourPeriods[index].endDate)
                expect(period.closed).toBe(true) // Assert that 'closed' is true
                expect(period.startDate).toEqual(expectedSpecialHourPeriods[index].startDate)
            })
        })
    })

        test ("Remove the Special Opening Hours from the location to bring the location back to baseline", async ( {page} ) => {
            const apiUtils = new BaseCall()
            const userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    
            const requestBodyJSON = {
                "specialOpeningHours": []
            }
    
            const requestBody = JSON.stringify(requestBodyJSON)
            const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
    
            await apiUtils.patchRequest(apiContext, `/api/locations/${listingsConfig.LIS_LOCATION_GOOGLE_PUBLISHING}?access_token=${userToken}`, requestBody)            
        })
})