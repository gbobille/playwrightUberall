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
import {MessageKeysCall} from "../../api/uberall/locations/messageKeysCall";
import {LocationCategoriesCall} from "../../api/uberall/locations/locationCategoriesCall";
import {AppleMapsPage} from "../../pages/listings/thirdParty/appleMapsPage";
import {AppleCompareService} from "../../utils/services/listings/appleCompareService";

let locationCall: LocationCall
let messageKeysCall: MessageKeysCall
let locationCategoriesCall: LocationCategoriesCall
let locationData: any
let listingUrl: string
let locationCategory: string
let locationCountry: string
let appleMapsPage: AppleMapsPage

const YELP_DIRECTORY = "APPLE_MAPS"
const LOCATION_ID = 3431035
const PRIVATE_KEY: string = ApiEnvironmentHelper.get1098ChildPrivateKey()
const service = new AppleCompareService(new DirectoryCompareService())
const formatterService = new OpeningHoursFormatterUtils()

test.beforeEach(async ({page}) => {
    locationCall = new LocationCall()
    messageKeysCall = new MessageKeysCall()
    locationCategoriesCall = new LocationCategoriesCall()
    appleMapsPage = new AppleMapsPage(page)
    locationData = await locationCall.getLocationMap(LOCATION_ID, PRIVATE_KEY)
    locationCategory = await locationCategoriesCall.getCategoryNameFromId(locationData.response.location.categories[0], PRIVATE_KEY, "de")
    locationCountry = await messageKeysCall.getCountryCodeFromTranslation(locationData.response.location.country, PRIVATE_KEY)
    listingUrl = await locationCall.getLocationListingsUrl(LOCATION_ID, YELP_DIRECTORY, PRIVATE_KEY)
})

test.describe("Get and compare Apple Listing Data", () => {
    let applePageOpeningHours: OpeningHoursModel[]
    let formattedHours: FormattedOpeningHours[]
    let applePageTextElements: LocationModel

    test(`Compare Location Data with Apple Listing Data @listings_production`, async ({page, step}) => {
        await step("Given: The user is on the Apple Maps Listing Page", async () => {
            await appleMapsPage.goto(`${listingUrl}`)
            await appleMapsPage.isAt()
        })

        await step(`When: Extracting all relevant Apple elements on the Apple Search Page`, async () => {
            applePageTextElements = await appleMapsPage.getAllApplePageLocationElements()
        })

        await step(`And: Extracting all relevant Apple Opening Hours and converts them into Location format`, async () => {
            await appleMapsPage.openingHoursExpanderClick()
            applePageOpeningHours = await appleMapsPage.getOpeningHoursMap()
            formattedHours = formatterService.formatOpeningHours(applePageOpeningHours)
        })

        await step(`Then: the Apple location and Directory data should be identical`, async () => {
            service.checkAppleLocationData(YELP_DIRECTORY, locationData, applePageTextElements, locationCategory, locationCountry, formattedHours)
        })
    })
})
