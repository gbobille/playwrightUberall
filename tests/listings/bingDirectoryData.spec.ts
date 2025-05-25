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
import {BingMapsPage} from "../../pages/listings/thirdParty/bingMapsPage";
import {BingCompareService} from "../../utils/services/listings/bingCompareService";

let locationCall: LocationCall
let messageKeysCall: MessageKeysCall
let locationCategoriesCall: LocationCategoriesCall
let locationData: any
let listingUrl: string
let locationCategory: string
let locationCountry: string
let bingMapsPage: BingMapsPage

const BING_DIRECTORY = "BING"
const LOCATION_ID = 3431035
const PRIVATE_KEY: string = ApiEnvironmentHelper.get1098ChildPrivateKey()
const service = new BingCompareService(new DirectoryCompareService())
const formatterService = new OpeningHoursFormatterUtils()

test.beforeEach(async ({page}) => {
    locationCall = new LocationCall()
    messageKeysCall = new MessageKeysCall()
    locationCategoriesCall = new LocationCategoriesCall()
    bingMapsPage = new BingMapsPage(page)
    locationData = await locationCall.getLocationMap(LOCATION_ID, PRIVATE_KEY)
    locationCategory = await locationCategoriesCall.getCategoryNameFromId(locationData.response.location.categories[0], PRIVATE_KEY, "de")
    locationCountry = await messageKeysCall.getCountryCodeFromTranslation(locationData.response.location.country, PRIVATE_KEY)
    listingUrl = await locationCall.getLocationListingsUrl(LOCATION_ID, BING_DIRECTORY, PRIVATE_KEY)
})

test.describe("Get and compare Bing Listing Data", () => {
    let bingPageOpeningHours: OpeningHoursModel[]
    let formattedHours: FormattedOpeningHours[]
    let bingPageTextElements: LocationModel

    test(`Compare Location Data with Bing Listing Data @listings_production`, async ({page, step}) => {
        await step("Given: The user is on the Bing Maps Listing Page", async () => {
            await bingMapsPage.goto(`${listingUrl}`)
            await bingMapsPage.rejectBingCookiesClick()
            await bingMapsPage.isAt()
        })

        await step(`When: Extracting all relevant Bing elements on the Bing Search Page`, async () => {
            bingPageTextElements = await bingMapsPage.getAllBingPageLocationElements()
        })

        await step(`And: Extracting all relevant Bing Opening Hours and converts them into Location format`, async () => {
            await bingMapsPage.openingHoursExpanderClick()
            bingPageOpeningHours = await bingMapsPage.getOpeningHoursMap()
            formattedHours = formatterService.formatOpeningHours(bingPageOpeningHours)
        })

        await step(`Then: the Bing location and Directory data should be identical`, async () => {
            service.checkBingLocationData(BING_DIRECTORY, locationData, bingPageTextElements, locationCategory, locationCountry, formattedHours)
        })
    })
})
