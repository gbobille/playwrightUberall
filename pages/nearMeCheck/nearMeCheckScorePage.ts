import { Locator, Page } from '@playwright/test'

export class NearMeCheckScorePage {
    readonly page: Page

    readonly allSectionInPage: Locator
    readonly googleCustomerRating: Locator

    constructor(page: Page) {
        this.page = page
        this.allSectionInPage = page.locator('#uberall-near-me-check')
        this.googleCustomerRating = page.locator('.uberall-nmc-gry4s6')
    }

    async isAt(): Promise<boolean> {
            await this.allSectionInPage.waitFor({ state: 'visible', timeout: 60000 })
            await this.googleCustomerRating.waitFor({ state: 'visible', timeout: 60000 })
            return true
    }

    async getGoogleScorePattern(): Promise<string> {
        return await this.googleCustomerRating.innerText()
    }

    async getGoogleScore(): Promise<{ actualValue: number; maxValue: number }> {
        const scorePattern = await this.getGoogleScorePattern()
        const [actual, max] = scorePattern.split('/')
        const score = {
            actualValue: parseInt(actual),
            maxValue: parseInt(max)
        }
        console.log(`Near Me score is: ${score.actualValue}/${score.maxValue}`)
        return score
    }
}
