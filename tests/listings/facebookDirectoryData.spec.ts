import {test} from '../setup'
import {LocationCall} from "../../api/uberall/locations/locationsCall"
import {ApiEnvironmentHelper} from "../../api/uberall/apiEnvironmentHelper"
import {FacebookPage} from "../../pages/listings/thirdParty/facebookPage"
import {LocationModel} from "../../models/listings/locationModel"
import {OpeningHoursModel} from "../../models/listings/locationOpeningHoursModel"
import {
    FormattedOpeningHours,
    OpeningHoursFormatterUtils
} from "../../utils/openingHourFormatterUtils"
import {MessageKeysCall} from "../../api/uberall/locations/messageKeysCall";
import {LocationCategoriesCall} from "../../api/uberall/locations/locationCategoriesCall";
import {DirectoryCompareService} from "../../utils/services/listings/directoryCompareService";
import {FacebookCompareService} from "../../utils/services/listings/facebookCompareService";

let locationCall: LocationCall
let messageKeysCall: MessageKeysCall
let locationCategoriesCall: LocationCategoriesCall
let locationData: any
let locationCategory: string
let locationCountry: string
let facebookPage: FacebookPage

const FACEBOOK_DIRECTORY = "FACEBOOK"
const LOCATION_ID = 3431035
const FACEBOOK_EMAIL = process.env.FACEBOOK_LOGIN_EMAIL
const FACEBOOK_PASSWORD = process.env.FACEBOOK_AUTHENTICATION_PASS
const PRIVATE_KEY: string = ApiEnvironmentHelper.get1098ChildPrivateKey()
const service = new FacebookCompareService(new DirectoryCompareService())
const formatterService = new OpeningHoursFormatterUtils()
/**
 * Listing URL redirects to Facebook automation prevention Page and the public Page needs to be called directly
 */
const listingUrl = "people/QA-Sync/100085839927821/"


test.beforeEach(async ({page}) => {
    locationCall = new LocationCall()
    messageKeysCall = new MessageKeysCall()
    locationCategoriesCall = new LocationCategoriesCall()
    facebookPage = new FacebookPage(page)
    locationData = await locationCall.getLocationMap(LOCATION_ID, PRIVATE_KEY)
    locationCountry = await messageKeysCall.getCountryCodeFromTranslation(locationData.response.location.country, PRIVATE_KEY)
    locationCategory = await locationCategoriesCall.getCategoryNameFromId(locationData.response.location.categories[0], PRIVATE_KEY, "en")
})

test.describe("Get and compare Facebook Listing Data", async () => {
    let facebookPageTextElements: LocationModel
    let facebookPageOpeningHours: OpeningHoursModel[]
    let formattedHours: FormattedOpeningHours[]

    test(`Compare Location Data with Facebook Listing Data @listings_production`, async ({page, step}) => {
        await step("Given: The user is on the Facebook Directory Page", async () => {
            await facebookPage.goto(`${FacebookPage.url}${listingUrl}`);
            await facebookPage.declineFacebookCookiesClick()
            await facebookPage.facebookLoginUser(FACEBOOK_EMAIL, FACEBOOK_PASSWORD)
            await facebookPage.isAt()
        })

        await step(`When: Extracting all Opening Hours facebook elements on the Main Page`, async () => {
            await facebookPage.openingHoursExpanderClick()
            facebookPageOpeningHours = await facebookPage.getOpeningHoursMap()
            formattedHours = formatterService.formatOpeningHours(facebookPageOpeningHours)
        })

        await step(`And: Extracting all relevant facebook elements on the contact page`, async () => {
            await facebookPage.goto(`${FacebookPage.url}${listingUrl}?sk=about`)
            await facebookPage.clickHideSidebarMenu()
            facebookPageTextElements = await facebookPage.getAllFacebookPageLocationElements()
        })

        await step(`Then: the location and Directory data should be identical`, async () => {
            service.checkFacebookLocationData(FACEBOOK_DIRECTORY, locationData, facebookPageTextElements, locationCategory, locationCountry, formattedHours)
        })
    })
})
