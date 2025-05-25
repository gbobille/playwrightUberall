import { test, expect } from './feed-base'
import { SaveNewFilterModal } from '../../../pages/feed/modals/save-new-filter-modal'
import { formatCurrentDateToString } from '../../../utils/date-formatter-util' 
import { FeedMainPage } from '../../../pages/feed/feed-main-page'
import { ToasterModal } from '../../../pages/feed/modals/toaster-modal'

test.describe('As an Admin [SP 348]', { tag: '@reputation' }, () => {
    test.use({ storageState: '.auth/reputation-admin-session.json' })

    test('Create a new saved filter', async ({ feedMainPage, saveThisFilterModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, saveThisFilterModal, toasterModal)).toBeTruthy()
    })
})

test.describe('As an Business Manager [SP 348]', { tag: '@reputation' }, () => {
    test.use({ storageState: '.auth/reputation-business-session.json' })

    test('Create a new saved filter', async ({ feedMainPage, saveThisFilterModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, saveThisFilterModal, toasterModal)).toBeTruthy()
    })
})

test.describe('As a Location Manager [SP 348]', { tag: '@reputation' }, () => {
    test.use({ storageState: '.auth/reputation-location-session.json' })

    test('Create a new saved filter', async ({ feedMainPage, saveThisFilterModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, saveThisFilterModal, toasterModal)).toBeTruthy()
    })
})

async function executeTestStepsUsing(feedMainPage: FeedMainPage, saveThisFilterModal: SaveNewFilterModal, toasterModal: ToasterModal): Promise<boolean> {
    const successMessage = 'The filter was successfully saved'

    await test.step(`GIVEN success message = ${successMessage} AND landing on the Feed page`, async () => {
        await feedMainPage.goto()
    })

    await test.step(`WHEN creating a new filter`, async () => {
        await feedMainPage.filterDropdownComponent.filtersButton.click()
        await feedMainPage.filterDropdownComponent.selectDirectoryFilter("Google")
        await feedMainPage.filterDropdownComponent.saveFilterButton.click()
        await saveThisFilterModal.filterNameInputBox.fill(`Auto Playwright Filter ${await formatCurrentDateToString('dd.MM_HH:mm')}`)
        await saveThisFilterModal.saveButton.click()
    })

    await test.step(`THEN successful toast message is displayed: [${successMessage}]`, async () => {
        await expect(toasterModal.savedFilterSuccessToaster).toBeVisible({ timeout: 5000 })
        await expect(toasterModal.savedFilterSuccessToaster).toHaveText(successMessage)
    })
    return true
}
