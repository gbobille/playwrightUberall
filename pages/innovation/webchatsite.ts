import { expect, Locator, Page } from "@playwright/test";

export default class Webchatsite {

    messageButton: Locator
    addressButton: Locator
    enterReply: Locator
    menuCard: Locator
    languageButton: Locator
    liveAgentText: Locator
    liveAgentButton: Locator
    visitOurWebsiteButton: Locator
    enterValue: Locator
    enter: Locator
    customIntentReplyGerman: Locator
    customIntetsReplyGermanSecond: Locator
    customIntentReplyEnglish: Locator
    customIntentReplyEnglishSecond: Locator
    contactFormFieldName: Locator
    contactFormFieldPhoneNumber: Locator
    contactFormFieldEmail: Locator
    contactFormAddress: Locator
    selectMessage: Locator
    customField: Locator
    agreeCheckBox: Locator
    contactFormName: Locator
    sendButton: Locator
    conformationText: Locator
    closeContactForm: Locator
    contactUsButton: Locator


    constructor(public page: Page) {
        this.messageButton = page.getByRole('button', { name: 'Messages Button' })
        this.addressButton = page.getByRole('button', { name: 'Rüdigerstraße 56, Berlin' })
        this.enterReply = page.getByPlaceholder('Write here your reply')
        this.menuCard = page.getByRole('button', { name: 'Beef Burger' })
        this.languageButton = page.getByRole('button', { name: 'English' })
        this.liveAgentText = page.getByText('Live Agent Is Not Available')
        this.liveAgentButton = page.getByRole('button', { name: 'Call us' })
        this.visitOurWebsiteButton = page.getByRole('button', { name: 'Visit our website' })
        this.enter = page.getByPlaceholder('Write here your reply')
        this.customIntentReplyGerman = page.getByText('Joe Biden ist ein Präsident der Marke Victoria')
        this.customIntetsReplyGermanSecond = page.getByText('Wir reinigen es jeden Tag')
        this.customIntentReplyEnglish = page.getByText('Joe Biden is a president Victorias brand')
        this.customIntentReplyEnglishSecond = page.getByText('we clean it every day')
        this.contactFormFieldName = page.getByLabel('Name')
        this.contactFormFieldPhoneNumber = page.getByLabel('Phone number')
        this.contactFormFieldEmail = page.getByLabel('Email')
        this.contactFormAddress = page.getByTestId('4318307').getByText('Martin Avenue, 1102, Round Rock, 78681')
        this.selectMessage = page.getByLabel('Message', { exact: true })
        this.customField = page.getByLabel('Custom Field')
        this.agreeCheckBox = page.getByText('are you agree')
        this.contactFormName = page.getByText('Welcome')
        this.sendButton = page.getByRole('button', { name: 'Send' })
        this.conformationText = page.getByText('See you')
        this.closeContactForm = page.getByRole('button', { name: 'Close' })
        this.contactUsButton = page.locator('webchat-widget').getByText('Contact us')

    }

    async messageButtonClick() {
        await this.messageButton.click({ timeout: 50000 })
    }

    async addressButtonClick() {
        await this.addressButton.click({ timeout: 50000 })
    }

    async enterReplyClick() {
        await this.enterReply.click({ timeout: 50000 })
    }

    async menuCardVisible() {
        await this.menuCard.isVisible
    }

    async languageButtonClick() {
        await this.languageButton.click({ timeout: 50000 })
    }

    async liveAgentTextClick() {
        await this.liveAgentText.click({ timeout: 50000 })
    }

    async liveAgentTextButtonVisible() {
        await this.liveAgentButton.isVisible()
    }

    async visitOurWebsiteButtonVisible() {
        await this.visitOurWebsiteButton.isVisible()
    }

    async typeValue() {
        await this.enter.fill('Hello')
    }

    async clickEnter() {
        await this.enter.press('Enter')
    }

    async typeMenu() {
        await this.enter.fill('Menu')
    }

    async typeAddress() {
        await this.enter.fill('address')
    }


    async typeLiveAgent() {
        await this.enter.fill('Can I talk to Live Agent?')
    }


    async typeGermanCustomIntentQuestion() {
        await this.enter.fill('Wer ist der Präsident der Vereinigten Staaten?')
    }

    async verifyingGermanCustomIntentReply() {
        await this.customIntentReplyGerman.isVisible()
    }

    async typeGermanCustomIntentQuestionSecond() {
        await this.enter.fill('Wie oft putzen Sie das Restaurant?')
    }

    async verifyingGermanCustomIntentSecondReply() {
        await this.customIntetsReplyGermanSecond.isVisible()
    }

    async typeEnglishCustomIntentQuestion() {
        await this.enter.fill('who is the president of the United States?')
    }

    async verifyingEnglishCustomIntentReply() {
        await this.customIntentReplyEnglish.isVisible()
    }

    async typeEnglishCustomIntentSecondQuestion() {
        await this.enter.fill('how often do you clean the restaurant?')
    }

    async verifyingEnglishCustomIntentSecondReply() {
        await this.customIntentReplyEnglishSecond.isVisible()
    }

    async typeName() {
        await this.contactFormFieldName.fill('Victoria M')
    }

    async clickName() {
        await this.contactFormFieldName.click()
    }

    async clickPhoneNumber() {
        await this.contactFormFieldPhoneNumber.click()
    }

    async typePhoneNumber() {
        await this.contactFormFieldPhoneNumber.fill('3453453456')
    }

    async clickPhoneEmail() {
        await this.contactFormFieldEmail.click()
    }

    async typePhoneEmail() {
        await this.contactFormFieldEmail.fill('vm@gmail.com')
    }

    async chooseAddress() {
        await this.contactFormAddress.click()
    }

    async chooseMessage() {
        await this.selectMessage.click()
    }

    async typeMessage() {
        await this.selectMessage.fill('Message')
    }

    async selectCustomFiled() {
        await this.customField.click()
    }


    async typeCustomFiled() {
        await this.customField.fill('custom Field')
    }


    async clickAgreeCheckBox() {
        await this.agreeCheckBox.click()
    }

    async verifyContactFormName() {
        await this.contactFormName.isDisabled
    }


    async clickSendButton() {
        await this.sendButton.click()
    }



    async verifyConformationText() {
        await this.conformationText.isDisabled
    }


    async clickCloseContactForm() {
        await this.closeContactForm.click()
    }


    async clickContactUs() {
        await this.contactUsButton.click()
    }

}
