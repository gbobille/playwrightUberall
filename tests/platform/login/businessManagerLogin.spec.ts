import {test} from '../../setup'
import {expect} from "@playwright/test"
import UserCall from "../../../api/uberall/platform/userCall"
import {Business, BusinessDetails, Location, LocationDetails} from "../../testData/staticTestData"
import {DashboardPage} from "../../../pages/base/dashboardPage"
import Login from "../../../pages/components/login"
import Locations from "../../../pages/datamanagement/locationsList"
import LocationOnboardingPage from "../../../pages/base/onboardingPage"
import BusinessPage from "../../../pages/business/businessPage";
import {Header} from "../../../pages/components/header/baseheader";
import AddNewLocation from "../../../pages/datamanagement/contentCollections/addNewLocationPage";
import HomePage from '../../../pages/innovation/homepage/homepage'

let login: Login
let onboardingPage: LocationOnboardingPage
let locationPage: Locations
let businessPage: BusinessPage
let dashboardPage: DashboardPage
let homePage: HomePage
let header: Header
let locationsPage: Locations
let addNewLocationPage: AddNewLocation
const USER1 = "business_manager_with_two_businesses@uberall.com"
const USER2 = "business_manager_with_one_business_one_location@uberall.com"

const BUSINESS1 = Business.BUS_UB25983
const LOCATION1 = Location.LOC_UB25983A
const LOCATION2 = Location.LOC_UB25983B
const BUSINESS2 = Business.BUS_UB24562
const LOCATION3 = Location.LOC_UB24562


test.beforeEach(async ({page}) => {
    login = new Login(page)
    onboardingPage = new LocationOnboardingPage(page)
    locationPage = new Locations(page)
    businessPage = new BusinessPage(page)
    dashboardPage = new DashboardPage(page)
    homePage = new HomePage(page)
    header = new Header(page)
    locationsPage = new Locations(page)
    addNewLocationPage = new AddNewLocation(page)
})

test.beforeAll(async () => {
    await UserCall.ensureBusinessManager(USER1, [BusinessDetails[BUSINESS1].id, BusinessDetails[BUSINESS2].id])
    await UserCall.ensureBusinessManager(USER2, [BusinessDetails[BUSINESS2].id])
})

test.describe("Check Business_Manager User Rights with multiple Businesses and locations", { tag: '@Platform' }, () => {

    test(`Check that Business Manager has the correct access rights`, async ({step}) => {

        await step(`Given ${USER1} Logs in`, async () => {
            await login.goto()
            await login.userLogin(USER1)
        })

        await step(`When ${USER1} navigates to the locationsPage`, async () => {
            await locationsPage.goTo()
        })

        await step(`then all three of the users locations are shown`, async () => {
            await locationPage.validateOneLocationIsRetrieved(LOCATION1 as string)
            await locationPage.validateOneLocationIsRetrieved(LOCATION2 as string)
            await locationPage.validateOneLocationIsRetrieved(LOCATION3 as string)
        })

        await step(`and the option to add new locations is shown but the import option is not available`, async () => {
            await expect(locationPage.fileImportButton).toBeHidden()
            await expect(locationPage.addLocationButton).toBeVisible()
        })

        await step(`When ${USER1} is on the Accounts Page`, async () => {
            await businessPage.goto()
        })

        await step(`then all three of the users locations are shown`, async () => {
            await expect(businessPage.accountNameDetailLink(BUSINESS1 as string)).toBeVisible()
            await expect(businessPage.accountNameDetailLink(BUSINESS2 as string)).toBeVisible()
            await expect(businessPage.addAccountBtn).toBeHidden()
        })
    })
})

test.describe("Check Business_Manager User Rights with one Business and one location", { tag: '@Platform' }, () => {

    test(`Check that Business Manager has the correct access rights`, async ({page, step}) => {

        await step(`Given ${USER2} logs in`, async () => {
            await login.goto()
            await login.loginSkipLandingValidation(USER2)
            await onboardingPage.isAt()
        })

        await step(`When The User submits the Onboarding Page`, async () => {
            await onboardingPage.submitOnboardingPage()
        })

        await step(`Then The User lands either on the Dashboard or HomePage`, async () => {
            const isAtDashboardOrHome = await Promise.race([
                dashboardPage.isAt().then(() => true).catch(() => false),
                homePage.isAt().then(() => true).catch(() => false)
            ])

            expect(isAtDashboardOrHome).toBe(true)
        })

        await step(`When The User submits the LocationDashboard Page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationDetail${LocationDetails[LOCATION3].id}/dashboard`,
                {waitUntil: 'domcontentloaded'})
        })

        await step(`And when The User clicks on the Header Location Add Button`, async () => {
            await header.addLocationHeaderButton.click()
        })

        await step(`Then The User lands either on the Add Locations Page`, async () => {
            await addNewLocationPage.isAt()
        })
    })
})

test.afterAll(async () => {
    await UserCall.deleteUser(USER1)
    await UserCall.deleteUser(USER2)
})

