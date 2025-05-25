import { expect, test } from './feed-base'
import { FeedTestProperties } from "./feed-test-properties"
import { FeedMainPage } from "../../../pages/feed/feed-main-page"

test.describe('As a user who is not associated with SP 348', { tag: '@reputation'}, () => {

    test('Admin cannot see Feed events from SP 348', async ({ loginPage, feedMainPage }) => {
        await  loginPage.loginSkipLandingValidation(FeedTestProperties.securityAdminUsername, FeedTestProperties.crossfeedDefaultPassword)
        expect(await executeTestStepsUsing(feedMainPage)).toBeTruthy()
    })

    test('Business Manager cannot see Feed events from SP 348', async ({ loginPage, feedMainPage }) => {
        await loginPage.loginSkipLandingValidation(FeedTestProperties.secutriyBusinessUsername, FeedTestProperties.crossfeedDefaultPassword)
        expect(await executeTestStepsUsing(feedMainPage)).toBeTruthy()
    })

    test('Location Manager cannot see Feed events from SP 348', async ({ loginPage, feedMainPage }) => {
        await loginPage.loginSkipLandingValidation(FeedTestProperties.securityLocationUsername, FeedTestProperties.crossfeedDefaultPassword)
        expect(await executeTestStepsUsing(feedMainPage)).toBeTruthy()
    })

    test('Location Manager via LocationGroups cannot see Feed events from SP 348', async ({ loginPage, feedMainPage}) => {
        await loginPage.loginSkipLandingValidation(FeedTestProperties.securityLocationGroupUsername, FeedTestProperties.crossfeedDefaultPassword)
        expect(await executeTestStepsUsing(feedMainPage)).toBeTruthy()
    })
})

async function executeTestStepsUsing(feedMainPage: FeedMainPage): Promise<boolean> {

    await test.step(`When navigating to the Feed page`, async () => {
        await feedMainPage.goto()
    })

    await test.step(`Then user does not see reviews it does not have access to`, async () => {
        await expect(feedMainPage.noResultsMessage).toBeVisible({ timeout: 15 * 1000 })
        await expect(feedMainPage.noResultsMessage).toHaveText('No results were found. Check your filters.')
    })

    return true
}