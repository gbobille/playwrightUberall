import {Locator, Page} from 'playwright'
import {LocationModel} from "../../../models/listings/locationModel"
import {OpeningHoursModel} from "../../../models/listings/locationOpeningHoursModel"

class AppleMapsPage {
    page: Page
    appleMapsHeaderTitle: Locator
    mapsUrl: Locator
    locationWebsite: Locator
    locationPhone: Locator
    openingHoursExpander: Locator
    openingHoursPopup: Locator
    openingHoursDay: Locator
    openingHoursTime: Locator
    appleMapsAddress: Locator

    constructor(page: Page) {
        this.page = page
        this.appleMapsHeaderTitle = page.locator("//h1[@class='sc-header-title']")
        this.locationWebsite = page.locator('section[class="sc-platter-cell"] a').first()
        this.locationPhone = page.locator('div[class="sc-symbol phone-fill"]').locator('..').locator('..')
        this.mapsUrl = page.locator('div[class="mw-maps-app-link"] a')
        this.openingHoursExpander = page.locator("//button[@class='mw-toggle']")
        this.openingHoursPopup = page.locator("//div[@class='mw-unfolded-content']")
        this.openingHoursDay = page.locator("//div[@class='sc-day-range sc-hours-day']")
        this.openingHoursTime = page.locator("//div[@class='sc-hours-range']")
        this.appleMapsAddress = page.locator("div[class='sc-platter-cell-content with-sc-icon'] div")
    }

    async goto(url: string) {
        await this.page.goto(url, {waitUntil: 'networkidle'})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        return await this.appleMapsHeaderTitle.isVisible()
    }

    async openingHoursExpanderClick() {
        await this.openingHoursExpander.isVisible()
        await this.openingHoursExpander.scrollIntoViewIfNeeded()
        await this.openingHoursExpander.click()
        return this.openingHoursPopup.first().isVisible()
    }

    async getOpeningHoursMap(): Promise<OpeningHoursModel[]> {
        const openingHoursList: OpeningHoursModel[] = []
        const maxRetries = 3
        let attempts = 0

        while (openingHoursList.length === 0 && attempts < maxRetries) {
            const days = await this.openingHoursDay.evaluateAll(elements => elements.map(element => element.textContent?.trim() || ''))
            const hours = await this.openingHoursTime.evaluateAll(elements => elements.map(element => element.textContent?.trim() || ''))

            const lastThreeDays = days.slice(-3)
            const lastThreeHours = hours.slice(-3)

            for (let i = 0; i < lastThreeDays.length; i++) {
                openingHoursList.push(new OpeningHoursModel(lastThreeDays[i], lastThreeHours[i]))
            }

            attempts++
            if (openingHoursList.length === 0) {
                await this.page.waitForTimeout(1000) // Wait for 1 second before retrying
            }
        }
        return openingHoursList
    }

    async getAllApplePageLocationElements(): Promise<LocationModel> {
        const phoneHref = await this.locationPhone.getAttribute('href');

        const values = {
            locationName: (await this.appleMapsHeaderTitle.textContent()) || '',
            category: '', // Apple Maps does not provide a category
            streetAndNumber: (await this.appleMapsAddress.nth(0).textContent())?.trim() || '',
            city: (await this.appleMapsAddress.nth(2).textContent())?.split(' ')[1].trim() || '',
            country: (await this.appleMapsAddress.nth(3).textContent())?.trim() || '',
            zip: (await this.appleMapsAddress.nth(2).textContent())?.split(' ')[0].trim() || '',
            phone: phoneHref ? phoneHref.split(':')[1] : '',
            website: (await this.locationWebsite.getAttribute('href')) || ''
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

export {AppleMapsPage}
