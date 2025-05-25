import {Locator, Page} from '@playwright/test'
import {UserDetailsComponent} from '../components/users/userDetails'
import {EmailNotificationComponent} from "../components/users/emailNotifications";

class UserSettingsPage {
    static url = `/en/app/uberall/settings/users`
    page: Page
    activeSessions: Locator
    saveUserBtn: Locator
    currentPassword: Locator
    newPassword: Locator
    newPasswordRepeat: Locator
    successIcon: Locator
    errorIcon: Locator
    currentPasswordErrorMessage: Locator
    newPasswordErrorMessage: Locator
    confirmNewPasswordErrorMessage: Locator
    userDetails: UserDetailsComponent
    notifications: EmailNotificationComponent

    constructor(page: Page) {
        this.page = page
        this.activeSessions = page.locator("//div[@class='active-sessions-inner']")
        this.saveUserBtn = page.locator("//button[@data-testid= 'save-changes-bar-save-button']")
        this.currentPassword = page.locator('#currentPassword')
        this.newPassword = page.locator('#newPassword')
        this.newPasswordRepeat = page.locator('#newPasswordRepeat')
        this.successIcon = page.locator('.test-notification-success-icon')
        this.errorIcon = page.locator('.test-notification-error-icon')
        this.currentPasswordErrorMessage = page.locator('input#currentPassword:has(+ div.custom-error-tooltip)')
        this.newPasswordErrorMessage = page.locator('input#newPassword:has(+ div.custom-error-tooltip)')
        this.confirmNewPasswordErrorMessage = page.locator('input#newPasswordRepeat:has(+ div.custom-error-tooltip)')
        this.userDetails = new UserDetailsComponent(page)
        this.notifications = new EmailNotificationComponent(page)
    }

    async goto() {
        const fullUrl = `${process.env.BASE_URL}${UserSettingsPage.url}`
        console.log(`Navigating to URL: ${fullUrl}`)
        await this.page.goto(UserSettingsPage.url, {waitUntil: 'load'})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        await this.activeSessions.waitFor({ state: 'visible', timeout: 20000 })
        return await this.activeSessions.isVisible()
    }

    async addPasswords(currentPass: string, newPass: string, newPassRepeat: string) {
        await Promise.all([
            this.currentPassword.waitFor({ state: 'visible', timeout: 10000 }),
            this.newPassword.waitFor({ state: 'visible', timeout: 10000 }),
            this.newPasswordRepeat.waitFor({ state: 'visible', timeout: 10000 })
        ])

        await this.page.waitForLoadState('domcontentloaded')
        await this.notifications.digestEmailDiv.first().scrollIntoViewIfNeeded()

        await this.currentPassword.type(currentPass, { delay: 100 })
        await this.newPassword.type(newPass, { delay: 100 })
        await this.newPasswordRepeat.type(newPassRepeat, { delay: 100 })
    }

    async saveUser() {
        await this.saveUserBtn.waitFor({state: 'visible', timeout: 10000})
        await this.saveUserBtn.click()
        await Promise.race([
            this.isPasswordChanged(),
            this.isCurrentPasswordError(),
            this.isNewPasswordError(),
            this.isNewPasswordRepeatError(),
            this.isUserChangeError()
        ])
        await this.page.waitForLoadState('domcontentloaded')
    }

    async isPasswordChanged(): Promise<boolean> {
        await this.successIcon.waitFor({ state: 'visible', timeout: 10000 })
        return await this.successIcon.isVisible()
    }

    async isCurrentPasswordError(shouldWait = false): Promise<boolean> {
        if (shouldWait) {
            await this.currentPasswordErrorMessage.waitFor({ state: 'visible', timeout: 10000 })
        }
        return await this.currentPasswordErrorMessage.isVisible()
    }

    async isNewPasswordError(shouldWait = false): Promise<boolean> {
        if (shouldWait) {
            await this.newPasswordErrorMessage.waitFor({ state: 'visible', timeout: 10000 })
        }
        return await this.newPasswordErrorMessage.isVisible()
    }

    async isNewPasswordRepeatError(shouldWait = false): Promise<boolean> {
        if (shouldWait) {
            await this.confirmNewPasswordErrorMessage.waitFor({ state: 'visible', timeout: 10000 })
        }
        return await this.confirmNewPasswordErrorMessage.isVisible()
    }

    async isUserChangeError(shouldWait = false): Promise<boolean> {
        if (shouldWait) {
            await this.errorIcon.waitFor({ state: 'visible', timeout: 10000 })
        }
        return await this.errorIcon.isVisible()
    }
}

export {UserSettingsPage}