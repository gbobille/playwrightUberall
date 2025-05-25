import {expect, Locator, Page} from '@playwright/test'
import {text} from "stream/consumers";

export class NearMeCheckPage {
    readonly page: Page
    static readonly url = 'https://static-near-me-check.uberall.com/'

    readonly industry: Locator
    readonly country: Locator
    readonly businessNameInput: Locator
    readonly addressInput: Locator
    readonly zipInput: Locator
    readonly getResultsButton: Locator
    readonly countryOptions: Locator
    readonly nearMeLoadingSlider: Locator
    readonly nearMeCheckDropdownOption: Locator

    constructor(page: Page) {
        this.page = page
        this.industry = page.locator('#manual-form-category-select >> input')
        this.country = page.locator('#manual-form-country-select >> input')
        this.businessNameInput = page.locator('#manual-form-company-name')
        this.addressInput = page.locator('#manual-form-street-and-number')
        this.zipInput = page.locator('#manual-form-zip-code')
        this.getResultsButton = page.locator('button[type="submit"]')
        this.countryOptions = page.locator('div[id^="react-select-3-option"]')
        this.nearMeLoadingSlider = page.locator('div.slick-slider.slider.slick-initialized')
        this.nearMeCheckDropdownOption = page.locator('div:has(> div[id^="react-select-"])')
    }

    async goto() {
        await this.page.goto(NearMeCheckPage.url)
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        return await this.country.isVisible() && await this.getResultsButton.isVisible()
    }

    private async addLocationData(location: LocationNearMeCheck): Promise<void> {
        await this.getResultsButton.scrollIntoViewIfNeeded()
        await this.selectOption(this.industry, location.industry)
        await this.selectOption(this.country, location.country)
        await this.businessNameInput.fill(location.businessName)
        await this.addressInput.fill(location.address)
        await this.zipInput.fill(location.zip)
    }

    private async selectOption(dropdown: Locator, value: string): Promise<void> {
        await dropdown.fill(value)
        await expect(dropdown).toHaveValue(value)
        await this.nearMeCheckDropdownOption.first().waitFor({ state: 'visible', timeout: 10000 })
        await this.nearMeCheckDropdownOption.first().click()
    }

    async performNearMeCheck(location: LocationNearMeCheck): Promise<void> {
        await this.addLocationData(location)
        await this.getResultsButton.click()
        await this.nearMeLoadingSlider.waitFor({ state: 'visible', timeout: 10000 })
    }

    async getListOfAllCountriesInDropDown(): Promise<string[]> {
        await this.country.click()
        await this.nearMeCheckDropdownOption.first().waitFor({ state: 'visible', timeout: 10000 })
        return await this.countryOptions.allInnerTexts()
    }

    async areAllNearMeFieldsPresent(): Promise<boolean> {
        return await this.businessNameInput.isVisible() &&
            await this.addressInput.isVisible() &&
            await this.zipInput.isVisible() &&
            await this.industry.isVisible() &&
            await this.country.isVisible()
    }

    async isNearMeLoadingSliderDisplayed(): Promise<boolean> {
        return await this.nearMeLoadingSlider.isVisible()
    }
}

export interface LocationNearMeCheck {
    industry: string
    country: string
    businessName: string
    address: string
    zip: string
}
