import { expect } from '@playwright/test';
import { test } from '../../setup';
import Login from '../../../pages/components/login';
import GoogleInsights from '../../../pages/reporting/googleInsights';
import AnalyticsCommonFilters from '../../../pages/components/analyticsCommonFilters';

test.describe('Validate google insights dashboard for SP 3038 admin', async () => {
    // TODO: update sales partner ID to use config file

    test.beforeEach('Login, navigate to google dashboard', async ({ page }) => {
        await test.step('Login as SP 3038 admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('reportingadmin3038@uberall.com', process.env.API_TEST_PASSWORD)
        })

        await test.step('Navigate to google Dashboard', async () => {
            const googleInsights = new GoogleInsights(page, '3038')
            await googleInsights.navigateToGoogleDashboard()
        })
    })

    test('Validate google dashboard loads for each tab', async ({ page }) => {
        const googleInsights = new GoogleInsights(page, '3038')
        await googleInsights.verifyAwarenessTabLoad()
        await googleInsights.clickDashboardTab('interactions')
        await googleInsights.verifyInteractionsTabLoad()
        await googleInsights.clickDashboardTab('conversion')
        await googleInsights.verifyConversionTabLoad()
    })

    test('Validate google dashboard data changes when location filters are updated', async ({ page }) => {
        const googleInsights = new GoogleInsights(page, '3038')
        const filters = new AnalyticsCommonFilters(page)
        await googleInsights.verifyAwarenessTabLoad()
        let allLocationsImpressions = await googleInsights.getMapsImpressionsValue()
        console.log(allLocationsImpressions)
        await filters.commonFiltersButton.click()
        await filters.addLocationFilter('CA118')
        await filters.addLocationFilter('CA120')
        await filters.applyFilters()
        let filteredLocationsImpressions = await googleInsights.getMapsImpressionsValue()
        console.log(filteredLocationsImpressions)
        await expect(allLocationsImpressions).not.toEqual(filteredLocationsImpressions)
    })

})
