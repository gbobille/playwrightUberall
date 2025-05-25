import {test} from '../../setup'
import {expect} from "@playwright/test"
import Login from "../../../pages/components/login"
import {User} from "../../testData/staticTestData"
import {WebhooksPage} from "../../../pages/webhooks/webhooksPage";
import WebhooksCall from "../../../api/uberall/platform/webhooksCall";

let login: Login
let webhooksPage: WebhooksPage
let webhooksCall: WebhooksCall

const USER = User.ADMIN_USER

const webhookToCreate: {
    pushUrl: string
    type: string
    status: string
} = {
    pushUrl: "https://weebhook.created.via.the.app.com/de",
    type: "Datapoint check",
    status: "Active"
}

test.beforeEach(async ({page}) => {
    webhooksCall = new WebhooksCall()
    login = new Login(page)
    webhooksPage = new WebhooksPage(page)
    await webhooksCall.deleteAllWebhooksByUrl(webhookToCreate.pushUrl)
})

test.describe("Webhooks: Add a Webhook", {tag: '@Platform'}, () => {
    test(`Check that A Webhook can be created`, async ({step}) => {
        await step(`Given ${USER} Logs in and is on the Webhooks Page`, async () => {
            await login.goto()
            await login.userLogin(USER)
            await webhooksPage.goTo()
        })

        await step(`When ${USER} Adds a new Webhook`, async () => {
            await webhooksPage.clickOnAddWebhookButton()
            await webhooksPage.addWebhookData(webhookToCreate.pushUrl, webhookToCreate.type)
        })

        await step(`Then the Webhook has been created `, async () => {
            await webhooksPage.waitForCreationSuccessToast()
        })

        await step(`And All fields have been saved correctly`, async () => {
            const webhooksElements = await webhooksPage.getAllWebhooks()
            const createdWebhook = webhooksElements.find((hook) => hook.pushUrl === webhookToCreate.pushUrl)!

            expect(createdWebhook.pushUrl).toBe(webhookToCreate.pushUrl)
            expect(createdWebhook.type).toBe(webhookToCreate.type)
            expect(createdWebhook.status).toBe(webhookToCreate.status)
        })
    })
})

test.afterAll(async () => {
    await webhooksCall.deleteAllWebhooksByUrl(webhookToCreate.pushUrl)
})
