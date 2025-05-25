import { test as base } from '@playwright/test'
import HomePage from '../../../pages/innovation/homepage/homepage'
import { TasksComponent } from '../../../pages/innovation/homepage/components/tasksComponent'

// Extend the base test with custom fixtures
export const test = base.extend<{
  homePage: HomePage;
  tasksComponent: TasksComponent;
}>({
  // Define fixture implementations
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  
  tasksComponent: async ({ page }, use) => {
    const tasksComponent = new TasksComponent(page);
    await use(tasksComponent);
  },
})

// Re-export expect for convenience
export { expect } from '@playwright/test'