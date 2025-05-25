import { expect, Locator, Page } from '@playwright/test';

export default class Sitemap {
  readonly page: Page
  readonly clickSiteMapLinks: (siteMapLinks: string) => Locator
  readonly siteMapHeading: (headingName: string) => Locator
  readonly siteMapHeadingLink: (headingLink: string) => Locator
  readonly siteMapGetTitle: (getTitle: string) => Locator
  readonly sitemapLink: (siteMap: string) => Locator
  readonly sitemapText: (siteMapText: string) => Locator
  

  constructor(page: Page) {
    this.page = page
    this.clickSiteMapLinks = (siteMapLinks: string) => this.page.getByRole('link', { name: `${siteMapLinks}`}).first()
    this.siteMapHeading = (headingName: string) => this.page.getByRole('heading', { name: `${headingName}`})
    this.siteMapHeadingLink = (headingLink : string) => this.page.getByRole('link', { name: `${headingLink}`, exact: true })
    this.siteMapGetTitle = (getTitle : string) => this.page.getByTitle(`${getTitle}`, { exact: true } )
    this.sitemapLink = (siteMap: string) => this.page.getByRole('link', { name: `${siteMap}`})
    this.sitemapText = (siteMapText: string) => this.page.getByText(`${siteMapText}`)
  }
}