import {test} from '../../setup'
import {expect} from "@playwright/test"
import UserCall from "../../../api/uberall/platform/userCall"
import {Business, BusinessDetails, Location} from "../../testData/staticTestData"
import Login from "../../../pages/components/login"
import Locations from "../../../pages/datamanagement/locationsList"
import BusinessPage from "../../../pages/business/businessPage";

let login: Login
let locationPage: Locations
let businessPage: BusinessPage
let locationsPage: Locations

const USER = "multi_account_manager_login_spec@uberall.com"
const BUSINESS1 = Business.BUS_UB25983
const LOCATION1 = Location.LOC_UB25983A

test.beforeEach(async ({page}) => {
    login = new Login(page)
    locationPage = new Locations(page)
    businessPage = new BusinessPage(page)
    locationsPage = new Locations(page)
})

test.beforeAll(async () => {
    await UserCall.ensureMultiBusinessManager(USER, [BusinessDetails[BUSINESS1].id])
})

test.describe("Check Multi-Business_Manager User Rights with one Businesses and multiple locations", {tag: '@Platform'}, () => {

    test(`Check that Multi-Business Manager has the correct access rights`, async ({step}) => {

        await step(`Given ${USER} Logs in`, async () => {
            await login.goto()
            await login.userLogin(USER)
        })

        await step(`When ${USER} navigates to the locationsPage`, async () => {
            await locationsPage.goTo()
        })

        await step(`then the users location is shown`, async () => {
            await locationPage.validateOneLocationIsRetrieved(LOCATION1 as string)
        })

        await step(`and the option to add new locations is shown and the import option is available`, async () => {
            await locationPage.locationImportIsDisplayed()
            await expect(locationPage.addLocationButton).toBeVisible()
        })

        await step(`When ${USER} is on the Accounts Page`, async () => {
            await businessPage.goto()
        })

        await step(`then the users Businesses is shown`, async () => {
            await expect(businessPage.accountNameDetailLink(BUSINESS1 as string)).toBeVisible()
        })

        await step(`and the Option to create a new Business is present`, async () => {
            await expect(businessPage.addAccountBtn).toBeVisible()
        })
    })
})

test.afterAll(async () => {
    await UserCall.deleteUser(USER)
})
