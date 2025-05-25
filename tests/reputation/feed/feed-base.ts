import { test as base} from '@playwright/test'
import { FeedMainPage } from '../../../pages/feed/feed-main-page'
import { SaveNewFilterModal } from '../../../pages/feed/modals/save-new-filter-modal'
import { ToasterModal } from '../../../pages/feed/modals/toaster-modal'
import { DeleteFilterConfirmModal } from '../../../pages/feed/modals/delete-filter-confirm-modal'
import { ConfirmFilterEditsModal } from '../../../pages/feed/modals/confirm-filter-edits-modal'
import { SavedFilterSettingsModal } from '../../../pages/feed/modals/saved-filter-edit-modal'
import { ExportModal } from '../../../pages/feed/modals/export-modal'
import { BulkPromptModal } from '../../../pages/feed/modals/bulk-prompt-modal'
import { BulkAIResponsesModal } from '../../../pages/feed/modals/bulk-AI-responses-modal'
import Login from '../../../pages/components/login'

type FeedFixtures = {
    loginPage               : Login
    feedMainPage            : FeedMainPage
    saveThisFilterModal     : SaveNewFilterModal
    toasterModal            : ToasterModal
    deleteFilterConfirmModal: DeleteFilterConfirmModal
    saveFilterChangesModal  : ConfirmFilterEditsModal
    savedFilterSettingsModal: SavedFilterSettingsModal
    exportModal             : ExportModal
    bulkPromptModal         : BulkPromptModal
    bulkAIResponsesModal    : BulkAIResponsesModal
}

export const test = base.extend<FeedFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new Login(page))
    },
    feedMainPage: async ({ page }, use) => {
        await use(new FeedMainPage(page))
    },
    saveThisFilterModal: async ({ page }, use) => {
        await use(new SaveNewFilterModal(page))
    },
    toasterModal: async ({ page }, use) => {
        await use(new ToasterModal(page))
    },
    deleteFilterConfirmModal: async ({ page }, use) => {
        await use(new DeleteFilterConfirmModal(page))
    },
    saveFilterChangesModal: async ({ page }, use) => {
        await use(new ConfirmFilterEditsModal(page))
    },
    savedFilterSettingsModal: async ({ page }, use) => {
        await use(new SavedFilterSettingsModal(page))
    },
    exportModal: async ({ page }, use) => {
        await use(new ExportModal(page))
    },
    bulkPromptModal: async ({ page }, use) => {
        await use(new BulkPromptModal(page))
    },
    bulkAIResponsesModal: async ({ page }, use) => {
        await use(new BulkAIResponsesModal(page))
    }
})

export { expect } from '@playwright/test'