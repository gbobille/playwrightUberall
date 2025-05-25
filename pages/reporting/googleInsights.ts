import { expect, FrameLocator, Locator, Page, selectors } from "@playwright/test";

export default class GoogleInsights  {
    analyticsSidebarLink: Locator;
    googleDashboardSidebarLink: Locator;
    printPreviewButton: Locator;
    dashboardIframe: FrameLocator;
    awarenessTab: Locator;
    interactionsTab: Locator;
    conversionTab: Locator;
    spID: string;

    constructor(public page: Page, public salesPartnerID: string) {
        this.spID = salesPartnerID
        this.analyticsSidebarLink = page.getByRole('link', { name: 'Analytics', exact: true })
        this.googleDashboardSidebarLink = page.getByRole('link', { name: 'Google' })
        this.printPreviewButton = page.getByText('Print Preview')
        this.awarenessTab = page.getByTestId('page-header-tab-awareness')
        this.interactionsTab = page.getByTestId('page-header-tab-interactions')
        this.conversionTab = page.getByTestId('page-header-tab-conversion')
        this.dashboardIframe = page.frameLocator(`iframe[name$="dashboard_SP${this.spID}"]`)
    }

    async navigateToGoogleDashboard() {
        await this.analyticsSidebarLink.click()
        await this.googleDashboardSidebarLink.click()
    }

    async clickDashboardTab(tabName:string) {
        switch(tabName.toLowerCase()){
            case 'awareness':
                await this.awarenessTab.isEnabled()
                await this.awarenessTab.click()
                break
            case 'interactions':
                await this.interactionsTab.isEnabled()
                await this.interactionsTab.click()
                break
            case 'conversion':
                await this.conversionTab.isEnabled()
                await this.conversionTab.click()
                break
            default:
                throw new Error('Invalid google dashboard tab name specified')
        }
    }

    async verifyAwarenessTabLoad() {
        await this.dashboardIframe.getByLabel('Impressions by Date - Maps').isVisible()
    }

    async verifyInteractionsTabLoad() {
        await this.dashboardIframe.getByLabel('Clicks by Date').isVisible()
    }

    async verifyConversionTabLoad() {
        await this.dashboardIframe.getByLabel('Conversion Rate and Number of Impressions by Location/Geography').isVisible()
    }

    async getMapsImpressionsValue() {
        let mapsImpressionsElement = await this.dashboardIframe.locator('div.narration-chart').first()
        let mapsImpressionsText = await mapsImpressionsElement.innerText()
        let value = mapsImpressionsText.split('\n').filter(x => x)[1]
        return value
    }
}