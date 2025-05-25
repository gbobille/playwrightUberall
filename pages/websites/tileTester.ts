import { Page } from '@playwright/test';
import { websiteWidgetConfig } from '../../tests/websites/widget/websiteWidget.config';

export class tileTester {
  private baseUrl = 'https://uberall.store/health-check/widgets'

  async constructWidgetUrl(): Promise<string> {
    const urlParams = {
      key: websiteWidgetConfig.DATA_KEY,
      locationId: websiteWidgetConfig.LOCATION_ID,
      env: process.env.WEBSITES_ENV,
    };

    const queryString = new URLSearchParams(urlParams)
    return `${this.baseUrl}?${queryString.toString()}`
  }

  async navigateToWidgetPage(page: Page): Promise<void> {
    const widgetUrl = await this.constructWidgetUrl()
    await page.goto(widgetUrl, { waitUntil: "load" })
  }
}