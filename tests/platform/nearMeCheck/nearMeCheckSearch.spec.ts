import {test} from '../../setup'
import {expect} from "@playwright/test"
import {NearMeCheckPage} from '../../../pages/nearMeCheck/nearMeCheckPage'
import {NearMeCheckScorePage} from '../../../pages/nearMeCheck/nearMeCheckScorePage'

test.describe('Near Me Check Search Tests', {tag: '@nearMeCheck'}, () => {
    let nearMeCheckPage: NearMeCheckPage
    let nearMeCheckScorePage: NearMeCheckScorePage

    test.beforeEach(async ({page}) => {
        nearMeCheckPage = new NearMeCheckPage(page)
        nearMeCheckScorePage = new NearMeCheckScorePage(page)
        await nearMeCheckPage.goto()
    })

    test('Verify user can perform a Near Me Check search with valid data', async ( {step}) => {
        await step('Given user is on Near Me Check page', async () => {
            await nearMeCheckPage.isAt()
        })

        await step('When user performs a Near Me Check search with valid data', async () => {
            await nearMeCheckPage.performNearMeCheck({
                industry: 'Grocery Store',
                country: 'Germany',
                businessName: 'Edeka',
                address: 'Baumschulenstraße 31',
                zip: '12437'
            })
        })

        await step('Then search results are displayed correctly', async () => {
            await nearMeCheckScorePage.isAt()
            const score = await nearMeCheckScorePage.getGoogleScore()
            expect(score.maxValue).toBe(100)
            expect(score.actualValue).toBeGreaterThanOrEqual(70)
        })
    })
})