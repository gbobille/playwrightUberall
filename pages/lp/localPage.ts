import { expect, Locator, Page } from '@playwright/test';

export default class LocalPage {
  readonly page: Page
  readonly localPageHeading: (headingName: string) => Locator
  readonly localPageTextIsDisplayed: (localPageText: string) => Locator
  readonly mapIsDisplayed: (mapLocation: string) => Locator
  readonly serviceIsDisplayed: (services: string) => Locator
  readonly locationDetails: (detailsText: string) => Locator
  readonly nearbyCard: (nearbyCardText: string) => Locator
  readonly scheduleButton: (buttonName: string) => Locator
  readonly localPageLinkIsDisplayed: (localPageLink: string) => Locator
  readonly localPageHoursDisplayed: (localPageHours: string) => Locator
  readonly textHeading: (headingText: string) => Locator
  readonly randomText: (randomText: string) => Locator
  readonly aboutText: (aboutText: string) => Locator
  readonly addressHeading: (addressText: string) => Locator
  readonly hoursHeading: (hoursText: string) => Locator
  readonly multilingualTextDisplayed: (multilingualText: string) => Locator
  readonly multilingualLinkDisplayed: (multilingualLink: string) => Locator
  readonly paymentOptions: (paymentText: string) => Locator
  readonly heroImageAlt: (altText: string) => Locator
  readonly menuItems: (menuText: string) => Locator
  readonly heroImage: (hero: string) => Locator
  readonly fatBrandsText: (fatBrandsText: string) => Locator
  readonly checkMap: (checkMap: string) => Locator
  readonly hiddenAddress: (hiddenAddress: string) => Locator
  readonly checkAddress: (checkAddress: string) => Locator
  readonly localPageBreadcrumbs: (localPageBreadcrumbs: string) => Locator
  readonly amenitiesIcons: (amenity: string) => Locator
  readonly openButton: (openButton: string) => Locator
  readonly getAQuote: (getAQuote: string) => Locator
  readonly formHeading: (formHeading: string) => Locator
  readonly clickButton: (clickButton: string) => Locator
  readonly serviceText: (serviceText: string) => Locator
  readonly nearbyLocations: (locationName: string) => Locator
  readonly branchServiceText: (branchServiceText: string) => Locator
  
  constructor(page: Page) {
    this.page = page
    this.localPageHeading = (headingName : string) => this.page.getByRole('heading', { name: `${headingName}`, exact: true })
    this.localPageTextIsDisplayed = (localPageText: string) => this.page.getByText(`${localPageText}`).first()
    this.mapIsDisplayed = (mapLocation: string) => this.page.getByRole('img', { name: `${mapLocation}` })
    this.serviceIsDisplayed = (services: string) => this.page.getByRole('link', { name: `${services}` })
    this.locationDetails = (detailsText: string) => this.page.getByRole('link', { name: `${detailsText}` }).first()
    this.nearbyCard = (nearbyCardText: string) => this.page.getByText(`${nearbyCardText}`)
    this.scheduleButton = (buttonName: string) => this.page.getByRole('link', { name: `${buttonName}` })
    this.localPageLinkIsDisplayed = (localPageLink: string) => this.page.getByRole('link', { name: `${localPageLink}` }).first()
    this.localPageHoursDisplayed = (localPageHours: string) => this.page.getByText(`${localPageHours}`)
    this.textHeading = (headingText: string) => this.page.getByRole('heading', { name: `${headingText}`})
    this.randomText = (randomText : string) => this.page.getByText(`${randomText}`, { exact: true})
    this.aboutText = (aboutText: string) => this.page.getByText(`${aboutText}`)
    this.addressHeading = (addressText: string) => this.page.getByRole('heading', { name: `${addressText}`})
    this.hoursHeading = (hoursText: string) => this.page.getByRole('heading', { name: `${hoursText}`})
    this.multilingualTextDisplayed = (multilingualText: string) => this.page.getByText(`${multilingualText}`).first()
    this.multilingualLinkDisplayed = (multilingualLink: string) => this.page.getByRole('link', { name: `${multilingualLink}` }).first()
    this.paymentOptions = (paymentText: string) => this.page.getByText(`${paymentText}`)
    this.heroImageAlt = (altText: string) => this.page.getByAltText(`${altText}`)
    this.menuItems = (menuText: string) => this.page.getByRole('link', { name: `${menuText}` })
    this.heroImage = (hero: string) => this.page.getByRole('img', { name: `${hero}` })
    this.fatBrandsText = (fatBrandsText: string) => this.page.getByText(`${fatBrandsText}`)
    this.checkMap = (checkMap: string) => this.page.getByRole('img', { name: `${checkMap}` })
    this.hiddenAddress = (hiddenAddress: string) => this.page.getByText(`${hiddenAddress}`)
    this.checkAddress = (checkAddress : string) => this.page.getByText(`${checkAddress}`, { exact: true})
    this.localPageBreadcrumbs = (localPageBreadcrumbs: string) => this.page.getByText(`${localPageBreadcrumbs}`)
    this.amenitiesIcons = (amenity: string) => this.page.getByRole('img', { name: `${amenity}` })
    this.openButton = (openButton: string) => this.page.getByRole('button', { name: `${openButton}` })
    this.getAQuote = (getAQuote: string) => this.page.getByAltText(`${getAQuote}`)
    this.formHeading = (formHeading : string) => this.page.getByRole('heading', { name: `${formHeading}`, exact: true })
    this.clickButton = (clickButton: string) => this.page.getByRole('link', { name: `${clickButton}` })
    this.serviceText = (serviceText : string) => this.page.getByText(`${serviceText}`, { exact: true})
    this.nearbyLocations = (locationName: string) => this.page.getByRole('heading', { name: `${locationName}`})
    this.branchServiceText = (branchServiceText: string) => this.page.getByText(`${branchServiceText}`)
  }
}