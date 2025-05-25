import { test } from '../../setup';
import Login from '../../../pages/components/login';
import FacebookReach from '../../../pages/reporting/facebookReach';

test.describe('Validate Facebook Reach Dashboard for SP 3006', async () => {
  test.beforeEach('Login, navigate to Facebook Reach dashboard', async ({ page }) => {
    await test.step('Login as SP 3006 admin', async () => {
        await page.goto(`${process.env.LOGIN_URL}`)
        const login = new Login(page)
        await login.userLogin('reportingAdmin3006@uberall.com', process.env.LB_DEFAULT_PASSWORD)
    })

    await test.step('Navigate to Facebook Reach Dashboard', async () => {
      const facebookReach = new FacebookReach(page)
      await facebookReach.navigateToFacebookReachDashboard()
    })
})

  test('Validate Facebook Reach dashboard loads', async ({ page }) => {
    await test.step('Wait for report iframe to load', async () => {
      const facebookReach = new FacebookReach(page)
      await facebookReach.verifyDashboardLoad()
    })
  });

  test('Validate Facebook Reach Filters is shown', async ({ page }) => {
    await test.step('Wait for report iframe to load', async () => {
      const facebookReach = new FacebookReach(page)
      await facebookReach.verifyFilterBarIsShown()
    })
  });

  test('Validate Facebook Reach Filters are correct', async ({ page }) => {
    await test.step('Wait for report iframe to load', async () => {
      const facebookReach = new FacebookReach(page)
      await facebookReach.verifyFacebookReachFilters()
    })
  });

  test.skip('WIP: Download Page Reach details', async ({ page }) => {
    await test.step('Wait for report iframe to load', async () => {
      const facebookReach = new FacebookReach(page)
      await facebookReach.downloadPageReachDetails()
    })
  });
})
  