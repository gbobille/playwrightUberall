import { APIRequestContext, expect, test } from "@playwright/test"
import { loginUberallAppAs } from "../../../utils/login-util"
import { listingsConfig } from "../listings.config"
import Menu from "../../../pages/listings/collections/menu"
import BaseCall from "../../../api/uberall/baseCall";

test.describe("Google Menu Publishing - PREREQS", { tag: '@lis_google_menu_run, @lis_google_run, @lis_regression_run'}, () => {
    test(`Assign menu to a location`, async () => {
        const apiUtils = new BaseCall()
        const userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.ADMIN_PASSWORD)

        const requestBodyJSON = {
            "locationIds": [3431035]
        }

        const requestBody = JSON.stringify(requestBodyJSON)
        const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        await apiUtils.patchRequest(apiContext, `/api/collections/${listingsConfig.LIS_AUTOMATION_MENU}?v=20220222&access_token=${userToken}`, requestBody)            
    })
})

test.describe("Google Menu Publishing - RUN", { tag: '@lis_google_menu_run, @lis_google_run, @lis_regression_run' }, () => {
    test.beforeEach("GIVEN admin user successfully logs in", async ({ page }) => {
        await loginUberallAppAs(page, listingsConfig.CHILD_ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    })

    test("Verify user can publish a Menu to Google", async ({ page }) => {
        const menu = new Menu(page)

        await test.step(`WHEN user is on the Menu page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/content-lists/collections/menu/${listingsConfig.LIS_AUTOMATION_MENU}`, { waitUntil: 'domcontentloaded' })
        })

        await test.step(`THEN user clicks the Update button to publish the menu`, async () => {
            await menu.updateButton.click()
        })
    })
})

test.describe("Google Menu Publishing - ASSERT", { tag: '@lis_google_menu_assert, @lis_google_assert, @lis_regression_assert' }, () => {
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
            const menu = directoryResponse.menus
            const expectedPrices = ["5", "7"]
            const expectedCurrencies = ["USD", "USD"]
            const expectedLabels = ["Popcorn Chicken", "Baked Potato"]

            let expectIndex = 0
            menu.forEach((section: any) => {
                expect(section.cuisines).toEqual(["AMERICAN"])
                const itemsPerSection = section.sections

                itemsPerSection.forEach((menuItem: any) => {
                    expect(menuItem.items[0].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[0].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[0].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex + 1
                })
            })
        })
    })

    test ("Remove the menu from the location to bring the location back to baseline", async ( {page} ) => {
        const apiUtils = new BaseCall()
        const userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.ADMIN_PASSWORD)

        const requestBodyJSON = {
            "locationIds": []
        }

        const requestBody = JSON.stringify(requestBodyJSON)
        const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")

        await apiUtils.patchRequest(apiContext, `/api/collections/${listingsConfig.LIS_AUTOMATION_MENU}?v=20220222&access_token=${userToken}`, requestBody)            
    })
})