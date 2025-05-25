import {Locator, Page} from 'playwright'
import {LocationModel} from "../../../models/listings/locationModel"
import {OpeningHoursModel} from "../../../models/listings/locationOpeningHoursModel"

class GoogleMapsPage {
    page: Page
    acceptGoogleCookies: Locator
    discardLoginBanner: Locator
    openingHoursExpander: Locator
    openingHoursPopup: Locator

    constructor(page: Page) {
        this.page = page
        this.acceptGoogleCookies = page.locator("//a[contains(@href, 'policies.google.com')]").locator('..').locator('..').locator('button').nth(-2);
        this.discardLoginBanner = page.locator("//div[@aria-label='Close']")
        this.openingHoursExpander = page.locator("//div[@data-attrid='kc:/location/location:hours']").first()
        this.openingHoursPopup = page.locator("//div[@aria-label='Hours']")
    }

    async goto(url: string) {
        await this.page.goto(url, {waitUntil: 'networkidle'})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        return await this.acceptGoogleCookies.isVisible() || this.openingHoursExpander.isVisible()
    }

    async acceptGoogleCookiesClick() {
        if (await this.acceptGoogleCookies.isVisible()) {
            await this.acceptGoogleCookies.scrollIntoViewIfNeeded()
            await this.acceptGoogleCookies.click()
        }
    }

    async openingHoursExpanderClick() {
        try {
            await this.openingHoursExpander.scrollIntoViewIfNeeded()
            await this.openingHoursExpander.click()
            await this.openingHoursExpander.isVisible()
            return this.openingHoursPopup.isVisible()
        }
        catch (error) {
            console.log('Opening Did not Open Properly')
        }
    }

    async getOpeningHoursMap(): Promise<OpeningHoursModel[]> {
        const openingHoursList: OpeningHoursModel[] = [];
        const maxRetries = 3
        let attempts = 0

        while (openingHoursList.length === 0 && attempts < maxRetries) {
            const texts = await this.openingHoursExpander.locator('td').evaluateAll(elements => {
                return elements.map(element => element.textContent)
            });

            for (let i = 0; i < texts.length; i += 2) {
                openingHoursList.push(new OpeningHoursModel(texts[i], texts[i + 1])) // Create a new opening hours model
            }

            attempts++;
            if (openingHoursList.length === 0) {
                await this.page.waitForTimeout(1000) // Wait for 1 second before retrying
            }
        }

        return openingHoursList
    }

    async getAllGooglePageLocationElements(): Promise<LocationModel> {
        await this.page.waitForSelector('div[data-attrid*="kc:/location/location:address"] a span', { state: 'visible' })

        const locationAddress = await this.page.locator('div[data-attrid*="kc:/location/location:address"] a  span').textContent() || ''
        const locationCategory = await this.page.locator('div[data-attrid*="kc:/local:one line summary"] span').textContent() || ''
        const locationWebsite = await this.page.locator('div[data-attrid*="kc:/local:appointment"] a').first().getAttribute('href') || ''

        const values = {
            locationName: '',
            category: locationCategory.split(' ').slice(0, -2).join(' '),
            streetAndNumber: locationAddress.split(',')[0],
            city: locationAddress.split(',')[1].split(' ')[2],
            country: '',
            zip: locationAddress.split(',')[1].split(' ')[1],
            phone: '',
            website: locationWebsite
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

export {GoogleMapsPage}
