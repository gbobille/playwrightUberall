import { expect, test} from "@playwright/test";
import { loginUberallAppAs } from "../../utils/login-util";
import analyticsReport, { ANALYTICS_REPORT_URL } from "../../pages/lp/analytics";

test.describe('Visionworks Analytics Report', { tag:'@locator-analytics' }, () => {

  test.beforeEach("Given admin user successfully logs in", async ({page}) => {
    await loginUberallAppAs(page, process.env.WEB_ADMIN_USERNAME, process.env.WEB_ADMIN_PASSWORD)
    await page.goto(`${process.env.BASE_URL}${ANALYTICS_REPORT_URL}`, { waitUntil: 'domcontentloaded' })
  })

  test(`Verify that the user can access and view the analytics report upon initial page load`, async ({ page }) => {
    const analytics = new analyticsReport(page)

    await test.step(`Check visibility of texts`, async () => {
      await expect(analytics.headerText).toBeVisible()
      await expect(analytics.currentVisitorsText).toBeVisible()
      await expect(analytics.averageVisitTimeText).toBeVisible()
      await expect(analytics.pagesText).toBeVisible()
      await expect(analytics.referrersText).toBeVisible()
      await expect(analytics.browsersText).toBeVisible()
      await expect(analytics.osText).toBeVisible()
      await expect(analytics.devicesText).toBeVisible()
      await expect(analytics.countriesText).toBeVisible()
      await expect(analytics.eventsText).toBeVisible()
      await expect(analytics.actionsText).toBeVisible()
    })

    await test.step(`Check visibility of charts and map`, async () => {
      await expect(analytics.topBarChart).toBeVisible()
      await expect(analytics.bottomBarChart).toBeVisible()
      await expect(analytics.analyticsMap).toBeVisible()       
    })
  })

  test(`Verify user can select a business from the dropdown`, async ({ page }) => {
    const analytics = new analyticsReport(page)

    await analytics.businessDropdown.locator('svg').click()
    await analytics.vwBusiness.getByText('Visionworks').click()

    await expect(analytics.visitTime).toBeVisible()
    await expect(analytics.bounceRate).toBeVisible()
    await expect(analytics.bottomBarChart).toBeVisible()
    await expect(analytics.analyticsMap).toBeVisible()
  })
})