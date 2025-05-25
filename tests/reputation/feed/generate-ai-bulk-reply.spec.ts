import { test, expect } from './feed-base'
import { FeedMainPage } from "../../../pages/feed/feed-main-page"
import { BulkPromptModal } from '../../../pages/feed/modals/bulk-prompt-modal'
import { BulkAIResponsesModal } from '../../../pages/feed/modals/bulk-AI-responses-modal'


test.describe("As an Admin [SP 348]", { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-admin-session.json' })

    test('Generate Bulk AI replies', async ({ feedMainPage, bulkPromptModal, bulkAIResponsesModal }) => {
        expect(await executeTestSteps(feedMainPage, bulkPromptModal, bulkAIResponsesModal)).toBeTruthy()
    })
})

test.describe("As an Business Manager [SP 348]", { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-business-session.json' })

    test('Generate Bulk AI replies', async ({ feedMainPage, bulkPromptModal, bulkAIResponsesModal }) => {
        expect(await executeTestSteps(feedMainPage, bulkPromptModal, bulkAIResponsesModal)).toBeTruthy()
    })
})

test.describe("As an Location Manager [SP 348]", { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-location-session.json' })

    test('Generate Bulk AI replies', async ({ feedMainPage, bulkPromptModal, bulkAIResponsesModal }) => {
        expect(await executeTestSteps(feedMainPage, bulkPromptModal, bulkAIResponsesModal)).toBeTruthy()
    })
})

async function executeTestSteps(feedMainPage: FeedMainPage, bulkPromptModal: BulkPromptModal, bulkAIResponsesModal: BulkAIResponsesModal): Promise<boolean> {
    const filterName = 'JS Google AI Reply Filter'

    await test.step(`Given navigation to the Feed page`, async () => {
        await feedMainPage.goto()
    })

    await test.step(`When selecting over 2 events in filter: [${filterName}]`, async () => {
        await feedMainPage.savedFiltersDropdownComponent.selectExactMatchingFilter(filterName)
        await feedMainPage.feedViewComponent.eventCheckbox(0).click()
        await feedMainPage.feedViewComponent.eventCheckbox(1).click()
    })

    await test.step(`And selecting bulk reply with AI`, async () => {
        await feedMainPage.bulkReplyButton.click()
        await bulkPromptModal.generateAIButton.click()
    })

    await test.step(`Then AI replies are generated`, async () => {
        await expect(bulkAIResponsesModal.aiGeneratedReply(0)).toBeVisible()
        await expect(bulkAIResponsesModal.aiGeneratedReply(1)).toBeVisible()
    })

    await test.step(`When submitting replies`, async () => {
        await bulkAIResponsesModal.replyButton.click()
    })

    await test.step(`Then an error is displayed`, async () => {
        await expect(bulkAIResponsesModal.errorMessage.nth(0)).toBeVisible()
        await expect(bulkAIResponsesModal.errorMessage.nth(1)).toBeVisible()
    })

    return true
 }
 