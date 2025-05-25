import {test} from '../../setup'
import {expect} from "@playwright/test"
import UserCall from "../../../api/uberall/platform/userCall"
import {Business, BusinessDetails, Location, LocationDetails} from "../../testData/staticTestData"
import {DashboardPage} from "../../../pages/base/dashboardPage"
import Login from "../../../pages/components/login"
import Locations from "../../../pages/datamanagement/locationsList"
import LocationOnboardingPage from "../../../pages/base/onboardingPage"
import HomePage from '../../../pages/innovation/homepage/homepage'

let login: Login
let onboardingPage: LocationOnboardingPage
let locationPage: Locations
let dashboardPage: DashboardPage
let homePage: HomePage

const USER1 = "location_manager_with_two_locations@uberall.com"
const BUSINESS1 = Business.BUS_UB25983
const LOCATION1 = Location.LOC_UB25983A
const LOCATION2 = Location.LOC_UB25983B

const USER2 = "location_manager_with_one_locations@uberall.com"
const BUSINESS2 = Business.BUS_UB24562
const LOCATION3 = Location.LOC_UB24562


test.beforeEach(async ({page}) => {
    login = new Login(page)
    onboardingPage = new LocationOnboardingPage(page)
    locationPage = new Locations(page)
    dashboardPage = new DashboardPage(page)
    homePage = new HomePage(page)
})

test.beforeAll(async () => {
    await UserCall.ensureLocationManager(USER1, BusinessDetails[BUSINESS1].id,
        [LocationDetails[LOCATION1].id, LocationDetails[LOCATION2].id])

    await UserCall.ensureLocationManager(USER2, BusinessDetails[BUSINESS2].id,
        [LocationDetails[LOCATION3].id])
})
//TODO add sidebar checks after Sidebar module implementation

test.describe("Check Location_Manager User Rights with multiple locations", { tag: '@Platform' }, () => {

    test(`Log in as an Multi Location Manager and Check that it has the correct access rights `, async ({step}) => {

        await step(`Given ${USER1} is on the Login Page`, async () => {
            await login.goto()
        })

        await step(`When ${USER1} logs in on the login Page`, async () => {
            await login.userLogin(USER1)
        })

        await step(`and navigates to the locationsPage`, async () => {
            await locationPage.goTo()
        })

        await step(`then both of the users locations are shown`, async () => {
            await locationPage.validateOneLocationIsRetrieved(LOCATION1 as string)
            await locationPage.validateOneLocationIsRetrieved(LOCATION2 as string)
        })

        await step(`and the option to add ne locations is not shown`, async () => {
            await expect(locationPage.addLocationButton).toBeHidden()
        })
    })
})

test.describe("Check Location_Manager User Rights with one location", { tag: '@Platform' }, () => {

    test(`Log in as an Single Location Manager and Check that it has the correct access rights`, async ({step}) => {

        await step(`Given ${USER2} is on the Login Page`, async () => {
            await login.goto()
        })

        await step(`When ${USER2} logs in on the login Page`, async () => {
            await login.loginSkipLandingValidation(USER2)
        })

        await step(`Then ${USER2} is logged in on the OnboardingPage`, async () => {
            expect(await onboardingPage.isAt()).toBe(true)
        })

        await step(`When ${USER2} submits the Onboarding Page`, async () => {
            await onboardingPage.submitOnboardingPage()
        })

        await step(`Then ${USER2} lands either on the Dashboard or HomePage`, async () => {
            const isAtDashboardOrHome = await Promise.race([
                dashboardPage.isAt().then(() => true).catch(() => false),
                homePage.isAt().then(() => true).catch(() => false)
            ])

            expect(isAtDashboardOrHome).toBe(true);
        })
    })
})

test.afterAll(async () => {
    await UserCall.deleteUser(USER1)
    await UserCall.deleteUser(USER2)
})

