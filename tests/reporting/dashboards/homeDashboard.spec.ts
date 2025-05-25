import { test, } from '../../setup';
import { expect } from '@playwright/test';
import Login from '../../../pages/components/login';
import HomeDashboard from '../../../pages/base/dashboardPage';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe("Validate Home Dashboard loads for SP 3006 @dashboardsFE", async () => {
    test('Home dashboard UI check', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('3006monitoring@uberall.com', process.env.LB_DEFAULT_PASSWORD)

        })

        const homeDashboard = new HomeDashboard(page)

        await test.step("proceed to Home Dashboard page", async () => {
            await homeDashboard.navigateToHomeDashboard()
        })

        await test.step("Wait for Dashboard to Load", async () => {
            await homeDashboard.verifyDashboardLoad()
        })

    });
})

test.describe("Verify Home Dashboard Filter Functionality @dashboardsFE", async () => {
    test('Home dashboard Filter by Location', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('3006monitoring@uberall.com', process.env.LB_DEFAULT_PASSWORD)
        })

        const homeDashboard = new HomeDashboard(page)

        await test.step("proceed to Home Dashboard page", async () => {
            await homeDashboard.navigateToHomeDashboard()
        })

        await test.step("Wait for Dashboard to Load", async () => {
            await homeDashboard.verifyDashboardLoad()
        })

        await test.step("Filter by Location", async () => {
            await homeDashboard.filterByLocation("Tully Road")
        })
    });

    test('Home dashboard Filter by Date', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('3006monitoring@uberall.com', process.env.LB_DEFAULT_PASSWORD)
        })

        const homeDashboard = new HomeDashboard(page)

        await test.step("proceed to Home Dashboard page", async () => {
            await homeDashboard.navigateToHomeDashboard()
        })

        await test.step("Wait for Dashboard to Load", async () => {
            await homeDashboard.verifyDashboardLoad()
        })

        await test.step("Filter by Date", async () => {
            await homeDashboard.filterByDate()
        })
    });

    test('Home dashboard Filter by Date & Location', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('3006monitoring@uberall.com', process.env.LB_DEFAULT_PASSWORD)
        })

        const homeDashboard = new HomeDashboard(page)

        await test.step("proceed to Home Dashboard page", async () => {
            await homeDashboard.navigateToHomeDashboard()
        })

        await test.step("Wait for Dashboard to Load", async () => {
            await homeDashboard.verifyDashboardLoad()
        })

        await test.step("Filter by Location", async () => {
            await homeDashboard.filterByLocation("Tully Road")
        })

        await test.step("Filter by Date", async () => {
            await homeDashboard.filterByDate()
        })
    });

    test('Home dashboard - Download Excel Metrics', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('3006monitoring@uberall.com', process.env.LB_DEFAULT_PASSWORD)
        })

        const homeDashboard = new HomeDashboard(page)

        await test.step("proceed to Home Dashboard page", async () => {
            await homeDashboard.navigateToHomeDashboard()
        })

        await test.step("Wait for Dashboard to Load", async () => {
            await homeDashboard.verifyDashboardLoad()
        })

        await test.step("Filter by Location", async () => {
            await homeDashboard.filterByLocation("Tully Road")
        })

        await test.step("Filter by Date", async () => {
            await homeDashboard.filterByDate()
        })

        await test.step("Download Excel Metrics", async () => {
            await homeDashboard.clickOnDownloadYourMetrics()

        });

        await test.step("Validate Excel File", async () => {
            await homeDashboard.validateExcelFile('testsDownloads/metrics.xlsx')
        });
    })

    test('Home dashboard - Verify Dashboard Updates when changing dates', async ({ page }) => {
        await test.step('Login as admin', async () => {
            await page.goto(`${process.env.LOGIN_URL}`)
            const login = new Login(page)
            await login.userLogin('3006monitoring@uberall.com', process.env.LB_DEFAULT_PASSWORD)
        })

        const homeDashboard = new HomeDashboard(page)

        await test.step("proceed to Home Dashboard page", async () => {
            await homeDashboard.navigateToHomeDashboard()
        })

        await test.step("Wait for Dashboard to Load", async () => {
            await homeDashboard.verifyDashboardLoad()
        })

        await test.step("Filter by Location", async () => {
            await homeDashboard.filterByLocation("Tully Road")
        })

        await test.step("Change dates and Verify data changed on the dashboard", async () => {
            const dataChanged = await homeDashboard.verifyDataChangesOnWidgets();
            expect(dataChanged).toBe(true);
        })
    })
})