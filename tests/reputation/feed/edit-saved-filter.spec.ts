import { test, expect } from './feed-base'
import { FeedMainPage } from "../../../pages/feed/feed-main-page"
import { ToasterModal } from '../../../pages/feed/modals/toaster-modal'
import { ConfirmFilterEditsModal } from '../../../pages/feed/modals/confirm-filter-edits-modal'

test.describe( 'As an Admin [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-admin-session.json' })
    
    test('Edit a saved filter', async ({ feedMainPage, saveFilterChangesModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, saveFilterChangesModal, toasterModal)).toBeTruthy() 
    })
})

test.describe( 'As an Business Manager [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-business-session.json' })

    test('Edit a saved filter', async ({ feedMainPage, saveFilterChangesModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, saveFilterChangesModal, toasterModal)).toBeTruthy() 
    })
})

test.describe( 'As an Location Manager [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-location-session.json' })

    test('Edit a saved filter', async ({ feedMainPage, saveFilterChangesModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, saveFilterChangesModal, toasterModal)).toBeTruthy() 
    })
})

async function executeTestStepsUsing(feedMainPage: FeedMainPage, saveFilterChangesModal: ConfirmFilterEditsModal, toasterModal: ToasterModal): Promise<boolean> {
    const labelParameter = 'label1'
    const groupParameter = 'National Home Move - Reeds Rains'
    const filterName     = 'Playwright Filter'
    const successfulToasterMessage = 'The filter was successfully updated'

    await test.step(`Given navigation to the Feed page`, async () => {
        await feedMainPage.goto()
    })

    await test.step(`When editing a filter matching [${filterName}] with new parameters: [${labelParameter}], [${groupParameter}]`, async () => {
        await feedMainPage.savedFiltersDropdownComponent.selectFirstMatchingFilter(filterName)
        await feedMainPage.openFilterDropdownButton.click()
        await feedMainPage.filterDropdownComponent.selectLabelFilter(labelParameter)
        //await feedLandingPage.filterDropdownComponent.selectGroupFilterUsingClipboard(groupParameter)
        await feedMainPage.filterDropdownComponent.saveFilterButton.click()
        await saveFilterChangesModal.saveButton.click()
    })

    await test.step(`Then successful toast message is displayed: [${successfulToasterMessage}]`, async () => {
        await expect(toasterModal.savedFilterSuccessToaster).toBeVisible({ timeout: 5000 })
        await expect(toasterModal.savedFilterSuccessToaster).toHaveText(successfulToasterMessage)
    })
    return true
}
