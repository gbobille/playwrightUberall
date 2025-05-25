import {Locator, Page} from '@playwright/test'
import {UserDetailsComponent} from '../components/users/userDetails'
import {UserRightsComponent} from '../components/users/userRights'
import {EmailNotificationComponent} from '../components/users/emailNotifications'
import User from "../../models/users/user/user"

class UserCreatePage {
    static url = `/en/app/uberall/users/create`
    page: Page
    updateSuccess: Locator
    saveUserBtn: Locator
    userDetails: UserDetailsComponent
    userRights: UserRightsComponent
    notifications: EmailNotificationComponent

    constructor(page: Page) {
        this.page = page
        this.updateSuccess = page.locator("//div[contains(@class, 'test-notification-success-icon')]")
        this.saveUserBtn = page.locator("//button[@data-testid= 'save-changes-bar-save-button']//span")
        this.userDetails = new UserDetailsComponent(page)
        this.userRights = new UserRightsComponent(page)
        this.notifications = new EmailNotificationComponent(page)
    }

    async goto() {
        const fullUrl = `${process.env.BASE_URL}${UserCreatePage.url}`
        console.log(`Navigating to URL: ${fullUrl}`)
        await this.page.goto(UserCreatePage.url, {waitUntil: 'load'})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        return await this.userDetails.firstName.isVisible()
    }

    async addUser(user: User) {
        await this.setUserDetails(user)
        await this.setUserRights(user)
        await this.setEmailNotifications(user)
        await this.saveUser()
    }

    async setUserDetails(user: User) {
        await this.userDetails.selectSalutation(user.userDetails.salutation)
        await this.userDetails.setFirstName(user.userDetails.firstName)
        await this.userDetails.setLastName(user.userDetails.lastName)
        await this.userDetails.setUserEmail(user.userDetails.email)
    }

    async setUserRights(user: User) {
        await this.userRights.selectUserRole(user.userRights.role)
        await this.userRights.selectBusinesses(user.userRights.managedBusinesses)
        await this.userRights.selectLocations(user.userRights.managedLocations)
    }

    async setEmailNotifications(user: User) {
        await this.notifications.toggleDigestEmail(user.emailNotifications.digestEmail)
        await this.notifications.toggleEmailNotification(user.emailNotifications.emailNotification)
        await this.notifications.togglePendingApprovals(user.emailNotifications.pendingApprovals)
    }

    async saveUser() {
        await this.saveUserBtn.click()
        await this.updateSuccess.waitFor({state: 'visible', timeout: 30000})
        await this.updateSuccess.isVisible()
        await this.userDetails.firstName.waitFor({state: 'hidden', timeout: 30000})
        await this.updateSuccess.waitFor({state: 'hidden', timeout: 10000})
    }
}

export {UserCreatePage}