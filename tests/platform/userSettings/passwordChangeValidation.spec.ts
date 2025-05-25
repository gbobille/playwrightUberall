import {test} from '../../setup'
import {expect} from "@playwright/test"
import Login from "../../../pages/components/login"
import {UserSettingsPage} from "../../../pages/users/usersSettingsPage"
import UserCall from "../../../api/uberall/platform/userCall"

type PasswordTestCase = {
    name: string
    email: string
    currentPassword: string
    newPassword: string
    newPasswordRepeat: string
    assertions: {
        userChangeError: boolean
        currentPasswordError: boolean
        newPasswordError: boolean
        newPasswordRepeatError: boolean
    }
}

const ADMIN_PASSWORD = process.env.AUTHENTICATION_PASS || ''

const failingTestData: PasswordTestCase[] = [
    {
        name: 'Short new password',
        email: 'short_new_password_spec@uberall.com',
        currentPassword: ADMIN_PASSWORD,
        newPassword: 'pass',
        newPasswordRepeat: 'pass',
        assertions: {
            userChangeError: false,
            currentPasswordError: false,
            newPasswordError: true,
            newPasswordRepeatError: true
        }
    },
    {
        name: 'Different new passwords',
        email: 'different_new_passwords_spec@uberall.com',
        currentPassword: ADMIN_PASSWORD,
        newPassword: 'Password123',
        newPasswordRepeat: 'Password1234',
        assertions: {
            userChangeError: true,
            currentPasswordError: false,
            newPasswordError: false,
            newPasswordRepeatError: false
        }
    },
    {
        name: 'Empty new password',
        email: 'empty_new_password_spec@uberall.com',
        currentPassword: ADMIN_PASSWORD,
        newPassword: '',
        newPasswordRepeat: '',
        assertions: {
            userChangeError: false,
            currentPasswordError: false,
            newPasswordError: true,
            newPasswordRepeatError: true
        }
    }
]

let login: Login
let userSettingsPage: UserSettingsPage

for (const data of failingTestData) {
    test.describe(`Password Settings - ${data.name}`, {tag: '@Platform'}, () => {
        test.beforeEach(async ({page}) => {
            login = new Login(page)
            userSettingsPage = new UserSettingsPage(page)
            await UserCall.ensureAdminUser(data.email)
        })

        test(`Test ${data.name} change`, async ({step}) => {
            await step('Given user is on the settings page', async () => {
                await login.goto()
                await login.userLogin(data.email)
                await userSettingsPage.goto()
            })

            await step(`When user enters ${data.name} and saves`, async () => {
                await userSettingsPage.addPasswords(
                    data.currentPassword,
                    data.newPassword,
                    data.newPasswordRepeat
                )
                await userSettingsPage.saveUser()
            })

            await step('Then appropriate error messages are displayed', async () => {
                const hasCurrentPasswordError = await userSettingsPage.isCurrentPasswordError(data.assertions.currentPasswordError)
                const hasNewPasswordError = await userSettingsPage.isNewPasswordError(data.assertions.newPasswordError)
                const hasNewPasswordRepeatError = await userSettingsPage.isNewPasswordRepeatError(data.assertions.newPasswordRepeatError)
                const hasUserChangeError = await userSettingsPage.isUserChangeError(data.assertions.userChangeError)

                expect(hasCurrentPasswordError).toBe(data.assertions.currentPasswordError)
                expect(hasNewPasswordError).toBe(data.assertions.newPasswordError)
                expect(hasNewPasswordRepeatError).toBe(data.assertions.newPasswordRepeatError)
                expect(hasUserChangeError).toBe(data.assertions.userChangeError)
            })
        })

        test.afterEach(async () => {
            await UserCall.deleteUser(data.email)
        })
    })
}