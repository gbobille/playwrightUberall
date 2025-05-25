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

const webhookToEdit: {
    pushUrl: string
    type: string
    status: string
} = {
    pushUrl: "https://qa-api.to.be.edited.uberall.com/webhooks",
    type: "Datapoint check",
    status: "Active"
}

const editedWebhook: {
    pushUrl: string
    type: string
    status: string
} = {
    pushUrl: "https://edited.hook.uberall.com/webhooks",
    type: "Business created",
    status: "Active"
}

test.beforeEach(async ({page}) => {
    webhooksCall = new WebhooksCall()
    login = new Login(page)
    webhooksPage = new WebhooksPage(page)
    await webhooksCall.deleteAllWebhooksByUrl(webhookToEdit.pushUrl)
    await webhooksCall.deleteAllWebhooksByUrl(editedWebhook.pushUrl)
    await webhooksCall.ensureWebhook(webhookToEdit.pushUrl)
})

test.describe("Webhooks: Edit a Webhook", {tag: '@Platform'}, () => {
    test(`Check that A Webhook can be edited`, async ({step}) => {
        await step(`Given ${USER} Logs in and is on the Webhooks Page`, async () => {
            await login.goto()
            await login.userLogin(USER)
            await webhooksPage.goTo()
        })

        await step(`When ${USER} Edits a Webhook`, async () => {
            await webhooksPage.isAt()
            const webhooksElements = await webhooksPage.getAllWebhooks()
            await webhooksElements.find((hook) => hook.pushUrl === webhookToEdit.pushUrl)?.editButton?.first()?.click()
            await webhooksPage.addWebhookData(editedWebhook.pushUrl, editedWebhook.type)

        })

        await step(`Then the Webhook has been edited `, async () => {
            await webhooksPage.waitForEditionSuccessToast()
        })

        await step(`And The Webhook is not found in the Table`, async () => {
            const webhooksElementsNew = await webhooksPage.getAllWebhooks()
            const webhookExists = webhooksElementsNew.some((hook) => hook.pushUrl === editedWebhook.pushUrl)
            expect(webhookExists).toBe(true)

        })
    })
})

test.afterAll(async () => {
    await webhooksCall.deleteAllWebhooksByUrl(webhookToEdit.pushUrl)
    await webhooksCall.deleteAllWebhooksByUrl(editedWebhook.pushUrl)
})
