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

const webhookToDelete: {
    pushUrl: string
    type: string
    status: string
} = {
    pushUrl: "https://qa-api.to.be.deleted.uberall.com/webhooks",
    type: "Datapoint check",
    status: "Active"
}

test.beforeEach(async ({page}) => {
    webhooksCall = new WebhooksCall()
    await webhooksCall.deleteAllWebhooksByUrl(webhookToDelete.pushUrl)
    login = new Login(page)
    webhooksPage = new WebhooksPage(page)
    await webhooksCall.ensureWebhook(webhookToDelete.pushUrl)
})

test.describe("Webhooks: Delete a Webhook", {tag: '@Platform'}, () => {
    test(`Check that A Webhook can be deleted`, async ({step}) => {
        await step(`Given ${USER} Logs in and is on the Webhooks Page`, async () => {
            await login.goto()
            await login.userLogin(USER)
            await webhooksPage.goTo()
        })

        await step(`When ${USER} Deletes a Webhook`, async () => {
            await webhooksPage.isAt()
            const webhooksElements = await webhooksPage.getAllWebhooks()
            await webhooksElements.find((hook) => hook.pushUrl === webhookToDelete.pushUrl)?.deleteButton?.first()?.click()
            await webhooksPage.clickOnDeleteConfirmation()
        })

        await step(`Then the Webhook has been deleted `, async () => {
            await webhooksPage.waitForDeletionSuccessToast()
        })

        await step(`And The Webhook is not found in the Table`, async () => {
            const webhooksElementsNew = await webhooksPage.getAllWebhooks()
            const webhookExists = webhooksElementsNew.some((hook) => hook.pushUrl === webhookToDelete.pushUrl)
            expect(webhookExists).toBe(false)

        })
    })
})

test.afterAll(async () => {
    await webhooksCall.deleteAllWebhooksByUrl(webhookToDelete.pushUrl)
})
