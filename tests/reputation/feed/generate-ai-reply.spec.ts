import { test, expect } from './feed-base'
import { FeedMainPage } from "../../../pages/feed/feed-main-page"

test.describe("As an Admin [SP 348]", { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-admin-session.json' })

    test('Generate an AI reply using "Suggest a Reply"', async ({ feedMainPage }) => {
        expect(await executeTestSteps(feedMainPage)).toBeTruthy()
    })
})

test.describe("As an Business Manager [SP 348]", { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-business-session.json' })

    test('Generate an AI reply using "Suggest a Reply"', async ({ feedMainPage }) => {
        expect(await executeTestSteps(feedMainPage)).toBeTruthy()
    })
})

test.describe("As an Location Manager [SP 348]", { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-location-session.json' })

    test('Generate an AI reply using "Suggest a Reply"', async ({ feedMainPage }) => {
        expect(await executeTestSteps(feedMainPage)).toBeTruthy()
    })
})

async function executeTestSteps(feedMainPage: FeedMainPage): Promise<boolean> {
    const filterName = 'JS Google AI Reply Filter'

    await test.step(`Given navigation to the Feed page`, async () => {
        await feedMainPage.goto()
    })

    await test.step(`When selecting an event in filter: [${filterName}]`, async () => {
        await feedMainPage.savedFiltersDropdownComponent.selectExactMatchingFilter(filterName)
        await feedMainPage.feedViewComponent.eventCardItem(0).click()
    })

    await test.step(`And selecting 'Suggest A Reply'`, async () => {
        await feedMainPage.feedViewComponent.suggestReplyButton.click({timeout: 10000})
    })

    await test.step(`Then a reply an AI reply is generated`, async () => {
        await expect(feedMainPage.feedViewComponent.replyTextArea).not.toBeEmpty({timeout: 10000})
        await expect(feedMainPage.feedViewComponent.openAIReplyConfirmation).toBeVisible()
    })

    return true
}
