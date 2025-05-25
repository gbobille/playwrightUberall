import { Locator, Page } from "@playwright/test";

export const ANALYTICS_REPORT_URL = '/en/app/uberall/analytics2/store-locator-report'

export default class AnalyticsReport {
  readonly page: Page

  businessDropdown: Locator
  vwBusiness: Locator
  headerText: Locator
  currentVisitorsText: Locator
  averageVisitTimeText: Locator
  pagesText: Locator
  referrersText: Locator
  browsersText: Locator
  osText: Locator
  devicesText: Locator
  countriesText: Locator
  eventsText: Locator
  actionsText: Locator
  topBarChart: Locator
  bottomBarChart: Locator
  analyticsMap: Locator
  viewsMetric: Locator
  bounceRate: Locator
  visitTime: Locator
  filter: Locator
  filterURL: Locator
  filterForm: Locator
  filterDropdown: Locator
  filterPage: Locator
  filterAdd: Locator
  clearAll: Locator

  constructor(page: Page) {
    this.page = page;
    const iframeLocator = this.page.frameLocator('iframe[title="store-locator-report"]')

    this.businessDropdown = this.page.getByTestId('website-storelocator-report-dropdown_select-wrapper') 
    this.vwBusiness = this.page.getByTestId('https://uberall.com/api/sfanalytics/share/IugaXwUdIStBgSvVB1ZuosgIvY0hfWiZPF8G9uxj6k9T3K8fId')
    this.headerText = iframeLocator.getByText('Visionworks', { exact: true })
    this.currentVisitorsText = iframeLocator.getByText('current visitors')
    this.averageVisitTimeText = iframeLocator.getByText('Average visit time')
    this.pagesText = iframeLocator.getByText('Pages')
    this.referrersText = iframeLocator.getByText('Referrers')
    this.browsersText = iframeLocator.getByText('Browsers')
    this.osText = iframeLocator.getByText('OS', { exact: true })
    this.devicesText = iframeLocator.getByText('Devices')
    this.countriesText = iframeLocator.getByText('Countries')
    this.eventsText = iframeLocator.getByText('Events')
    this.actionsText = iframeLocator.getByText('Actions')
    this.topBarChart = iframeLocator.locator('canvas').first()
    this.bottomBarChart = iframeLocator.locator('canvas').nth(1)
    this.analyticsMap = iframeLocator.locator('rect')
    this.viewsMetric = iframeLocator.locator('.MetricCard_value__m2Mhp').getByText('k').first()
    this.bounceRate = iframeLocator.locator('.MetricCard_value__m2Mhp').getByText('%')
    this.visitTime = iframeLocator.locator('.MetricCard_value__m2Mhp').getByText('s')
    this.filter = iframeLocator.getByRole('button', { name: 'Filter' })
    this.filterURL = iframeLocator.getByText('URL')
    this.filterForm = iframeLocator.locator('form').getByRole('img')
    this.filterDropdown = iframeLocator.locator('.FieldFilterForm_dropdown__0WtYH')
    this.filterPage = iframeLocator.getByText('/ll/US/AZ/Gilbert/2156-E-')
    this.filterAdd = iframeLocator.getByRole('button', { name: 'Add' })
    this.clearAll = iframeLocator.getByRole('button', { name: 'Clear all' })
  }

  async applyURLFilter() { 
    await this.filterURL.click()
    await this.filterForm.click()
    await this.filterDropdown.click()
    await this.filterDropdown.locator('div:nth-child(2)').click()
    await this.filterPage.click()
    await this.filterAdd.click()
  }
}