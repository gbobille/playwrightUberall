import { Locator, Page, expect } from "@playwright/test";

export default class scheduledUpdates {
    dateFilter: Locator
    datePicker: Locator
    scheduleButton: Locator
    openTimeMenu: Locator
    timePicker: Locator
    nextButton: Locator
    createScheduleButton: Locator
    scheduleSuccessMessage: Locator
    deleteButton: Locator
    confirmDelete: Locator
    readonly getDate : (date : string) => Locator


    constructor(page: Page) {
        this.dateFilter = page.getByTestId('scheduled-updates-filter_open-filters')
        this.scheduleButton = page.getByRole('button', { name: 'Schedule for Later' })
        this.datePicker = page.getByTestId('scheduled-updates-datePicker_open-picker')
        this.openTimeMenu = page.getByTestId('scheduled-updates-time-dropdown_select-wrapper').locator('svg')
        this.timePicker = page.getByTestId('00:30')
        this.nextButton = page.getByTestId('date-time-modal-confirm-btn')
        this.createScheduleButton = page.getByTestId('review-changes-modal-confirm-btn')
        this.scheduleSuccessMessage = page.getByText('Scheduled changes will be')
        this.getDate = (date : string) => page.getByText(`${date}`)
        this.deleteButton = page.getByText('Delete').first()
        this.confirmDelete = page.getByTestId('confirmation-modal-confirm-btn')
    }
}