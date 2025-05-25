import { Locator, Page } from '@playwright/test';

export default class QrCode {
  readonly page: Page
  readonly generateButton: Locator
  readonly nextButton: Locator
  readonly ownUrl: Locator
  readonly addButton: Locator
  readonly dropdown: Locator
  readonly qrCodeUrl: Locator
  readonly successMessage: Locator
  readonly searchLocation: Locator
  readonly useURLText: Locator
  readonly clickQrCodeButton: (qrCodeButton: string) => Locator
  readonly clickEditLocations: (editLocations: string) => Locator
  readonly clickLocationName: (locationName: string) => Locator

  constructor(page: Page) {
    this.page = page
    this.generateButton = page.getByTestId("generate-qr-code-description-box-button")
    this.nextButton = page.getByTestId("generate-qr-code-modal-footer-next")
    this.ownUrl = page.getByTestId("generate-qr-code-modal-own-url")
    this.addButton = page.getByTestId("add-locations-button")
    this.dropdown = page.getByTestId("ZNT-dropdown_select-wrapper")
    this.qrCodeUrl = page.getByTestId("qr_code_url")
    this.successMessage = page.getByText("Success, your QR code(s) have been created.")
    this.searchLocation = page.getByPlaceholder("Search locations")
    this.useURLText = page.getByText('I want to use a URL associated with my location(s)')
    this.clickQrCodeButton = (qrCodeButton: string) => this.page.getByRole('link', { name: `${qrCodeButton}` })
    this.clickEditLocations = (editLocations: string) => this.page.getByRole('button', { name: `${editLocations}` })
    this.clickLocationName = (locationName: string) => this.page.getByText(`${locationName}`).first()
  }
}