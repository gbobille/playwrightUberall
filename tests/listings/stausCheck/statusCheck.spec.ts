import {test} from '../../setup'
import {WhitelabelStatusCheckPage} from '../../../pages/listings/statusCheck/whitelabelStatusCheckPage'
import {StatusCheck} from '../../../models/listings/statusCheckModel'
import {expect} from "@playwright/test";

let whitelistStatusCheckPage: WhitelabelStatusCheckPage

const statusCheckByUs = new Map<string, string>([
    ["country", "Germany"],
    ["name", "Smart NFT Cafe"],
    ["street", "Hussitenstraße 32-33"],
    ["zip", "13355"]
])
const statusCheckByOthers = new Map<string, string>([
    ["country", "Germany"],
    ["name", "Santorini"],
    ["street", "Cauerstraße 28"],
    ["zip", "10587"]
])
const STATUS_CHECK_VALUES1 = new StatusCheck(
    statusCheckByOthers.get("country") ?? "",
    statusCheckByOthers.get("name") ?? "",
    statusCheckByOthers.get("street") ?? "",
    statusCheckByOthers.get("zip") ?? ""
)
const STATUS_CHECK_VALUES2 = new StatusCheck(
    statusCheckByUs.get("country") ?? "",
    statusCheckByUs.get("name") ?? "",
    statusCheckByUs.get("street") ?? "",
    statusCheckByUs.get("zip") ?? ""
)

test.beforeEach(async ({page}) => {
    whitelistStatusCheckPage = new WhitelabelStatusCheckPage(page)
})

test.describe('Whitelabel Status Check', () => {

    test('Check for Listing managed by another Sales Partner @Listings_schedule', async ({step}) => {

        await step("Given: The user is on the Status Check Page", async () => {
            await whitelistStatusCheckPage.goto(WhitelabelStatusCheckPage.url)
        })

        await step(`When: Checking for Listing ${STATUS_CHECK_VALUES1.country}, ${STATUS_CHECK_VALUES1.name}, ${STATUS_CHECK_VALUES1.street}, ${STATUS_CHECK_VALUES1.zip}`, async () => {
            await whitelistStatusCheckPage.performStatusCheck(STATUS_CHECK_VALUES1)
        })

        await step("Then: The Listing is managed by Others and is represented by at least one Listing", async () => {
            const statusCheckValues = await whitelistStatusCheckPage.getAllDirectoriesManagedByOthers();
            expect(statusCheckValues.every(listing => listing.status && listing.type)).toBe(true);
            expect(statusCheckValues.some(listing => listing.status.includes(STATUS_CHECK_VALUES1.name))).toBe(true);
        })
    })

    test('Check for Listing managed by our Sales Partner @Listings_schedule', async ({step}) => {
        await step("Given: The user is on the Apple Maps Listing Page", async () => {
            await whitelistStatusCheckPage.goto(WhitelabelStatusCheckPage.url)
        })

        await step(`When: Checking for Listing ${STATUS_CHECK_VALUES2.country}, ${STATUS_CHECK_VALUES2.name}, ${STATUS_CHECK_VALUES2.street}, ${STATUS_CHECK_VALUES2.zip}`, async () => {
            await whitelistStatusCheckPage.performStatusCheck(STATUS_CHECK_VALUES2)
        })

        await step(`Then: The Listing Data is  ${STATUS_CHECK_VALUES2.name}, ${STATUS_CHECK_VALUES2.street} and ${STATUS_CHECK_VALUES2.zip} and is Managed by Us`, async () => {
            const statusCheckValues = await whitelistStatusCheckPage.getManagedListingInformation()
            expect(statusCheckValues.name).toBe(STATUS_CHECK_VALUES2.name)
            expect(statusCheckValues.street).toBe(STATUS_CHECK_VALUES2.street)
            expect(statusCheckValues.zip).toBe(STATUS_CHECK_VALUES2.zip)
            const managedListings = await whitelistStatusCheckPage.getDirectoryElementsManagedByUs()
            expect(managedListings.every(listing => listing.status && listing.type)).toBe(true)
        })
    })
})
