import BaseCall, { Endpoint } from "../baseCall"
import Data from "../data";

interface WebhookResponse {
    response: Array<{
        id: number;
        [key: string]: unknown; // Add other properties if needed
    }>;
}

export class WebhooksCall extends BaseCall {

    async ensureWebhook(pushUrl?: string): Promise<number | Map<string, unknown>> {
        const webhook = new Data().newWebhook();
        webhook.pushUrl = pushUrl || webhook.pushUrl
        return await this.createWebhook(webhook);
    }

    private async createWebhook(webhook: Record<string, unknown>): Promise<number | Map<string, unknown>> {
        const json = JSON.stringify(webhook);
        return await this.createModel(
            json,
            Endpoint.WEBHOOKS,
            `A Webhook with ${webhook.name} has been created`
        );
    }

    async deleteAllWebhooksByUrl(pushUrl: string): Promise<void> {
        const webhooksIds = await WebhooksCall.getWebhooksIds(pushUrl, this.privateKey)
        if (Array.isArray(webhooksIds)) {
            for (const webhookId of webhooksIds) {
                await this.deleteModel(webhookId, Endpoint.WEBHOOKS)
            }
        }
    }

    static async getWebhooksIds(pushUrl: string, privateKey: string): Promise<number[]> {
        const queryParameters = new Map<string, unknown>([
            ['pushUrl', pushUrl]
        ])
        const endpoint = Endpoint.WEBHOOKS;
        const response = await new BaseCall().getModel(queryParameters, endpoint, privateKey, ``, true) as unknown as WebhookResponse

        //Filter webhooks by the specific pushUrl
        return response.response
            .filter((webhook) => (webhook as unknown as { pushUrl: string }).pushUrl === pushUrl)
            .map((webhook) => webhook.id)
    }
}

export default WebhooksCall