import { test } from '../../setup'
import { expect } from '@playwright/test'
import NearMeCheckCall from '../../../api/uberall/platform/nearMeCheckCall'
import {APIResponse} from "playwright";

test.describe('Near Me Check API Tests', { tag: '@nearMeCheck' }, () => {
    test('Near Me Check via API for an existing Location', async ({ step }) => {
        const nearMeCheckCall = new NearMeCheckCall()
        let response: APIResponse

        await step('When performing a Near Me Check via the API', async () => {
            response = await nearMeCheckCall.performNearMeCheck()
        })

        await step('Then The Response is 200', async () => {
            expect(response.status()).toBe(200)
        })
    })
})