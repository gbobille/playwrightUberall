import { test, expect } from './feed-base'
import { FeedMainPage } from '../../../pages/feed/feed-main-page'

test.describe('As an Admin [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-admin-session.json' })
    
    test('View a non-owned shared filter', async ({ feedMainPage }) => {
        expect(await executeTestSteps(feedMainPage, 'JS Business Filter Test')).toBeTruthy()
    })
})

test.describe('As an Business Manager [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-business-session.json' })

    test('View a non-owned shared filter', async ({ feedMainPage }) => {
        expect(await executeTestSteps(feedMainPage, 'TrustPilot Notification Filter')).toBeTruthy()
    })
})

test.describe('As an Location Manager [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-location-session.json' })

    test('View a non-owned shared filter', async ({ feedMainPage }) => {
        expect(await executeTestSteps(feedMainPage, 'JS Business Filter Test')).toBeTruthy()    })
})

async function executeTestSteps(feedMainPage: FeedMainPage, filterName: string): Promise<boolean> {

    await test.step(`Given navigation to the Feed page`, async () => {
        await feedMainPage.goto()
    })

    await test.step(`When searching for shared filter: [${filterName}]`, async () => {
        await feedMainPage.savedFiltersDropdownComponent.savedFiltersCombobox.fill(filterName)
    })

    await test.step(`Then shared filter: [${filterName}] is visible in the saved filter dropdown list`, async () => {
        await expect(feedMainPage.savedFiltersDropdownComponent.savedFilterSavedList.getByText(filterName, { exact: true })).toBeVisible()
    })
    
    return true
}