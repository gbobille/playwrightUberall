import {Locator, Page} from 'playwright'
import {LocationModel} from "../../../models/listings/locationModel"
import {OpeningHoursModel} from "../../../models/listings/locationOpeningHoursModel"

class BingMapsPage {
    page: Page
    rejectBingCookies: Locator
    bingSubModule: Locator
    openingHoursExpander: Locator
    openingHoursPopup: Locator

    constructor(page: Page) {
        this.page = page
        this.rejectBingCookies = page.locator("//button[@id= 'bnp_btn_reject']")
        this.bingSubModule = page.locator("//div[@class='b_subModule']")
        this.openingHoursExpander = page.locator("//span[@class='opHr_Exp']")
        this.openingHoursPopup = page.locator("//span[@class='opHours']")
    }

    async goto(url: string) {
        await this.page.goto(url, {waitUntil: 'networkidle'})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        return await this.rejectBingCookies.isVisible() || this.bingSubModule.first().isVisible()
    }

    async rejectBingCookiesClick() {
        if (await this.rejectBingCookies.isVisible()) {
            await this.rejectBingCookies.scrollIntoViewIfNeeded()
            await this.rejectBingCookies.click()
        }
    }

    async openingHoursExpanderClick() {
        await this.openingHoursExpander.isVisible()
        await this.openingHoursExpander.scrollIntoViewIfNeeded()
        await this.openingHoursExpander.click()
        return this.openingHoursPopup.isVisible()
    }

    async getOpeningHoursMap(): Promise<OpeningHoursModel[]> {
        const openingHoursList: OpeningHoursModel[] = []
        const maxRetries = 3
        let attempts = 0

        while (openingHoursList.length === 0 && attempts < maxRetries) {
            const texts = await this.openingHoursPopup.locator('td').evaluateAll(elements => {
                return elements.map(element => element.textContent)
            })

            for (let i = 0; i < texts.length; i += 2) {
                openingHoursList.push(new OpeningHoursModel(texts[i], texts[i + 1])); // Create a new opening hours model
            }

            attempts++
            if (openingHoursList.length === 0) {
                await this.page.waitForTimeout(1000) // Wait for 1 second before retrying
            }
        }
        return openingHoursList
    }

    async getAllBingPageLocationElements(): Promise<LocationModel> {
        const bingLocationName = await this.page.locator('h2[class="nameContainer"]').textContent() || ''
        const locationAddress = await this.page.locator('svg[id="saplacesvg"]').evaluate(node => node.parentElement?.querySelector('div')?.textContent) || ''
        const locationPhone = await this.page.locator('svg[id="sacallsvg"] ').evaluate(node => node.parentElement?.querySelector('a')?.textContent) || ''
        const locationWebsite = await this.page.locator('a[viewname="InstLink"][role="link"]').first().getAttribute('href') || ''
        const country = await this.page.locator('div[id="mapContainer"]').getAttribute('aria-label') || ''

        const values = {
            locationName: bingLocationName.split('✕')[0],
            category: '', // Bing does not provide a category
            streetAndNumber: locationAddress.split('·')[0].trim() || '',
            city: locationAddress.split('·')[1].split(' ')[2] || '',
            country: country.split(',')[2].trim() || '',
            zip: locationAddress.split('·')[1].split(' ')[1] || '',
            phone: locationPhone || '',
            website: decodeURIComponent(locationWebsite.match(/url=([^&]+)/)?.[1] || locationWebsite)
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

export {BingMapsPage}
