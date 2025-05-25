import {test} from '../../setup'
import {expect} from '@playwright/test'
import StatusCheckCall from "../../../api/uberall/listings/statusCheckCall"
import {StatusCheck} from "../../../models/listings/statusCheckModel"

let statusCheckCall: StatusCheckCall
let directorySearchData: any

const statusCheckByUs = new Map<string, string>([
    ["country", "DE"],
    ["name", "Smart NFT Cafe"],
    ["street", "Hussitenstraße 32-33"],
    ["zip", "13355"]
])
const statusCheckByOthers = new Map<string, string>([
    ["country", "DE"],
    ["name", "Santorini"],
    ["street", "Cauerstraße 28"],
    ["zip", "10587"]
])
const STATUS_CHECK_VALUES1 = new StatusCheck(
    statusCheckByUs.get("country") ?? "",
    statusCheckByUs.get("name") ?? "",
    statusCheckByUs.get("street") ?? "",
    statusCheckByUs.get("zip") ?? ""
)
const STATUS_CHECK_VALUES2 = new StatusCheck(
    statusCheckByOthers.get("country") ?? "",
    statusCheckByOthers.get("name") ?? "",
    statusCheckByOthers.get("street") ?? "",
    statusCheckByOthers.get("zip") ?? ""
)

const STATUS_CHECK_REQUIRED_FIELDS = new Set([
    "addressDisplay", "addressDisplayStatus", "addressExtra", "addressExtraStatus", "attributes", "attributesStatus",
    "attributionStatus", "brandsStatus", "categories", "categoriesStatus", "cellphoneStatus", "city", "cityStatus",
    "claimStatus", "contentListsStatus", "country", "countryStatus", "dateCreated", "descriptionLong",
    "descriptionLongStatus", "descriptionShortStatus", "directoryType", "doctorCategoriesStatus", "email", "emailStatus",
    "evDataStatus", "faxStatus", "imprintStatus", "isPublishedStatus", "keywordsStatus", "languagesStatus", "lat",
    "latStatus", "legalIdentStatus", "listingId", "listingUrl", "lng", "lngStatus", "moreHoursStatus", "name",
    "nameDescriptorStatus", "nameStatus", "npi", "npiStatus", "numberOfRatings", "numberOfRatingsStatus", "openingDateStatus",
    "openingHours", "openingHoursNotesStatus", "openingHoursStatus", "paymentOptionsStatus", "phone", "phoneStatus", "photos",
    "photosStatus", "provinceStatus", "rating", "ratingStatus", "serviceAreasStatus", "servicesStatus", "socialPostStatus",
    "socialProfiles", "socialProfilesStatus", "specialOpeningHours", "specialOpeningHoursStatus", "street", "streetAndNo",
    "streetAndNoStatus", "streetNo", "streetNoStatus", "streetStatus", "streetTypeStatus", "syncStatus", "taxNumberStatus",
    "transactionLinksStatus", "videosStatus", "website", "websiteExtra", "websiteExtraStatus", "websiteStatus", "zip", "zipStatus",
    "transactionLinks", "sublocality", "sublocalityStatus","customFieldsStatus"
])

test.beforeEach(async () => {
    statusCheckCall = new StatusCheckCall()
})

test.describe('Whitelabel Status Check via API', () => {

    const testCases = [
        {statusCheckValues: STATUS_CHECK_VALUES1, description: 'Listing managed by US'},
        {statusCheckValues: STATUS_CHECK_VALUES2, description: 'Listing managed by OTHER'}
    ]

    for (const {statusCheckValues, description} of testCases) {
        test(`Check for ${description} @Listings_schedule`, async ({step}) => {
            let unexpectedFields: Set<string>
            let missingFields: Set<string>

            await step(`Checking for Listing ${statusCheckValues} via the API`, async () => {
                const statusCheckResult = await statusCheckCall.performStatusCheck(statusCheckValues)
                directorySearchData = await statusCheckCall.getDirectorySearchData("BING", statusCheckResult.token, statusCheckResult.id)
            })

            await step(`When: retrieving all Directory info for Bing`, async () => {
                unexpectedFields = new Set(Object.keys(directorySearchData.response.result ?? {}).filter(field => !STATUS_CHECK_REQUIRED_FIELDS.has(field)))
                missingFields = new Set([...STATUS_CHECK_REQUIRED_FIELDS].filter(field => !Object.keys(directorySearchData.response.result ?? {}).includes(field)))
            })

            await step("Then: The response is Successful and there are no missing and no unexpected fields", async () => {
                expect(directorySearchData.status).toBe("SUCCESS")
                expect(missingFields.size).toBe(0)
                expect(unexpectedFields.size).toBe(0)
            })
        })
    }
})
