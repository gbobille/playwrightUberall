import { Locator, Page } from "@playwright/test";

export default class TaskManagement {
    createTaskButton    : Locator
    listSelected        : (listToSelect:string) => Locator
    listSelectedOption  : (optionToSelect:string) => Locator
    nextButton          : (wizardTab:string) => Locator
    locationListIds     : Locator
    assigneesList       : Locator
    initiateButton      : (wizardTab:string) => Locator
    filterSearch        : Locator
    activeTabButton     : Locator
    nextButton_filters  : (wizardTab:string) => Locator
    clearFilterButton   : Locator
    poiIDList           : Locator

    constructor (private page: Page) {
        this.createTaskButton   = this.page.locator('mat-icon[class="mat-icon notranslate material-icons mat-icon-no-color"]').filter({hasText:'add'})

        //Task Builder Wizard
        this.listSelected       = (listToSelect:string) => this.page.getByRole('listbox', { name: listToSelect }).locator('span').first()
        this.listSelectedOption = (optionToSelect:string) => this.page.getByRole('option', { name: optionToSelect, exact: true }).locator('span')

        this.nextButton         = (wizardTab:string) => this.page.getByLabel(wizardTab).getByRole('button', { name: 'Next' })
        this.locationListIds    = this.page.locator('textarea[placeholder="Location Ids"]')
        this.assigneesList      = this.page.locator('input[placeholder="Enter assignees"]')
        this.initiateButton     = (wizardTab:string) => this.page.getByLabel(wizardTab).getByRole('button', { name: 'Initiate' })
        this.nextButton_filters = (wizardTab:string) => this.page.getByLabel(wizardTab).getByText('Next')
        this.activeTabButton    = this.page.locator('div[class="mat-step-label mat-step-label-active mat-step-label-selected"]')
        this.poiIDList          = this.page.locator('textarea[placeholder="PoI Ids"]')

        //Filters
        this.filterSearch       = this.page.locator('input[type="Text"]')
        this.clearFilterButton  = this.page.locator('button mat-icon[role="img"]').filter({hasText:'close'})
    }

    async createTask_Step1(listType:string, listTypeSelected:string, listSource:string, listSourceSelected:string){
        await this.createTaskButton.click()
        await this.listSelected(listType).click()
        await this.listSelectedOption(listTypeSelected).click()
        await this.listSelected(listSource).click({delay:3000})
        await this.listSelectedOption(listSourceSelected).click()
        await this.nextButton('1Select task').click({delay:3000})
    }
}