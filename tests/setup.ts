// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { test as base } from '@playwright/test';

const test = base.extend<object, { step: (name: string, body: () => Promise<void>) => Promise<void> }>({
    step: async ({}, use) => {
        const logStep = async (name: string, body: () => Promise<void>) => {
            console.log(`STEP: ${name}`); //  log the step name
            await base.step(name, body); // log the original step
        };
        await use(logStep);
    },
});

export { test };