import {Page, Locator} from 'playwright'
import {LocationModel} from "../../../models/listings/locationModel"
import {OpeningHoursModel} from "../../../models/listings/locationOpeningHoursModel"

class FacebookPage {
    static url = 'https://www.facebook.com/'
    page: Page
    emailId: Locator
    declineFacebookCookies: Locator
    discardLoginBanner: Locator
    openingHoursExpander: Locator
    openingHoursPopup: Locator
    passInput: Locator
    loginButton: Locator
    listingsConnectorApproveButton: Locator
    continueAsButton: Locator
    facebookOauthFinishPopup: Locator
    hideSidebarMenu: Locator
    facebookTextElement: Locator

    constructor(page: Page) {

        this.page = page
        this.emailId = page.locator('#email')
        this.passInput = page.locator('#pass')
        this.loginButton = page.locator("//button[@id='loginbutton']").first()
        this.discardLoginBanner = page.locator("//div[@aria-label='Close']")
        this.listingsConnectorApproveButton = page.locator('#submit_approve_access')
        this.declineFacebookCookies = page.locator("//div[@aria-label='Decline optional cookies']").first()
        this.continueAsButton = page.locator("//span[contains(text(), 'Continue as')]").first()
        this.facebookOauthFinishPopup = page.locator("//div[@class='facebook-finish-popup oauth-finish-popup']")
        this.openingHoursExpander = page.locator("//ul//div[@role='button']//i").first()
        this.openingHoursPopup = page.locator("//div[@aria-label='Hours']")
        this.hideSidebarMenu = page.locator("//div[@aria-label='Hide menu']")
        this.facebookTextElement = page.locator("//div[@role='main']//img")
    }

    async goto(url: string) {
        await this.page.goto(url, {waitUntil: 'networkidle'})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        return await this.emailId.isVisible() || await this.declineFacebookCookies.isVisible()
    }

    async facebookLoginUser(user: any, password: any) {
        if (await this.emailId.isVisible()) {
            await this.emailId.fill(user)
            await this.passInput.fill(password)
            await this.loginButton.click()
            await this.page.waitForSelector('#email', {state: 'hidden'})
            await this.hideSidebarMenu.isVisible()
        } else {
            await this.discardLoginBannerClick()
        }
    }

    async declineFacebookCookiesClick() {
        if (await this.declineFacebookCookies.isVisible()) {
            await this.declineFacebookCookies.click()
        }
    }

    async clickHideSidebarMenu() {
        if (await this.hideSidebarMenu.isVisible()) {
            await this.hideSidebarMenu.click()
        }
    }

    async discardLoginBannerClick() {
        if (await this.discardLoginBanner.isVisible()) {
            await this.discardLoginBanner.click()
        }
    }

    async openingHoursExpanderClick() {
        await this.openingHoursExpander.isVisible()
        await this.openingHoursExpander.scrollIntoViewIfNeeded()
        await this.openingHoursExpander.click()
        return this.openingHoursPopup.isVisible()
    }

    /** Extract the opening hours from the Facebook popup */
    async getOpeningHoursMap(): Promise<OpeningHoursModel[]> {
        const maxRetries = 3
        let attempts = 0
        const openingHoursList: OpeningHoursModel[] = []

        while (openingHoursList.length === 0 && attempts < maxRetries) {
            const texts = await this.openingHoursPopup.locator('span').evaluateAll(elements => {
                return elements.map(element => element.textContent).slice(4, -1)
            })

            for (let i = 0; i < texts.length; i += 2) {
                openingHoursList.push(new OpeningHoursModel(texts[i], texts[i + 1])) // Create a new opening hours model
            }

            attempts++
            if (openingHoursList.length === 0) {
                await this.page.waitForTimeout(1000) // Wait for 1 second before retrying
            }
        }

        return openingHoursList
    }

    /** Extract all relevant Facebook elements from the main area on the contact page */

    async getAllFacebookPageLocationElements(): Promise<LocationModel> {

        const facebookTextElements = await this.facebookTextElement.evaluateAll(nodes => {
            return nodes.map(node => {
                const spans = Array.from(node.parentElement?.parentElement?.querySelectorAll('span') || []);
                const texts = Array.from(new Set(spans.map(span => {
                    const text = span.textContent;
                    return text ? text : '';
                }).filter(text => text && text.length > 7).flatMap(text =>
                    text.split(',').map(text => text.trim()))));
                return texts.join(', ')
            })
        })

        const values = {
            locationName: '', // Facebook does not provide a location name
            category: facebookTextElements[2].trim() || '',
            streetAndNumber: facebookTextElements[3].split(',')[0].trim() || '',
            city: facebookTextElements[3].split(',')[1].trim() || '',
            country: facebookTextElements[3].split(',')[2].trim() || '',
            zip: facebookTextElements[3].split(',')[3].trim() || '',
            phone: facebookTextElements[4].trim() || '',
            website: facebookTextElements[6].trim() || ''
        }

        return new LocationModel(
            values.locationName,
            values.category,
            values.streetAndNumber,
            values.city,
            values.country,
            values.zip,
            values.phone,
            values.website
        )
    }
}

export {FacebookPage}
