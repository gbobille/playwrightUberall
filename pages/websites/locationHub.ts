import { expect, Locator, Page } from '@playwright/test';
import { websiteWidgetConfig } from '../../tests/websites/widget/websiteWidget.config';

export default class LocationHub {
  readonly TIMEOUT = 15000
  readonly URL_LOCATION_HUB = `${process.env.BASE_URL}/en/app/uberall/locations`

  page: Page
  locationHubSideMenu: Locator
  searchInput: Locator
  websiteTab: Locator
  widgetToggleWebsiteWidgets: Locator
  widgetToggleGoogle: Locator
  saveButton: Locator
  successMessage: Locator
  successCopy: Locator
  locationName: Locator

  constructor(page: Page) {
    this.page = page
    this.locationHubSideMenu = page.getByRole('link', { name: 'Location Hub' })
    this.searchInput = page.getByTestId('locations-search-box')
    this.locationName = page.getByTestId('location-name-link-3031865')
    this.websiteTab = page.locator('[data-testid="page-header-tab-website"]')
    this.widgetToggleWebsiteWidgets = page.locator('[data-testid="website-widgets-review-directories-toggle-WEBSITE_WIDGETS"]')
    this.widgetToggleGoogle = page.locator('[data-testid="website-widgets-review-directories-toggle-GOOGLE"]')
    this.saveButton = page.locator('button:has-text("Save changes")')
    this.successMessage = page.locator('text=website.widgets.message.save.')
    this.successCopy = page.locator('text=website.widgets.message.copy.')
  }

  async openLocationHub() {
    await this.locationHubSideMenu.click()
    await this.page.waitForURL(this.URL_LOCATION_HUB, {timeout: this.TIMEOUT})
  }

  async copySnippet() {
    const snippetTypes = ['REVIEW', 'SOCIALPOST']
    for (const type of snippetTypes) {
      const copySnippetButton = this.page.getByTestId(`website-widget-widget-${type}`).getByTestId('website-widgets-copy-snippet')
      await copySnippetButton.click()
      await expect(this.successCopy).toBeVisible({ timeout: 12000 })
    }
  }

  async searchAndSelectLocation(locationInfo: { identifier: string, name?: string }) {
    const locationsLink = this.page.getByRole('link', { name: 'Locations' })

    await expect(locationsLink).toBeVisible({ timeout: 5000 })
    await locationsLink.first().click()
    await expect(this.page).toHaveURL(this.URL_LOCATION_HUB, { timeout: 5000 })

    await this.searchInput.click()
    await this.searchInput.fill(locationInfo.identifier)
    await this.searchInput.press('Enter')
    await this.locationName.click()
  }

  async editReviewTile() {
    await this._toggleWidgetSettings(true, false, 'de')
  }

  async _toggleWidgetSettings(websiteState: boolean, googleState: boolean, language: string) {
    await this.websiteTab.click()
    await this.widgetToggleWebsiteWidgets.setChecked(websiteState)
    await this.widgetToggleGoogle.setChecked(googleState)
    await this.page.locator('.css-ackcql').first().click()
    await this.page.getByTestId(`website-widgets-language-selection-REVIEW`).getByTestId(language).click()
    await this.saveButton.click()

    console.log('Checking for success message visibility')
    await expect(this.successMessage).toBeVisible({ timeout: 120000 })

    const currentLanguage = await this.page.locator(`[data-testid="website-widgets-language-selection-REVIEW"] [data-testid="website-widgets-language-dropdown_select-wrapper"]`).innerText()
    console.log('Current language:', currentLanguage)
  }

  async discardChanges() {
    await this.websiteTab.click()

    await this.page.getByPlaceholder('Enter the URL of your privacy').fill(websiteWidgetConfig.TEST_PRIVACY_URL)
    await this.page.getByRole('button', { name: 'Discard changes' }).click()

    const privacyValue = await this.page.getByPlaceholder('Enter the URL of your privacy').inputValue()
    expect(privacyValue).toBe(websiteWidgetConfig.PRIVACY_URL)
    console.log('Privacy value after discard:', privacyValue)
  }
}