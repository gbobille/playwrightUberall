import { Locator, Page } from '@playwright/test'

export class SurveysPage {
    static readonly url: string = '/en/app/uberall/surveys'
    readonly page: Page
    readonly header: Locator
    readonly newSurveyButton: Locator
    readonly searchInput: Locator
    readonly searchButton: Locator
    readonly publishedSurveysHeader: Locator
    readonly publishedSurveysTable: Locator
    readonly unpublishedSurveysHeader: Locator
    readonly unpublishedSurveysTable: Locator

    constructor(page: Page) {
        this.page = page
        this.header = page.getByText('Surveys').first()
        this.newSurveyButton = page.getByRole('button', { name: 'New Survey' })
        this.searchInput = page.getByRole('textbox', { name: 'Search' })
        this.searchButton = page.getByRole('button', { name: 'Search' })
        this.publishedSurveysHeader = page.getByText('Published Surveys', { exact: true })
        this.publishedSurveysTable = page.locator('table').first()
        this.unpublishedSurveysHeader = page.getByText('Unpublished Surveys')
        this.unpublishedSurveysTable = page.locator('table').last()
    }

    async goto() {
        await this.page.goto(SurveysPage.url, { waitUntil: 'domcontentloaded' })
    }
}
