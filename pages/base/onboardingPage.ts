import { Page, Locator } from 'playwright'
import BasicData from "../datamanagement/singleLocationProfile/basicDataPage"
import Login from "../components/login"

export default class LocationOnboardingPage {
    static url = `/onboarding`
    readonly page: Page
    private login: Login
    locationOnboardingHeader: Locator
    locationOnboardingStepBtn: Locator
    locationOnboardingStepTwoBtn: Locator
    finishOnboardingBtn: Locator
    onboardingSubmitModal: Locator
    onboardingSkipLink: Locator
    syncNotPossibleCancelBtn: Locator
    googleListingConnectButton: Locator
    onboardingShortDescription: Locator
    basicData: BasicData

    constructor(page: Page) {
        this.page = page;
        this.login = new Login(page)
        this.locationOnboardingHeader = page.locator('//div[@class="onboarding-page-header-inner"]')
        this.locationOnboardingStepBtn = page.locator("//a[@class='btn btn-backend-default onboarding-step-button']")
        this.locationOnboardingStepTwoBtn = page.locator("//div[@class='onboarding-step-button-wrapper']/a")
        this.finishOnboardingBtn = page.locator("//div[@class= 'onboarding-success-box']//button[contains(@class, 'btn-backend-default')]")
        this.onboardingSubmitModal = page.locator("//div[@class= 'onboarding-skip-modal-inner']")
        this.onboardingSkipLink = page.locator("//button[contains(@class, 'onboarding-skip-link')]")
        this.syncNotPossibleCancelBtn = page.locator("//div[contains(@class, 'sync-not-available')]//a[@class= 'cancel-link']")
        this.googleListingConnectButton = page.locator("//a[@class= 'btn btn-backend-default listing-connect-button']")
        this.onboardingShortDescription = page.locator("//textarea[@id= 'descriptionShort']").first()
        this.basicData = new BasicData(page) // Initialize BasicData instance
    }

    async isAt(): Promise<boolean> {
        await this.page.waitForLoadState('domcontentloaded')
        await this.locationOnboardingHeader.waitFor({ state: 'visible', timeout: 20000 })
        return await this.locationOnboardingHeader.isVisible()
    }

    async submitOnboardingPage(): Promise<void> {
        await this.locationOnboardingStepBtn.waitFor({ state: 'visible', timeout: 20000 })
        await this.locationOnboardingStepBtn.click()
        await this.onboardingShortDescription.waitFor({ state: 'visible', timeout: 20000 })
        await this.locationOnboardingStepTwoBtn.waitFor({ state: 'visible', timeout: 20000 })
        await this.locationOnboardingStepTwoBtn.click()
        await this.onboardingSkipLink.click()
        await this.onboardingSubmitModal.waitFor({ state: 'hidden', timeout: 20000 })

        if (await this.googleListingConnectButton.isVisible()) {
            try {
                await this.onboardingSkipLink.click()
            } catch (error) {
                console.log('Error: ', error)
                await this.finishOnboardingBtn.click()
            }
            if (await this.finishOnboardingBtn.isVisible()) {
                await this.finishOnboardingBtn.click()
            }
            if (await this.syncNotPossibleCancelBtn.isVisible()) {
                await this.syncNotPossibleCancelBtn.click()
            }
        } else if (await this.finishOnboardingBtn.isVisible()) {
            await this.finishOnboardingBtn.click()
        }
        await this.login.confirmLandingPage()
    }
}

export { LocationOnboardingPage }