import { test as base } from '@playwright/test'
import HomePage from '../../../pages/innovation/homepage/homepage'

// Extend the base test with custom fixtures
export const test = base.extend<{
  homePage: HomePage;
}>({
  // Define the fixture implementation
  homePage: async ({ page }, use) => {
    // Setup: create the page object
    const homePage = new HomePage(page);
    
    // Use the fixture in tests
    await use(homePage);
    
    // Optional teardown code runs after the test completes
  },
})

// Re-export expect for convenience
export { expect } from '@playwright/test'