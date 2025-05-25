import {test} from '../../setup'
import {expect} from "@playwright/test"
import Login from "../../../pages/components/login"
import {UserSettingsPage} from "../../../pages/users/usersSettingsPage"
import {Header} from "../../../pages/components/header/baseheader"
import UserCall from "../../../api/uberall/platform/userCall"
import DashboardPage from "../../../pages/base/dashboardPage"
import HomePage from '../../../pages/innovation/homepage/homepage'


const ADMIN_PASSWORD = process.env.AUTHENTICATION_PASS || ''

let login: Login
let userSettingsPage: UserSettingsPage
let header: Header
let dashboardPage: DashboardPage
let homePage: HomePage

test.describe('Successful Password change Settings', {tag: '@Platform'}, () => {
    const USER = 'valid_password_spec@uberall.com'
    const newPassword = 'Password123'

    test.beforeEach(async ({page}) => {
        login = new Login(page)
        await UserCall.deleteUser(USER)
        userSettingsPage = new UserSettingsPage(page)
        header = new Header(page)
        dashboardPage = new DashboardPage(page)
        homePage = new HomePage(page)
        await UserCall.ensureAdminUser(USER)
    })

    test('Successful password change', async ({step}) => {
        await step('Given user is on the settings page', async () => {
            await login.goto()
            await login.userLogin(USER)
            await userSettingsPage.goto()
        })

        await step('When user enters valid passwords and saves', async () => {
            await userSettingsPage.addPasswords(
                ADMIN_PASSWORD,
                newPassword,
                newPassword
            )
            await userSettingsPage.newPassword.click()
            await userSettingsPage.saveUser()
        })

        await step('Then no error messages are displayed and the User is saved', async () => {
            const hasCurrentPasswordError = await userSettingsPage.isCurrentPasswordError()
            const hasNewPasswordError = await userSettingsPage.isNewPasswordError()
            const hasNewPasswordRepeatError = await userSettingsPage.isNewPasswordRepeatError()

            expect(hasCurrentPasswordError).toBeFalsy()
            expect(hasNewPasswordError).toBeFalsy()
            expect(hasNewPasswordRepeatError).toBeFalsy()
            await userSettingsPage.isPasswordChanged()
        })

        await step('When user tries to log in with the new password', async () => {
            await header.logout()
            await login.userLogin(USER, newPassword)
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