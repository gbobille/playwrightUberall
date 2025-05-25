import { Locator, Page, expect } from "@playwright/test";

export default class RichData {
    lodgingFields: Locator
    availableAmenities: Locator
    servicesBox: Locator
    freeFormService: Locator
    readonly servicesList : (serviceName: string) => Locator
    readonly serviceSelected : (serviceName: string) => Locator
    readonly amenity : (amenity : string) => Locator
    readonly transactionLink : (linkType: string) => Locator
    selectLanguage: Locator
    selectDanish: Locator

    constructor(private page: Page) {
        this.lodgingFields = page.locator('#lodgingFields > .css-qv0q60-control > .css-1ri0iw2 > .css-ackcql')
        this.amenity = (gameRoom : string) => page.getByTestId(`activities>>>gameRoom`).getByText(`${gameRoom}`)
        this.availableAmenities = page.getByText('Activities > Game Room')
        this.transactionLink = (linkType: string) => page.locator(`[data-testid="${linkType}.input.0"]`)
        this.servicesBox = page.locator('div[data-testid="ZNT-dropdown_select-wrapper"]').last()
        this.freeFormService = page.locator('.location-form-section .location-form-section-inner input[role="combobox"]').last()
        this.servicesList = (serviceName: string) => page.getByTestId(`${serviceName}`)
        this.serviceSelected = (serviceName: string) => page.getByText(`${serviceName}`)
        this.selectLanguage = page.getByPlaceholder('Languages')
        this.selectDanish = page.getByLabel('Danish')
    }

    async validateAmenities() {
        await this.availableAmenities.click()
    }

    async clickLodgingFields() {
        await this.lodgingFields.click()
    }

    async selectAmenity(gameRoom) {
        await this.amenity(gameRoom).click()
    }

    async addTransactionLink(linkType, value) {
        await this.transactionLink(linkType).fill(value)
    }

    async validateTransactionLink(linkType, value) {
        await expect(this.transactionLink(linkType)).toHaveValue(value)
    }

    async servicesBoxClick() {
        await this.servicesBox.click()
    }

    async selectService(service) {
        await this.servicesList(service).click()
    }

    async validateSelectedService(service) {
        await expect(this.serviceSelected(service)).toBeTruthy()
    }

    async createFreeFormService(service) {
        await this.page.keyboard.press('Enter')
        await this.freeFormService.fill(service)
        await this.page.keyboard.press('Enter')
    }
}