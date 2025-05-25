import { expect, test } from './surveys-base'

test.describe('Surveys Page UI Elements', { tag: '@surveys' }, () => {
    test('Verify essential UI elements are visible on Surveys page', async ({ loginPage, surveysPage }) => {
        await test.step('Given logged in as an automation user', async () => {
            await loginPage.loginSkipLandingValidation('crossfeedautomation@uberall.com', 'uberall-qa-fun')
        })

        await test.step('When navigating to the Surveys page', async () => {
            await surveysPage.goto()
        })

        await test.step('Then the page header should be visible', async () => {
            await expect(surveysPage.header).toBeVisible()
        })

        await test.step('And the New Survey button should be visible', async () => {
            await expect(surveysPage.newSurveyButton).toBeVisible()
        })

        await test.step('And the search functionality should be visible', async () => {
            await expect(surveysPage.searchInput).toBeVisible()
            await expect(surveysPage.searchButton).toBeVisible()
        })

        await test.step('And the Published Surveys section should be visible', async () => {
            await expect(surveysPage.publishedSurveysHeader).toBeVisible()
            await expect(surveysPage.publishedSurveysTable).toBeVisible()
        })

        await test.step('And the Unpublished Surveys section should be visible', async () => {
            await expect(surveysPage.unpublishedSurveysHeader).toBeVisible()
            await expect(surveysPage.unpublishedSurveysTable).toBeVisible()
        })
    })
})
