import { test, expect } from './feed-base'
import { FeedMainPage } from "../../../pages/feed/feed-main-page"
import { ToasterModal } from "../../../pages/feed/modals/toaster-modal"
import { DeleteFilterConfirmModal } from '../../../pages/feed/modals/delete-filter-confirm-modal'

test.describe('As an Admin [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-admin-session.json' })

    test('Delete a saved filter', async ({ feedMainPage: feedMainPage, deleteFilterConfirmModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, deleteFilterConfirmModal, toasterModal)).toBeTruthy() 
    })
})

test.describe('As an Business Manager [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-business-session.json' })

    test('Delete a saved filter', async ({ feedMainPage, deleteFilterConfirmModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, deleteFilterConfirmModal, toasterModal)).toBeTruthy() 
    })
})

test.describe('As an Location Manager [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-location-session.json' })

    test('Delete a saved filter', async ({ feedMainPage, deleteFilterConfirmModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, deleteFilterConfirmModal, toasterModal)).toBeTruthy() 
    })
})

async function executeTestStepsUsing(feedMainPage: FeedMainPage, deleteFilterConfirmModal: DeleteFilterConfirmModal, toasterModal: ToasterModal): Promise<boolean> {
    const successfulToasterMessage = 'The filter was successfully deleted'

    await test.step(`Given navigating to the Feed page`, async () => {
        await feedMainPage.goto()
    })

    await test.step(`When deleting an existing filter`, async () => {
        await feedMainPage.savedFiltersDropdownComponent.deleteFirstMatchingFilter('Playwright')
        await deleteFilterConfirmModal.deleteButton.click()
    })

    await test.step(`Then successful toast message is displayed: [${successfulToasterMessage}]`, async () => {
        await expect(toasterModal.deleteFilterSuccessToaster).toBeVisible({ timeout: 5000 })
        await expect(toasterModal.deleteFilterSuccessToaster).toHaveText(successfulToasterMessage)
    })
    return true
}