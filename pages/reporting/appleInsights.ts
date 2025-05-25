import { expect, FrameLocator, Locator, Page, selectors } from "@playwright/test";

export default class AppleInsights {
    analyticsSidebarLink: Locator;
    appleDashboardSidebarLink: Locator;
    printPreviewButton: Locator;
    dashboardIframe: FrameLocator;
    spID: string;

    constructor(public page: Page, public salesPartnerID: string) {
        selectors.setTestIdAttribute('data-automation-id');
        this.spID = salesPartnerID
        this.analyticsSidebarLink = page.getByRole('link', { name: 'Analytics', exact: true })
        this.appleDashboardSidebarLink = page.getByRole('link', { name: 'Apple' })
        this.printPreviewButton = page.getByText('Print Preview')
        this.dashboardIframe = page.frameLocator(`iframe[name$="dashboard_sp${this.spID}"]`)
    }

    async navigateToAppleDashboard() {
        await this.analyticsSidebarLink.click()
        await this.appleDashboardSidebarLink.click()
    }

    async verifyDashboardLoad() {
        await this.dashboardIframe.getByLabel('Views')
        await this.page.waitForTimeout(2000)
    }

    async getTotalViewsValue() {
        let totalViewsElement = await this.dashboardIframe.locator('div.narration-chart').first()
        let totalViewsText = await totalViewsElement.innerText()
        let value = totalViewsText.split('\n').filter(x => x)[1]
        return value
    }

    async getTotalViewsPreviousPeriod() {
        let totalViewsElement = await this.dashboardIframe.locator('div.narration-chart').first()
        let totalViewsText = await totalViewsElement.innerText()
        let totalViewsNumbers = totalViewsText.split('\n').filter(x => x)
        return totalViewsNumbers[2]
    }

}