import {Locator, Page} from '@playwright/test'
import {ToggleUtils} from "../../../utils/toggleUtils"

class EmailNotificationComponent {
    page: Page
    digestEmailDiv: Locator
    emailNotificationDiv: Locator
    pendingApprovalsDiv: Locator

    constructor(page: Page) {
        this.page = page
        this.digestEmailDiv = page.locator("//div[@id='digest-notification']")
        this.emailNotificationDiv = page.locator("//div[@id='unread-review-notification']")
        this.pendingApprovalsDiv = page.locator("//div[@id='approval-needed-notification']")
    }

     async toggleDigestEmail(enable: boolean) {
        await this.digestEmailDiv.first().scrollIntoViewIfNeeded()
        await ToggleUtils.toggleRadio( enable, this.digestEmailDiv)
    }

     async toggleEmailNotification(enable: boolean) {
        await this.emailNotificationDiv.first().scrollIntoViewIfNeeded()
        await ToggleUtils.toggleRadio(enable, this.emailNotificationDiv)
    }

     async togglePendingApprovals(enable: boolean) {
        await this.pendingApprovalsDiv.first().scrollIntoViewIfNeeded()
        await ToggleUtils.toggleRadio(enable, this.pendingApprovalsDiv)
    }
}

export { EmailNotificationComponent }