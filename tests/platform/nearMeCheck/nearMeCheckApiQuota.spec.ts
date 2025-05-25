import {test} from '../../setup'
import {expect} from '@playwright/test'
import NearMeCheckCall from '../../../api/uberall/platform/nearMeCheckCall'
import {APIResponse} from "playwright";

test.describe('Near Me Check API Quota Tests', {tag: '@nearMeCheck'}, () => {
    test('Near Me Check via API for an existing Location', async ({step}) => {
        const nearMeCheckCall = new NearMeCheckCall()
        let responses: PromiseSettledResult<APIResponse>[]

        await step('When performing a Near Me Check via the API nth times', async () => {
            const promises = Array.from({length: 3}, () => nearMeCheckCall.performNearMeCheck())
            responses = await Promise.allSettled(promises)
        })

        await step('Then The Response is 200 for some and at least one throws a 429', async () => {
            const statuses = responses.map((result, index) => {
                if (result.status === 'fulfilled') {
                    const status = result.value.status()
                    const statusText = result.value.statusText()
                    return { status, statusText }
                } else {
                    console.error(`Response ${index + 1} failed:`, result.reason)
                    return null
                }
            }).filter(response => response !== null) as { status: number, statusText: string }[]

            statuses.forEach(({ status, statusText }) => {
                console.log(`Asserting - Status: ${status}, StatusText: ${statusText}`)
                expect([200, 429]).toContain(status)
            })

            const has429 = statuses.some(({ status }) => status === 429)
            expect(has429).toBe(true)
        })
    })
})