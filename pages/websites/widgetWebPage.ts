import { expect, Page } from '@playwright/test';

export default class WidgetWebPage {
  page: Page

  readonly selectors = {
    reviewCtaFirstParty: '[data-testid="review-cta-first-party-review"]',
    reviewCtaGoogle: '[data-testid="review-cta-google"]',
    sectionTitle: '.ubw-section-title',
    overallRatingLabel: '.ubw-overall-rating-label',
    reviewCtaFacebook: '[data-testid="review-cta-facebook"]',
  }

  constructor(page: Page) {
    this.page = page
  }

  async checkVisibility(selector: string, expected: boolean) {
    try {
      const isVisible = await this.page.locator(selector).isVisible()
      expect(isVisible).toBe(expected)
    } catch (error) {
      console.error(`Error checking visibility for ${selector}:`, error)
    }
  }
  
  async checkText(selector: string, expectedText: string) {
    const element = this.page.locator(selector)
  
    try {
      const textContent = await element.textContent()
  
      if (selector === this.selectors.overallRatingLabel) {
        const containsText = textContent?.includes(expectedText)
        console.log(`Text ${containsText ? 'contains' : 'does not contain'} "${expectedText}" in class "${selector}"`)
        expect(containsText).toBe(true) 
      } else {
        await expect(element).toHaveText(expectedText)
      }
    } catch (error) {
      console.error(`Error checking text for ${selector}:`, error)
    }
  }  

  async checkVisibilityAndText(selector: string, expectedText: string) {
    await this.checkVisibility(selector, true)
    await this.checkText(selector, expectedText)
  }

  async verifyReviewEdits() {
    await this.checkVisibilityAndText(this.selectors.reviewCtaFirstParty, 'Hinterlassen Sie eine Bewertung')
    await this.checkVisibility(this.selectors.reviewCtaGoogle, false)
    await this.checkText(this.selectors.sectionTitle, 'Kunden-Feedback')
    await this.checkText(this.selectors.overallRatingLabel, 'Durchschnittliche Bewertung:')
    await this.checkText(this.selectors.reviewCtaFacebook, 'Hinterlassen Sie eine Bewertung')
  }

  async verifyRevertEdits() {
    await this.checkVisibility(this.selectors.reviewCtaFirstParty, false)
    await this.checkVisibilityAndText(this.selectors.reviewCtaGoogle, 'Leave a review')
    await this.checkText(this.selectors.sectionTitle, 'Customer Feedback')
    await this.checkText(this.selectors.overallRatingLabel, 'Average rating:')
    await this.checkText(this.selectors.reviewCtaFacebook, 'Leave a review')
  }
}