import { test, expect } from '@playwright/test';
import Login from '../../../pages/components/login';
import HomePage from '../../../pages/innovation/homepage/homepage';
import AiAssistantPage from '../../../pages/ai/ai-assistant';

test.describe('Login and AI Assistant Interaction', () => {
    test('should respond to simple query', async ({ page }) => {
        const homepage = new HomePage(page)
        const aiPanel = new AiAssistantPage(page)

        await test.step("Given user login to Uberall and clicked on AI button", async () => {
            await page.goto(`${process.env.BASE_URL}`)
            const login = new Login(page)
            await login.goto()
            await login.userLogin(process.env.AI_DEV_A_USER, process.env.AI_DEV_A_PASSWORD)
            await aiPanel.clickOnAiAssistant();
        })

        await test.step("Then AI Assistant panel loads", async () => {
            await expect(aiPanel.aiPanelBody).toContainText('How can I help you today?');
        })

        await test.step("Given user login to Uberall and clicked on AI button", async () => {
            await aiPanel.sendQuery('Hello');
        })

        await test.step("Then AI Assistant should respond", async () => {
            await page.waitForLoadState();
            await expect(aiPanel.aiPanelBody).toContainText("Hello!");
        })
    })
})