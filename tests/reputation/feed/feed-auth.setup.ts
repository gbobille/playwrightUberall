import { test as setup } from "./feed-base";
import { FeedTestProperties } from "./feed-test-properties";

setup("setup admin session", async ({ page, loginPage }) => {
    await loginPage.loginSkipLandingValidation(FeedTestProperties.adminUsername, FeedTestProperties.crossfeedDefaultPassword)
    await page.context().storageState({ path: ".auth/reputation-admin-session.json" })
})

setup("setup business manager session", async ({ page, loginPage }) => {
    await loginPage.loginSkipLandingValidation(FeedTestProperties.businessUsername, FeedTestProperties.crossfeedDefaultPassword)
    await page.context().storageState({ path: ".auth/reputation-business-session.json" })
})

setup("setup location manager session", async ({ page, loginPage }) => {
    await loginPage.loginSkipLandingValidation(FeedTestProperties.locationUsername, FeedTestProperties.crossfeedDefaultPassword)
    await page.context().storageState({ path: ".auth/reputation-location-session.json" })
})