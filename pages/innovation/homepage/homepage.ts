import {Page, Locator} from 'playwright'
import {FrameLocator} from "@playwright/test";

export default class HomePage {
    static url = '/home'
    homepage: Locator
    page: Page
    nearMeCheckScoreLink: Locator
    locationScore: Locator
    private contentFrame: FrameLocator
    pendoCloseButton: Locator
    pendoBeamerCloseButton: Locator
    revenueScoreWidget: Locator


    constructor(page: Page) {
        this.page = page
        this.homepage = page.getByRole('link', {name: 'HomePage'})
        this.nearMeCheckScoreLink = page.locator("//a[contains(@data-user-event,'homepage-header')]")
        this.locationScore = page.locator("//div[@class='doughnut-score']")
        this.contentFrame = page.frameLocator("//iframe[contains(@id, 'beamerAnnouncementPopup')]");
        this.pendoBeamerCloseButton = this.contentFrame.locator("//div[@class='popupClose']");
        this.pendoCloseButton = this.page.locator("//button[@class='_pendo-close-guide']");
        this.revenueScoreWidget = page.locator("//section[@class='revenue-widget config-state-background']")
    }

    async goTo() {
        await this.page.goto(HomePage.url, {waitUntil: "domcontentloaded"})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        await Promise.race([
            this.revenueScoreWidget.waitFor({state: 'visible'}),
            this.locationScore.first().waitFor({state: 'visible'}),
            this.contentFrame.locator("//div[@class='popupClose']").waitFor({state: 'visible'})
        ])
        return true;
    }

    async navigateToVisibilityToolTip() {
        await this.page.getByText('Visibility', {exact: true}).isVisible()
    }

    async navigateToReputationToolTip() {
        await this.page.getByText('Reputation', {exact: true}).isVisible()
    }

    async navigateToEngagementToolTip() {
        await this.page.getByText('Engagement', {exact: true}).isVisible()
    }

    async navigateToLocationScoreWidget() {
        await this.page.getByRole('heading', {name: 'Location Score Ranking'}).isVisible()
    }

    async navigateToTasksWidget() {
        await this.page.getByRole('heading', {name: 'Pending Tasks'}).isVisible()
    }

    async navigateToSuggetionsWidget() {
        await this.page.getByRole('heading', {name: 'Boost your local marketing'}).isVisible()
    }

    async navigateToLocationSelectorFilter() {
        await this.page.locator('div:nth-child(3) > .css-b62m3t-container > .homepage-filter-select__control > .homepage-filter-select__value-container > .homepage-filter-select__input-container').click({timeout: 50000})
    }

    async typeLocationName() {
        await this.page.locator('#react-select-3-input').fill('Banya')
    }

    async clickOnSearchedLocation() {
        await this.page.locator('#react-select-3-listbox span').nth(1).click()
    }

    async validateSelectedLocation() {
        await this.page.getByLabel('location rank list item').getByText('South Lamar Boulevard 215,').isVisible()
    }

}

export {HomePage}