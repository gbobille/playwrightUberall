import { expect, test } from "@playwright/test";
import StoreLocator from "../../pages/lp/storeLocator";
import Map from "../../pages/lp/components/map"
import Utils from "../../utils/utils";

test.describe("Map Directives Regression Test", async () => {
    const utils = new Utils()
    const records = await utils.readDataFromCSV('tests/lp/testData/MapDirectives_Regression.csv')

    records.forEach(record => {
        //Update Browser's GeoLocation
        test.use({
            geolocation: {longitude: -97.5164, latitude: 35.4676},
            permissions: ['geolocation']
        })

        test(`Test #1: Browser geolocation ON + Default Search - Check that ${record.clientName} Locations are displayed on the map and on the resultsList @lp_regression`, async ({ page }) => {
            const map = new Map(page)

            await test.step(`Given user navigates to ${record.storeLocatorURL}`, async () => {
                await page.goto(`${record.storeLocatorURL}`, { waitUntil: 'networkidle' })
            })

            await test.step(`When user selects a location`, async () => {
                await map.clickResultsList(record.initialResults).click( {timeout: 40000} )
            })

            await test.step(`Then user verifies mapPopUp appears on the map`, async () => {
                await map.mapPopUpClass.click( {timeout: 40000} )
            })
        })

        test(`Test #2: Browser geolocation ON + loc_q Search - Check that ${record.clientName} Locations are displayed on the map and on the resultsList @lp_regression`, async ({ page }) => {
            const map = new Map(page)

            await test.step(`Given user navigates to ${record.loc_q}`, async () => {
                await page.goto(`${record.loc_q}`, { waitUntil: 'networkidle' })
            })

            await test.step(`When user selects a location`, async () => {
                await map.clickResultsList(record.loc_q_text).click( {timeout: 40000} )
            })

            await test.step(`Then user verifies mapPopUp appears on the map`, async () => {
                await map.mapPopUpClass.click( {timeout: 40000} )
            })
        })

        test(`Test #3: Browser geolocation ON + filter Search - Check that ${record.clientName} Locations are displayed on the map and on the resultsList @lp_regression`, async ({ page }) => {
            const map = new Map(page)

            await test.step(`Given user navigates to ${record.filter}`, async () => {
                await page.goto(`${record.filter}`, { waitUntil: 'networkidle' })
            })

            await test.step(`When user selects a location`, async () => {
                await map.clickResultsList(record.filter_text).click( {timeout: 40000} )
            })

            await test.step(`Then user verifies mapPopUp appears on the map`, async () => {
                await map.mapPopUpClass.click( {timeout: 40000} )
            })
        })

        test(`Test #4: Browser geolocation ON + tags Search - Check that ${record.clientName} Locations are displayed on the map and on the resultsList @lp_regression`, async ({ page }) => {
            const map = new Map(page)

            await test.step(`Given user navigates to ${record.tags}`, async () => {
                await page.goto(`${record.tags}`, { waitUntil: 'networkidle' })
            })

            await test.step(`When user selects a location`, async () => {
                await map.clickResultsList(record.tags_text).click( {timeout: 40000} )
            })

            await test.step(`Then user verifies mapPopUp appears on the map`, async () => {
                await map.mapPopUpClass.click( {timeout: 40000} )
            })
        })

        test(`Test #4: Browser geolocation ON + loc_q and filter Search - Check that ${record.clientName} Locations are displayed on the map and on the resultsList @lp_regression`, async ({ page }) => {
            const map = new Map(page)

            await test.step(`Given user navigates to ${record.loc_q_filter_url}`, async () => {
                await page.goto(`${record.loc_q_filter_url}`, { waitUntil: 'networkidle' })
            })

            await test.step(`When user selects a location`, async () => {
                await map.clickResultsList(record.loc_q_filter_text).click( {timeout: 40000} )
            })

            await test.step(`Then user verifies mapPopUp appears on the map`, async () => {
                await map.mapPopUpClass.click( {timeout: 40000} )
            })
        })

        test(`Test #5: Browser geolocation ON + loc_q and tags Search - Check that ${record.clientName} Locations are displayed on the map and on the resultsList @lp_regression`, async ({ page }) => {
            const map = new Map(page)

            await test.step(`Given user navigates to ${record.loc_q_filter_tags_url}`, async () => {
                await page.goto(`${record.loc_q_filter_tags_url}`, { waitUntil: 'networkidle' })
            })

            await test.step(`When user selects a location`, async () => {
                await map.clickResultsList(record.loc_q_filter_tags_text).click( {timeout: 40000} )
            })

            await test.step(`Then user verifies mapPopUp appears on the map`, async () => {
                await map.mapPopUpClass.click( {timeout: 40000} )
            })
        })

    })
})