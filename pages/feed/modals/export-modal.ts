import { Locator, Page } from '@playwright/test'

export class ExportModal {
    readonly page                 : Page
    readonly xlsxRadioOption      : Locator
    readonly csvRadioOption       : Locator
    readonly cancelButton         : Locator
    readonly exportButton         : Locator

    constructor (page: Page) {
        this.page                  = page
        this.xlsxRadioOption       = page.locator('label').filter({ hasText: 'XLSX' })
        this.csvRadioOption        = page.locator('label').filter({ hasText: 'CSV' })
        this.cancelButton          = page.getByTestId('modal-cancel-datapoints-button')
        this.exportButton          = page.getByTestId('modal-export-datapoints-button')
    } 
}