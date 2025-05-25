import { Locator, Page } from "playwright";

export default class RevenueWidget {
    revenueWidget: Locator
    revenueWidgetTitle: Locator
    revenueWidgetDescription: Locator
    revenueWidgetScore: Locator
    revenueWidgetScoreAmountCurrency: Locator
    revenueWidgetScoreTimerange: Locator
    revenueWidgetFooter: Locator
    revenueWidgetEditCalculationsButton: Locator
    revenueWidgetTooltip: Locator
    revenueWidgetTooltipText: Locator

    constructor(public page: Page) {
        this.revenueWidget = page.locator(".revenue-active")
        this.revenueWidgetTitle = this.revenueWidget.locator(".revenue-title-badge-container")
        this.revenueWidgetDescription = this.revenueWidget.locator(".revenue-description")
        this.revenueWidgetScore = this.revenueWidget.locator(".revenue-body")
        this.revenueWidgetScoreAmountCurrency = this.revenueWidgetScore.locator(".revenue-amount")
        this.revenueWidgetScoreTimerange = this.revenueWidget.locator(".timerange")
        this.revenueWidgetFooter = this.revenueWidget.locator(".visits")
        this.revenueWidgetEditCalculationsButton = this.revenueWidget.getByTestId("homepage-revenuewidget-update-cta")
        this.revenueWidgetTooltip = page.locator('header').filter({ hasText: 'Revenue EstimatorBetaEvery' }).getByRole('img')
        this.revenueWidgetTooltipText = page.locator('div').filter({ hasText: 'An estimate of past earnings' })
    }
}