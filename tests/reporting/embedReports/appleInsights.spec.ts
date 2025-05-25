import { expect } from '@playwright/test';
import { test } from '../../setup';
import Login from '../../../pages/components/login';
import AppleInsights from '../../../pages/reporting/appleInsights';
import AnalyticsCommonFilters from '../../../pages/components/analyticsCommonFilters';

test.describe('Validate apple insights dashboard for SP 3021', async () => {
  test.beforeEach('Login, navigate to apple dashboard', async ({ page }) => {
    await test.step('Login as SP 3021 admin', async () => {
        await page.goto(`${process.env.LOGIN_URL}`)
        const login = new Login(page)
        await login.userLogin('reportingadmin3021@uberall.com', process.env.LB_DEFAULT_PASSWORD)
    })

    await test.step('Navigate to google Dashboard', async () => {
      const appleInsights = new AppleInsights(page, '3021')
      await appleInsights.navigateToAppleDashboard()
    })
})

  test('Validate apple dashboard loads', async ({ page }) => {
    await test.step('Wait for report iframe to load', async () => {
      const appleInsights = new AppleInsights(page, '3021')
      await appleInsights.verifyDashboardLoad()
    })
  });
  
  test('Validate apple dashboard updates when location filter is set', async ({ page }) => {
    await test.step('Update report filters and compare values', async () => {
      const appleInsights = new AppleInsights(page, '3021')
      const filters = new AnalyticsCommonFilters(page)
      await appleInsights.verifyDashboardLoad()
      let allLocationsTotalViews = await appleInsights.getTotalViewsValue()
      console.log(allLocationsTotalViews)
      await filters.commonFiltersButton.click()
      await filters.addLocationFilter('2503')
      await filters.addLocationFilter('1002')
      await filters.applyFilters()
      let filteredTotalViews = await appleInsights.getTotalViewsValue()
      console.log(filteredTotalViews)
      await expect(allLocationsTotalViews).not.toEqual(filteredTotalViews)
    })
  });

  test('Validate apple dashboard previous time frame text', async ({ page }) => {
    await test.step('Wait for report to load, verify previous timeframe text', async () => {
      const appleInsights = new AppleInsights(page, '3021')
      const filters = new AnalyticsCommonFilters(page)
      await appleInsights.verifyDashboardLoad()
      let previousText = await appleInsights.getTotalViewsPreviousPeriod()
      await expect(previousText).toContain("Previous Period")
    })
  });

})
  