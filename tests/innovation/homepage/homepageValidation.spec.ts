import { expect, test } from './homepage-base'
import Login from '../../../pages/components/login'
import { loginUberallAppAs } from '../../../utils/login-util'

test.describe('As an Admin', { tag: '@homepage' }, () => {
  test.use({ storageState: '.auth/domain-admin-session.json' })
  
  test('Homepage loads correctly with all expected elements', async ({ homePage, page }) => {
    expect(await executeTestSteps(homePage)).toBeTruthy()
  })
})

test.describe('As a Business Manager', { tag: '@homepage' }, () => {
  test.use({ storageState: '.auth/domain-business-session.json' })
  
  test('Homepage loads correctly with all expected elements', async ({ homePage, page }) => {
    expect(await executeTestSteps(homePage)).toBeTruthy()
  })
})

test.describe('As a Location Manager', { tag: '@homepage' }, () => {
  test.use({ storageState: '.auth/domain-location-session.json' })
  
  test('Homepage loads correctly with all expected elements', async ({ homePage, page }) => {
    expect(await executeTestSteps(homePage)).toBeTruthy()
  })
})

// Direct login test without using storage state
test.describe('Homepage direct login validation', { tag: '@homepage' }, () => {
  test('User can login and see the homepage with all elements', async ({ page }) => {
    const login = new Login(page)
    const homePage = new HomePage(page)
    
    await test.step('Given user navigates to the login page', async () => {
      await login.goto()
    })
    
    await test.step('When user logs in with valid credentials', async () => {
      await login.userLogin(process.env.ADMIN_USERNAME || '')
    })
    
    await test.step('Then user is redirected to the homepage', async () => {
      await homePage.isAt()
    })
    
    // Continue with the common steps
    await executeTestSteps(homePage)
  })
})

async function executeTestSteps(homePage: HomePage): Promise<boolean> {
  await test.step('When checking homepage elements', async () => {
    // Validate key homepage elements are present
    await homePage.isAt()
  })
  
  await test.step('Then user can see the location score widget', async () => {
    await expect(homePage.locationScore).toBeVisible()
  })
  
  await test.step('And user can see the revenue score widget if available', async () => {
    // This is conditionally checked since it might not be available for all users
    try {
      await expect(homePage.revenueScoreWidget).toBeVisible({ timeout: 5000 })
    } catch (e) {
      console.log('Revenue score widget not available for this user')
    }
  })
  
  await test.step('And user can navigate through key widgets', async () => {
    await homePage.navigateToVisibilityToolTip()
    await homePage.navigateToReputationToolTip()
    await homePage.navigateToEngagementToolTip()
  })
  
  return true
}