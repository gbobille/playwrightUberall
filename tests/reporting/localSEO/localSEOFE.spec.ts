
import { test } from '../../setup';
import Login from '../../../pages/components/login';
import LocalSEOPage from '../../../pages/reporting/localSEO/localSEOPage';
import AnalyticsCommonFilters from '../../../pages/components/analyticsCommonFilters';

test.describe('Validate Local SEO dashboard for SP 3038 admin @localseoFE', async () => {
    test.beforeEach('Login as admin, navigate to dashboard', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('reportingadmin3038@uberall.com', process.env.API_PULLEDPORK_PASSWORD)
        })

        await test.step('Navigate to Local SEO Dashboard', async () => {
            const localSEO = new LocalSEOPage(page)
            await localSEO.navigateToLocalSEODashboard()
        })
    })

    test('LocalSEO dashboard UI check @localseoFE', async ({ page }) => {
        const localSEO = new LocalSEOPage(page)
        const filters = new AnalyticsCommonFilters(page)
        await test.step('Validate dashboard UI', async () => {
            await filters.checkFilterDropdown(["Accounts", "Groups", "Locations", "Keywords"], [])
            await localSEO.checkDateFilterDropdown()
            await localSEO.checkDashboardPanels()
        })
    });

    test('Keyword Ranking "What does this mean" modal check @localseoFE', async ({ page }) => {
        const localSEO = new LocalSEOPage(page)
        await test.step('Validate dashboard UI', async () => {
            await localSEO.openKeywordRankingModal()
            await localSEO.verifyKeywordRankingModalColors()
            await localSEO.keywordRankingModalCloseButton.click()
        })
    })
})

test.describe('Validate Local SEO dashboard for SP 3038 single-location manager @localseoFE', async () => {
    test.beforeEach('Login as single-loc user, navigate to dashboard', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('reportingsingleloc3038@uberall.com', process.env.API_PULLEDPORK_PASSWORD)
        })

        await test.step('Navigate to Local SEO Dashboard', async () => {
            const localSEO = new LocalSEOPage(page)
            await localSEO.navigateToLocalSEODashboard()
        })
    })

    test ('LocalSEO single-location manager UI check @localseoFE', async({ page }) => {
        const localSEO = new LocalSEOPage(page)
        const filters = new AnalyticsCommonFilters(page)
        await test.step('Validate dashboard UI and filter dropdown', async() => {
            await localSEO.checkDashboardPanels()
            await filters.checkFilterDropdown(["Keywords"], ["Accounts", "Groups", "Locations"])                
        })
    })
})

test.describe('Validate Local SEO dashboard for SP 3038 multi-location manager @localseoFE', async () => {
    test.beforeEach('Login as multi-loc user, navigate to dashboard', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('reportingmultiloc3038@uberall.com', process.env.API_PULLEDPORK_PASSWORD)
        })

        await test.step('Navigate to Local SEO Dashboard', async () => {
            const localSEO = new LocalSEOPage(page)
            await localSEO.navigateToLocalSEODashboard()
        })
    })

    test('LocalSEO multi-location manager UI check @localseoFE', async({ page }) => {
        const localSEO = new LocalSEOPage(page)
        const filters = new AnalyticsCommonFilters(page)
        await test.step('Validate dashboard UI and filter dropdown', async() => {
            await localSEO.checkDashboardPanels()
            await filters.checkFilterDropdown(["Groups", "Locations", "Keywords"], ["Accounts"])
        })
    })
})

test.describe('local SEO keyword ranking tests SP 1671 admin @localseoFE', async () => {
    test.beforeEach('Login as SP 1671 admin, navigate to dashboard', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('reportingadmin1671@uberall.com', process.env.LB_DEFAULT_PASSWORD)
        })

        await test.step('Navigate to Local SEO Dashboard', async () => {
            const localSEO = new LocalSEOPage(page)
            await localSEO.navigateToLocalSEODashboard()
        })
    })

    test('Verify keyword ranking column sort', async({ page }) => {
        const localSEO = new LocalSEOPage(page)
        const filters = new AnalyticsCommonFilters(page)
        await test.step('Set filters for Jan 2022 - Dec 2023', async() => {
            await localSEO.setDateFilters('January', '2022', 'December', '2023')
        })
        await test.step('Sort by Desc and Asc, verify sort order', async () => {
            await localSEO.verifyKeywordSortOrder('Inneneinrichtung')
        })
    })
})