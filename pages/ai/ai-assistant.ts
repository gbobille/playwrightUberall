import { expect, Locator, Page } from "@playwright/test"

export default class AiAssistantPage {
    page: Page;
    aiAssistantPanel: Locator;
    aiAssistantButton: Locator;
    aiPanelBody: Locator;
    aiPanelInputChat: Locator;
    aiPanelExpandButton: Locator;
    aiPanelCloseButton: Locator;
    aiPanelMenuButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.aiAssistantPanel = page.locator('div.ai-assistant-panel.ai-assistant-panel-open');
        this.aiAssistantButton = page.locator('button.zenit', {hasText : 'AI'})
        this.aiPanelBody = page.locator('div.ai-assistant-panel-body-container');
        this.aiPanelInputChat = page.locator('#input-chat');
        this.aiPanelExpandButton = page.locator('[data-testid="ai-assistant-panel-expand-button"]');
        this.aiPanelCloseButton = page.locator('[data-testid="ai-assistant-panel-close-button"]');
        this.aiPanelMenuButton = page.locator('[data-testid="ai-assistant-panel-menu-button"]');
    }

    async clickOnAiAssistant(){
        await this.aiAssistantButton.click();
    }

    async sendQuery(query: string){
        await this.aiPanelInputChat.fill(query)
        await this.page.keyboard.press('Enter');
    }

}