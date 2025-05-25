import { Locator, Page } from '@playwright/test';

export default class ReviewGeneration {
  readonly page                : Page
  readonly getReviewsTab       : Locator
  readonly getReviewsSubTab    : Locator
  readonly newReviewsRequestTab: Locator
  readonly manualButton        : Locator
  readonly firstNameField      : Locator
  readonly lastNameField       : Locator
  readonly emailField          : Locator
  readonly nextButton          : Locator
  readonly templateDropdown    : Locator
  readonly templateSelection   : Locator
  readonly sendNowButton       : Locator
  readonly radioSMS            : Locator
  readonly firstSMSNameField   : Locator
  readonly lastSMSNameField    : Locator
  readonly numberSMSField      : Locator
  readonly templateSMS         : Locator
  readonly devTemplateSMS      : Locator

  constructor(page: Page) {
    this.page                 = page
    this.getReviewsTab        = page.getByTestId("page-header-tab-reviewgeneration")
    this.getReviewsSubTab     = page.getByTestId("reviews-sub-tab")
    this.newReviewsRequestTab = page.getByTestId("review-generation-reviews-top-section-new-request-button")
    this.manualButton         = page.getByTestId("ZNT-tabs_tabs-navigation-Manual")
    this.firstNameField       = page.getByTestId("first-name-email-option")
    this.lastNameField        = page.getByTestId("last-name-email-option")
    this.emailField           = page.getByTestId("email-email-option")
    this.nextButton           = page.getByTestId("review-generation-new-request-modal-add-contact-step-next")
    this.templateDropdown     = page.locator(".css-ackcql")
    this.templateSelection    = page.getByTestId("185")
    this.sendNowButton        = page.getByTestId("review-generation-new-request-modal-footer-next")
    this.radioSMS             = page.getByTestId("review-generation-new-request-modal-file-upload-step-body")
    this.firstSMSNameField    = page.getByTestId("first-name-sms-option")
    this.lastSMSNameField     = page.getByTestId("last-name-sms-option")
    this.numberSMSField       = page.getByTestId("phone-number-sms-option")
    this.templateSMS          = page.getByTestId("186")
    this.devTemplateSMS       = page.getByTestId("284")
  }

  async ignoreButton(ignore: string) {
    await this.page.getByRole('button', { name: ignore }).click()
  }

  async sucessMessageDisplayed(successMessage: string) {
    await this.page.getByText(successMessage).click({ timeout: 30000 })
  }

  async customersTab(customers: string) {
    await this.page.getByRole('link', { name: customers }).first().click()
  }

  async chooseLocationDropdown(chooseLocation: string) {
    await this.page.getByText(chooseLocation).click({ timeout: 30000 })
  }

  async locationList(location: string) {
    await this.page.getByRole('option', { name: location}).click({ timeout: 30000 })
  }

  /* New Nav */
  async reviewGenerationTab(reviewgeneration: string) {
    await this.page.getByRole('link', { name: reviewgeneration }).first().click({ timeout: 30000 })
  }

  async getReviewsTab2(get_reviews: string) {
    await this.page.getByRole('link', { name: get_reviews }).first().click({ timeout: 30000 })
  }

}
