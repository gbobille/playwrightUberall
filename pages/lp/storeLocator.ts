import { expect, Locator, Page } from '@playwright/test';

export default class StoreLocator {
  readonly page: Page
  readonly searchField: Locator
  readonly closeButton : Locator
  readonly accept : Locator
  readonly allow: Locator
  readonly moreInfo: Locator
  readonly arvestLPBtn: Locator
  readonly localPageText: (text: string) => Locator
  readonly storeLocatorName: (locatorName: string) => Locator
  readonly clickLocalPageButton: (localPageButton: string) => Locator
  readonly clickSitemapLink: (siteMap: string) => Locator
  readonly verifySearchResults: (locationVerification: string) => Locator
  readonly storeLocatorText: (text: string) => Locator
  readonly hiddenAddress: (hiddenAddress: string) => Locator
  readonly clickFiltersButton: (filtersButton: string) => Locator
  readonly selectFilterButton: (selectFilter: string) => Locator
  readonly localPageName: (pageName: string) => Locator
  readonly region: (regionName: string) => Locator
  readonly aaaName: (lpName: string) => Locator
  readonly clickBreadcrumb: (breadCrumb: string) => Locator
  readonly clickFooterLink: (footerLink: string) => Locator
  readonly clickCaliforniaResidentsLink: (caLink: string) => Locator
  readonly clickArvestFilter: (filter: string) => Locator
  readonly clickLocalPageText: (linkText: string) => Locator

  constructor(page: Page) {
    this.page = page
    this.searchField = page.locator('#searchField')
    this.closeButton = page.locator('._close').first()
    this.accept = page.getByRole('button', { name: 'Accept all' })
    this.allow = page.getByRole('button', { name: 'Allow all cookies' })
    this.moreInfo = page.locator('#loc_1').getByRole('link', { name: 'More Info' })
    this.arvestLPBtn = this.page.locator('#loc_1').getByRole('link', { name: 'Local Details Rogers Downtown' })
    this.localPageText = (text: string) => this.page.getByText(`${text}`)
    this.storeLocatorName = (locatorName: string) => this.page.getByRole('heading', { name: `${locatorName}`})
    this.clickLocalPageButton = (localPageButton: string) => this.page.getByRole('link', { name: `${localPageButton}` }).first()
    this.clickSitemapLink = (siteMap: string) => this.page.getByRole('link', { name: `${siteMap}` })
    this.verifySearchResults = (locationVerification: string) => this.page.getByText(`${locationVerification}`)
    this.storeLocatorText = (text: string) => this.page.getByText(`${text}`)
    this.hiddenAddress = (hiddenAddress: string) => this.page.getByText(`${hiddenAddress}`)
    this.clickFiltersButton = (filtersButton: string) => this.page.getByRole('button', { name: `${filtersButton}` })
    this.selectFilterButton = (selectFilter: string) => this.page.getByLabel(`${selectFilter}`)
    this.localPageName = (pageName: string) => this.page.getByRole('heading', { name: `${pageName}`})
    this.region = (regionName : string) => this.page.getByText(`${regionName}`, { exact: true})
    this.aaaName = (lpName: string) => this.page.getByRole('link', { name: `${lpName}` })
    this.clickBreadcrumb = (breadCrumb: string) => this.page.getByLabel(`${breadCrumb}`)
    this.clickFooterLink = (footerLink : string) => this.page.getByText(`${footerLink}`, { exact: true})
    this.clickCaliforniaResidentsLink = (caLink: string) => this.page.getByLabel(`${caLink}`)
    this.clickArvestFilter = (filter : string) => this.page.getByLabel(`${filter}`, { exact: true})
    this.clickLocalPageText = (linkText : string) => this.page.getByText(`${linkText}`, { exact: true})
  }

// Common Store Locator Elements
  async searchLocation(locationAddress) {
    await this.searchField.fill(locationAddress)
    await this.page.waitForLoadState('networkidle')
    await this.page.getByRole('link', { name: locationAddress }).first().click({ timeout: 40000 })
  }

  async waitForResultsList() {
    await this.page.waitForSelector('.location-li', { state: 'visible' })
  }

  // AAA Meemic Elements
  async searchByName(agentName: string) {
    await this.page.locator('label').filter({ hasText: 'By Name' }).locator('svg').click()
    await this.searchField.waitFor({ state: 'visible' })
    await this.searchField.fill(agentName)
  }

  // FatBrands Elements
  async popUpCheck(page) {
    const popup = await page.getByTitle('Close').isVisible({ timeout: 40000 })

    if (popup) {
      console.log('Popup is visible. Performing action...')
      await page.getByTitle('Close').click()                
    } else if (!popup) {
      console.log('Popup is not visible.')
    }
  }

  async fatBrandsSearch(locationAddress) {
    await this.searchField.fill(locationAddress)
    await this.page.getByRole('link', { name: locationAddress, exact: true }).first().click({ timeout: 40000 })
  }
}