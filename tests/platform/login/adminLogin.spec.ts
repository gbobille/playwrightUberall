import {PageManager} from "../../../pages/pageManager"
import {DashboardPage} from "../../../pages/base/dashboardPage"
import Login from "../../../pages/components/login"
import {test} from '../../setup'
import {expect} from "@playwright/test"
import UserCall from "../../../api/uberall/platform/userCall"
import HomePage from "../../../pages/innovation/homepage/homepage"

let pageManager: PageManager
let homePage: HomePage
let dashboardPage: DashboardPage
const USER = "admin_login_spec@uberall.com"
const ADMIN_PASSWORD = process.env.AUTHENTICATION_PASS as string

test.beforeEach(async ({page}) => {
    pageManager = new PageManager(page)
    homePage = new HomePage(page)
    dashboardPage = new DashboardPage(page)
    await UserCall.ensureAdminUser(USER)
})

test.describe("Log in As User", { tag: '@Platform' }, () => {

    test(`Log in as an ${USER} and Check that the login was successful @Platform`, async ({page, step}) => {
        await step("Given The user is on the Login Page", async () => {
            await new Login(page).goto()
        })

        await step(`When ${USER} logs in on the login Page`, async () => {
            await pageManager.login().loginSkipLandingValidation(USER, ADMIN_PASSWORD)
        })

        await step(`Then ${USER} is logged in`, async () => {
            const isAtDashboardOrHome = await Promise.race([
                dashboardPage.isAt().then(() => true).catch(() => false),
                homePage.isAt().then(() => true).catch(() => false)
            ])

            expect(isAtDashboardOrHome).toBe(true)
        })
    })

    test.afterEach(async () => {
        await UserCall.deleteUser(USER)
    })
})
