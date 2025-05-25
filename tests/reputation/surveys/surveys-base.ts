import { test as base } from '@playwright/test'
import Login from '../../../pages/components/login'
import { SurveysPage } from '../../../pages/reputation/surveys/surveys-page'

export const test = base.extend<{
    loginPage: Login
    surveysPage: SurveysPage
}>({
    loginPage: async ({ page }, use) => {
        await use(new Login(page))
    },
    surveysPage: async ({ page }, use) => {
        await use(new SurveysPage(page))
    },
})

export { expect } from '@playwright/test'
