import { Locator, Page } from "playwright";

export default class RevenueEstimatorPanel {

    revenueEstimatorPanel: Locator
    refineYourCalculationBtn: Locator
    countryCurrency: Locator
    countryCode: Locator
    averagePurchaseTextField: Locator
    pastMonthTimePeriodBtn: Locator
    pastQuarterTimePeriodBtn: Locator
    pastYearTimePeriodBtn: Locator
    timeRangeLabel:Locator

    constructor(public page: Page) {
        this.revenueEstimatorPanel = page.locator(".revenue-widget-drawer")
        this.refineYourCalculationBtn = this.revenueEstimatorPanel.getByTestId("revenue-widget-submit-button")
        this.countryCurrency = this.page.locator("//*[contains(@class, 'currency-option')]/../following-sibling::div[contains(@class, 'css-ackcql')]")
        this.countryCode = this.page.locator(".currency-code")
        this.averagePurchaseTextField = this.revenueEstimatorPanel.getByTestId("homepage-revenuewidget-panel-avgPurchaseValue")
        this.pastMonthTimePeriodBtn = this.revenueEstimatorPanel.getByTestId("homepage-revenuewidget-panel-period-30-select")
        this.pastQuarterTimePeriodBtn = this.revenueEstimatorPanel.getByTestId("homepage-revenuewidget-panel-period-90-select")
        this.pastYearTimePeriodBtn = this.revenueEstimatorPanel.getByTestId("homepage-revenuewidget-panel-period-365-select")
        this.timeRangeLabel = page.locator (".timerange")
    }

    async clickOnCountryCurrency(countCode = 'EUR') {
        await this.countryCurrency.click()
        await this.page.getByText(countCode).click()
    }
}