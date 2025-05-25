import { test, expect } from './feed-base'
import { FeedMainPage } from "../../../pages/feed/feed-main-page"
import { ToasterModal } from "../../../pages/feed/modals/toaster-modal"
import { ExportModal } from "../../../pages/feed/modals/export-modal"

test.describe( 'As an Admin [SP 348]', { tag: '@reputation'}, () => {
    test.use({ storageState: '.auth/reputation-admin-session.json' })

    test('Export Feed reviews into a downloadable XLSX', async ({ feedMainPage, exportModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, exportModal, toasterModal, exportModal.xlsxRadioOption.click())).toBeTruthy() 
    })

    test('Export Feed reviews into a downloadable CSV', async ({ feedMainPage, exportModal, toasterModal }) => {
        expect(await executeTestStepsUsing(feedMainPage, exportModal, toasterModal, exportModal.csvRadioOption.click())).toBeTruthy() 
    })
})

async function executeTestStepsUsing(feedMainPage: FeedMainPage, exportModal: ExportModal, toasterModal: ToasterModal, exportAction: Promise<void>): Promise<boolean> {
    const filterName      = 'Browers Brownies SLC'
    const progressMessage = 'Export in progress, please wait'
    const successMessage  = 'Export complete! Your file has been downloaded.'

    await test.step(`Given navigation to the Feed page`, async () => {
        await feedMainPage.goto()
    })  

    await test.step(`When exporting events using the filter: [${filterName}]`, async () => {
        await feedMainPage.savedFiltersDropdownComponent.selectExactMatchingFilter(filterName)
        await feedMainPage.exportButton.click()
        await exportAction
        await exportModal.exportButton.click()
    })

    await test.step(`And after a loading toast message is displayed: [${progressMessage}]`, async () => {
        await expect(toasterModal.feedSuccessToaster).toBeVisible({ timeout: 10 * 1000 })
        // TODO:make this work -> await expect(toasterModal.feedSuccessToaster).toHaveText(progressMessage, { timeout: 20 * 1000 })
    })

    await test.step(`Then successful toast message is displayed: [${successMessage}]`, async () => {
        await expect(toasterModal.feedSuccessToaster).toBeVisible({ timeout: 5000 })
        await expect(toasterModal.feedSuccessToaster).toHaveText(successMessage)
    })
    
    return true
}