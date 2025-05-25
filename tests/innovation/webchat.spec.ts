import { test, expect } from '@playwright/test';
import { testConfig } from '../../testconfig.config';
import Webchatsite from '../../pages/innovation/webchatsite';
import Utils from "../../utils/utils";

test.describe('Webchat widget ', async () => {

    test(`Widget chatbot @conversation`, async ({ page }) => {
        const webchatsite = new Webchatsite(page)
        //Proceeed to website
        await test.step(`Given user navigates to webchat`, async () => {
            await page.goto(`https://storefinder-showcase.sandbox.uberall.com/marco_test/index.html#!/`, { waitUntil: 'networkidle' })
        })

        //Fillout Website Widget
        await test.step("fill out website widget", async () => {
            await webchatsite.messageButtonClick()
            await webchatsite.enterReplyClick()
            await webchatsite.typeValue()
            await page.waitForTimeout(2000)
            await webchatsite.clickEnter()
            await page.waitForLoadState('domcontentloaded')
            await webchatsite.enterReplyClick()
            await webchatsite.typeAddress()
            await webchatsite.clickEnter()
            await webchatsite.addressButtonClick()
            await webchatsite.enterReplyClick()
            await webchatsite.typeMenu();
            await page.locator('webchat-widget svg').nth(1).click();
            await webchatsite.menuCardVisible()
            await webchatsite.messageButtonClick()
        })
    });

    test(`Live Agent Availability Message before selecting the location @conversation`, async ({ page }) => {
        const webchatsite = new Webchatsite(page)
        //Proceeed to website
        await test.step(`Given user navigates to webchat`, async () => {
            await page.goto(`https://uberall.store/victoria_test#!`, { waitUntil: 'networkidle' })
        })

        //Fillout Website Widget
        await test.step("fill out website widget", async () => {
            await webchatsite.messageButtonClick()
            await webchatsite.enterReplyClick()
            await webchatsite.typeValue()
            await page.waitForTimeout(2000)
            await webchatsite.clickEnter()
            await page.waitForTimeout(2000)
            await webchatsite.languageButtonClick()
            await webchatsite.enterReplyClick()
            await webchatsite.typeLiveAgent()
            await page.locator('webchat-widget svg').nth(1).click()
            await webchatsite.liveAgentTextClick()
            await webchatsite.liveAgentTextButtonVisible()
            await webchatsite.visitOurWebsiteButtonVisible()
            await webchatsite.messageButtonClick()
            await webchatsite.messageButtonClick()
            await webchatsite.liveAgentTextButtonVisible()
            await webchatsite.visitOurWebsiteButtonVisible()
        })
    });

    test('Custom Intent German @conversation', async ({ page }) => {
        const webchatsite = new Webchatsite(page)
        //Proceeed to website
        await test.step(`Given user navigates to webchat`, async () => {
            await page.goto(`https://uberall.store/victoria_test#!`, { waitUntil: 'networkidle' })
        })

        //Fillout Website Widget
        await test.step("fill out website widget", async () => {
            await webchatsite.messageButtonClick()
            await webchatsite.enterReplyClick()
            await webchatsite.typeGermanCustomIntentQuestion()
            await webchatsite.clickEnter()
            await page.waitForTimeout(2000)
            await webchatsite.verifyingGermanCustomIntentReply()
            await webchatsite.typeGermanCustomIntentQuestionSecond()
            await webchatsite.clickEnter()
            await page.waitForTimeout(2000)
            await webchatsite.verifyingGermanCustomIntentSecondReply()
        })
    });

    test('Custom Intent English @conversation', async ({ page }) => {
        const webchatsite = new Webchatsite(page)
        //Proceeed to website
        await test.step(`Given user navigates to webchat`, async () => {
            await page.goto(`https://uberall.store/victoria_test#!`, { waitUntil: 'networkidle' })
        })

        //Fillout Website Widget
        await test.step("fill out website widget", async () => {
            await webchatsite.messageButtonClick()
            await webchatsite.enterReplyClick()
            await webchatsite.typeEnglishCustomIntentQuestion()
            await webchatsite.clickEnter()
            await page.waitForTimeout(3000)
            await webchatsite.verifyingEnglishCustomIntentReply()
            await webchatsite.typeEnglishCustomIntentSecondQuestion()
            await webchatsite.clickEnter()
            await page.waitForTimeout(3000)
            await webchatsite.verifyingEnglishCustomIntentSecondReply()
        })
    });

    test('Send Contact form widget @conversation', async ({ page }) => {
        const webchatsite = new Webchatsite(page)
        //Proceeed to website
        await test.step(`Given user navigates to webchat`, async () => {
            await page.goto(`https://uberall.store/victoria_contact_form#!`, { waitUntil: 'networkidle' })
        })

        //Fillout Contact Form Widget
        await test.step("fill out website widget", async () => {
            await webchatsite.messageButtonClick()
            await webchatsite.clickName()
            await webchatsite.typeName()
            await webchatsite.clickPhoneNumber()
            await webchatsite.typePhoneNumber()
            await webchatsite.clickPhoneEmail()
            await webchatsite.typePhoneEmail()
            await page.locator('.css-ackcql').click()
            await webchatsite.chooseAddress()
            await webchatsite.chooseMessage()
            await webchatsite.typeMessage()
            await webchatsite.selectCustomFiled()
            await webchatsite.typeCustomFiled()
            await webchatsite.clickAgreeCheckBox()
            await webchatsite.verifyContactFormName()
            await webchatsite.clickSendButton()
            await webchatsite.verifyConformationText()
            await webchatsite.clickCloseContactForm()
            await webchatsite.clickContactUs()
            await webchatsite.verifyContactFormName()
        })
    });

    test('Contact Form verifying mandatory fields @conversation', async ({ page }) => {
        const webchatsite = new Webchatsite(page)
        //Proceeed to website
        await test.step(`Given user navigates to webchat`, async () => {
            await page.goto(`https://uberall.store/victoria_contact_form#!`, { waitUntil: 'networkidle' })
        })

        //Fillout Contact Form Widget
        await test.step("verify error messages", async () => {
            await webchatsite.messageButtonClick()
            await webchatsite.clickSendButton()
            await page.locator('div:nth-child(2) > .css-uxmil7 > div:nth-child(3) > .css-1pitxia').isVisible()
            await page.locator('.css-1pitxia').first().click();
            await page.locator('div:nth-child(3) > .css-uxmil7 > div:nth-child(3) > .css-1pitxia').isVisible()
            await page.locator('div:nth-child(4) > .css-uxmil7 > div:nth-child(3) > .css-1pitxia').isVisible()
            await page.locator('div:nth-child(5) > .css-uxmil7 > div:nth-child(3) > .css-1pitxia').isVisible()
            await webchatsite.messageButtonClick()
        })
    })

})
