import { FeedMainPage } from '../../../pages/feed/feed-main-page'
import { expect, test } from './feed-base'

test.describe('As an Admin [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-admin-session.json' })

    test('Feed page loads upon navigation', async ({ feedMainPage }) => {
        expect(await executeTestSteps(feedMainPage)).toBeTruthy()
    })
})

test.describe('As a Business Manager [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-business-session.json' })

    test('Feed page loads upon navigation', async ({ feedMainPage }) => {
        expect(await executeTestSteps(feedMainPage)).toBeTruthy()
    })
})

test.describe('As a Location Manager User [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-location-session.json' })

    test('Feed page loads upon navigation', async ({ feedMainPage }) => {
        expect(await executeTestSteps(feedMainPage)).toBeTruthy()
    })
})

async function executeTestSteps(feedMainPage: FeedMainPage): Promise<boolean> {

    await test.step(`When navigating to the Feed page`, async () => {
        await feedMainPage.goto()
    })

    await test.step(`Then page loads successfully`, async () => {
        await expect(feedMainPage.exportButton).toBeVisible()
        await expect(feedMainPage.filterDropdownComponent.filtersButton).toBeVisible()
        await expect(feedMainPage.feedViewComponent.eventCardList).toBeVisible()
        await expect(feedMainPage.savedFiltersDropdownComponent.savedFiltersCombobox).toBeVisible()
    })

    await test.step(`When clicking on the first event card`, async () => {
        await feedMainPage.feedViewComponent.eventCardItem(0).click()
    })

    await test.step(`Then event details are displayed`, async () => {
        await expect(feedMainPage.feedViewComponent.eventText).toBeVisible()
    })

    return true
}
