import { Locator, Page} from "@playwright/test";

export default class BasicData {
    sublocalityElement: Locator
    sublocalityField: Locator
    locationNameTxt: Locator
    successMessage: Locator
    addressLine2: Locator
    mobileNumber: Locator
    faxNumber: Locator
    emailAddress: Locator
    saveButton: Locator
    categoryField: Locator
    healthCareCategory: Locator
    doctorCategoryField: Locator
    doctorCategory: Locator
    practiceNameField: Locator
    npiField: Locator
    degreeField: Locator
    universityField: Locator
    hospitalField: Locator
    insuranceField: Locator
    hearingAid: Locator
    restaurant: Locator
    hospital: Locator
    shortDescription: Locator
    shortDescriptionAdjustTone: Locator
    longDescriptionAdjustTone: Locator
    toneContent: (text: string) => Locator
    adjustedText: (content: string) => Locator
    description: (content: string) => Locator
    longDescription: Locator
    submitTone: Locator
    businessSearchField: Locator
    business_with_ai: Locator
    business_with_no_ai: Locator
    selectBusiness: Locator
    clickBusinessName: Locator
    inputLocationName: Locator
    locationIdentifier: Locator
    openingDay: Locator
    addressLine1: Locator
    zipCode: Locator
    city: Locator
    phone: Locator
    hideAddress: Locator
    buyNow: Locator
    aiGeneratorIcon: Locator
    aiPrompt: Locator
    readonly descriptionShort : (description : string) => Locator
    readonly descriptionLong : (description : string) => Locator
    readonly locationName : (name : string) => Locator
    readonly toneStyle : (tone : string) => Locator
    addCTNButton: Locator
    addUTMButton: Locator
    readonly ctnInput : (value : string) => Locator
    readonly utmInput : (value : string) => Locator


    constructor(page: Page)
    {
        this.sublocalityElement = page.locator('span').filter({ hasText: 'Sublocality' })
        this.sublocalityField = page.locator('#sublocality')
        this.locationNameTxt = page.locator('input[id="name"]')
        this.successMessage = page.locator('div').filter({ hasText: /^Changes have been saved successfully\.$/ }).nth(3)
        this.addressLine2 = page.getByLabel('Address Line 2')
        this.mobileNumber = page.getByLabel('Mobile Phone')
        this.faxNumber = page.getByLabel('Fax')
        this.emailAddress = page.getByLabel('E-Mail')
        this.saveButton = page.getByTestId('save-changes-bar-save-button')
        this.locationName = (name : string) => page.getByTestId('app-page-header').getByText(`${name}`)
        this.categoryField = page.getByPlaceholder('Type a category, e.g., "')
        this.healthCareCategory = page.getByText('Healthcare > Medical').first()
        this.doctorCategoryField = page.getByPlaceholder('Type a category e.g. Nurse')
        this.doctorCategory = page.getByRole('option', { name: 'Certified Nurse Midwife >' })
        this.practiceNameField = page.getByLabel('Practice Name')
        this.npiField = page.getByLabel('NPI')
        this.degreeField = page.getByLabel('Credentials/Degrees')
        this.universityField = page.getByLabel('University')
        this.hospitalField = page.getByLabel('Hospital Affiliations')
        this.insuranceField = page.getByLabel('Insurances Accepted')
        this.hearingAid = page.getByText('Retail > Medical Supplies >')
        this.restaurant = page.getByText('Social and Entertainment > Food and Drinks > Restaurant').first()
        this.hospital = page.getByText('Healthcare > Hospitals, Clinics and Medical Centers > Hospital', { exact: true })
        this.shortDescription = page.locator('#descriptionShort').getByRole('textbox').locator('div').nth(2)
        this.shortDescriptionAdjustTone = page.getByTestId('ai-toneAdjuster-trigger').first()
        this.toneStyle = (tone : string) => page.getByTestId(`ai-toneAdjuster-tone-${tone}`)
        this.toneContent = (text: string) => page.getByText(`${text}`)
        this.adjustedText = (content: string) => page.getByText(`${content}`)
        this.description = (content: string) => page.getByText(`${content}`)
        this.longDescription = page.locator('#descriptionLong').getByRole('textbox').locator('div').nth(2)
        this.longDescriptionAdjustTone = page.getByTestId('ai-toneAdjuster-trigger').nth(1)
        this.submitTone = page.getByTestId('ai-toneAdjuster-submit')
        this.business_with_ai = page.locator('li').filter({ hasText: 'Schweinske' })
        this.businessSearchField = page.locator('.search-input')
        this.business_with_no_ai = page.getByText('Bike Racks Smart Conversation')
        this.selectBusiness = page.locator('.search-input')
        this.clickBusinessName = page.getByText('DM_DOCTOR_PLAN')
        this.inputLocationName = page.getByLabel('Business Name')
        this.locationIdentifier = page.getByLabel('Location Identifier')
        this.openingDay = page.getByTestId('ZNT-date-single_open-picker')
        this.addressLine1 = page.getByLabel('Address Line 1 (Street and')
        this.zipCode = page.getByLabel('ZIP/Postcode')
        this.city = page.locator('input[id="city"]')
        this.phone = page.getByLabel('Phone', { exact: true })
        this.hideAddress = page.getByText('Hide my address on')
        this.buyNow = page.locator('span', { hasText: 'BUY NOW' })
        this.aiGeneratorIcon = page.getByTestId('ai-business-description-trigger').first()
        this.aiPrompt = page.getByRole('textbox', { name: 'Describe your business in a' })
        this.descriptionShort = (description : string) => page.locator('#descriptionShort').getByText(`${description}`)
        this.descriptionLong = (description : string) => page.locator('#descriptionLong').getByText(`${description}`)
        this.addCTNButton = page.locator('button[data-testid="ctn-add-btn"]')
        this.addUTMButton = page.locator('button[data-testid="utm-add-btn"]')
        this.ctnInput = (value : string) => page.getByTestId(`ctn-input-${value}`)
        this.utmInput = (value : string) => page.locator(`textarea[id='website.utm.${value}']`)
    }

    async updateSublocality(sublocality) {
        await this.sublocalityField.fill(sublocality)
    }

    async updateAddressLine2(line2) {
        await this.addressLine2.fill(line2)
    }

    async updateMobileNumber(number) {
        await this.mobileNumber.fill(number)
    }

    async updateFaxNumber(number) {
        await this.faxNumber.fill(number)
    }

    async updateEmail(email) {
        await this.emailAddress.fill(email)
    }

    async fillBasicData() {
        await this.selectBusiness.click()
        await this.selectBusiness.fill('DM_DOCTOR_PLAN')
        await this.clickBusinessName.click()
        await this.inputLocationName.click()
        await this.inputLocationName.fill('DM_DOCTOR_LOCATION_AUTOMATED')
        await this.locationIdentifier.click()
        await this.locationIdentifier.fill('DM_DOCTOR_LOCATION_AUTOMATED')
        await this.openingDay.click()
        await this.openingDay.fill('01.04.2025')
        await this.addressLine1.click()
        await this.addressLine1.fill('Hussitenstraße 32-33')
        await this.zipCode.click()
        await this.zipCode.fill('13355')
        await this.hideAddress.click()
        await this.city.click()
        await this.city.fill('Berlin')
        await this.categoryField.click()
        await this.categoryField.fill('doctor')
        await this.healthCareCategory.click()
        await this.phone.click()
        await this.phone.fill('+1 847-563-4523')
    }

    async setCTN() {
        await this.addCTNButton.scrollIntoViewIfNeeded()
        await this.addCTNButton.click()

        await this.ctnInput('GOOGLE').fill('+441268584112')
        await this.ctnInput('FACEBOOK').fill('+441268584113')
        await this.ctnInput('BING').fill('+441268584114')
    }

    async setUTM() {
        await this.addUTMButton.scrollIntoViewIfNeeded()
        await this.addUTMButton.click()

        await this.utmInput('GOOGLE').fill('test?utm_source=google')
        await this.utmInput('FACEBOOK').fill('test?utm_source=facebook')
        await this.utmInput('BING').fill('test?utm_source=bing')
    }

    async clearCTnandUTM() {
        await this.phone.scrollIntoViewIfNeeded()

        await this.ctnInput('GOOGLE').fill('')
        await this.ctnInput('FACEBOOK').fill('')
        await this.ctnInput('BING').fill('')

        await this.utmInput('GOOGLE').fill('')
        await this.utmInput('FACEBOOK').fill('')
        await this.utmInput('BING').fill('')
    }

}