import {test} from '../setup'
import {LocationCall} from "../../api/uberall/locations/locationsCall"
import {ApiEnvironmentHelper} from "../../api/uberall/apiEnvironmentHelper"
import {LocationModel} from "../../models/listings/locationModel"
import {DirectoryCompareService} from "../../utils/services/listings/directoryCompareService"
import {
    FormattedOpeningHours,
    OpeningHoursFormatterUtils
} from "../../utils/openingHourFormatterUtils"
import {OpeningHoursModel} from "../../models/listings/locationOpeningHoursModel"
import {GoogleMapsPage} from "../../pages/listings/thirdParty/googleMapsPage"
import {MessageKeysCall} from "../../api/uberall/locations/messageKeysCall"
import {LocationCategoriesCall} from "../../api/uberall/locations/locationCategoriesCall"
import {GoogleCompareService} from "../../utils/services/listings/googleCompareService"

let locationCall: LocationCall
let messageKeysCall: MessageKeysCall
let locationCategoriesCall: LocationCategoriesCall
let locationData: any
let listingUrl: string
let locationCategory: string
let locationCountry: string
let googleMapsPage: GoogleMapsPage

const GOOGLE_DIRECTORY = "GOOGLE"
const LOCATION_ID = 20
const PRIVATE_KEY: string = ApiEnvironmentHelper.get30PrivateKey()
const service = new GoogleCompareService(new DirectoryCompareService())
const formatterService = new OpeningHoursFormatterUtils()

test.beforeEach(async ({page}) => {
    locationCall = new LocationCall()
    messageKeysCall = new MessageKeysCall()
    locationCategoriesCall = new LocationCategoriesCall()
    googleMapsPage = new GoogleMapsPage(page)
    locationData = await locationCall.getLocationMap(LOCATION_ID, PRIVATE_KEY)
    locationCategory = await locationCategoriesCall.getCategoryNameFromId(locationData.response.location.categories[0], PRIVATE_KEY, "de")
    locationCountry = await messageKeysCall.getCountryCodeFromTranslation(locationData.response.location.country, PRIVATE_KEY)
    listingUrl = await locationCall.getLocationListingsUrl(LOCATION_ID, GOOGLE_DIRECTORY, PRIVATE_KEY)
})

test.describe("Get and compare Google Listing Data", () => {
    let googlePageOpeningHours: OpeningHoursModel[]
    let formattedHours: FormattedOpeningHours[]
    let googlePageTextElements: LocationModel

    console.log("googleDirectoryData.spec is ignored because of the current Google Captcha")
    test.skip(`Compare Location Data with Google Listing Data @listings_production`, async ({ step}) => {
        await step("Given: The user is on the Google Maps Listing Page", async () => {
            await googleMapsPage.goto(`${listingUrl}&hl=de&gl=DE`)
            await googleMapsPage.acceptGoogleCookiesClick()
            await googleMapsPage.isAt()
        })

        await step(`When: Extracting all relevant Google elements on the Google Search Page`, async () => {
            googlePageTextElements = await googleMapsPage.getAllGooglePageLocationElements()
        })

        await step(`And: Extracting all relevant Google Opening Hours and converts them into Location format`, async () => {
            await googleMapsPage.openingHoursExpanderClick()
            googlePageOpeningHours = await googleMapsPage.getOpeningHoursMap()
            formattedHours = formatterService.formatOpeningHours(googlePageOpeningHours)
        })

        await step(`Then: the Google location and Directory data should be identical`, async () => {
            service.checkGoogleLocationData(GOOGLE_DIRECTORY, locationData, googlePageTextElements, locationCategory, locationCountry, formattedHours)
        })
    })
})
