import {test} from '@playwright/test'

/** Adds console.log to step */
export async function logStep(stepName: string, stepFunction: () => Promise<void>) {
    console.log(`Step: ${stepName}`)
    await test.step(stepName, stepFunction)
}