import { Page, expect, Locator } from "@playwright/test";
export default class BulkUpdate {
    constructor(private page: Page) { }

    public addLocationBtn: Locator = this.page.locator('//span[contains(text(),"+ Add locations")]');
    public selectLocationSearch: Locator = this.page.getByPlaceholder("Search locations");
    public selectBulkLocationSearch: Locator = this.page.locator('input[class="search-input-input"]');
    public selectLocationValue = (locationName: string) => this.page.getByText(`${locationName}`)
    public selectBulkLocation1Value = (location1Name: string) => this.page.locator('div[class="location-item-name"]').filter({hasText: `${location1Name}`})
    public selectBulkLocation2Value = (location2Name: string) => this.page.locator('div[class="location-item-name"]').filter({hasText: `${location2Name}`})
    public selectLocationsButton: Locator = this.page.locator('button[data-testid=\"add-locations-button\"]')
    public richDataTab: Locator = this.page.getByTestId('ZNT-tabs_tabs-navigation-Rich Data')
    //Bulk Update Basic Data
    public clickNextButton: Locator = this.page.locator('button[data-testid="footer-next-action"]')
    public clickAddTimePeriod: Locator = this.page.locator('span').filter({ hasText: 'Add time period' })
    public clickSelectADay: Locator = this.page.locator('div[data-testid="days-dropdown_select-wrapper"]')
    public selectADay: Locator = this.page.locator('label').filter({ hasText: 'Select All' }).locator('div').first()
    public clickOpensAt: Locator = this.page.locator('div[data-testid="from-time-dropdown_select-wrapper"]')
    public selectOpenTime: Locator = this.page.getByTestId('09:00')
    public clickClosesAt: Locator = this.page.locator('div[data-testid="to-time-dropdown_select-wrapper"]')
    public selectClosesTime: Locator = this.page.getByTestId('18:00')
    public fillOpeningHours: Locator = this.page.locator('textarea[id="openingHoursNotes"]')
    public fillDescriptionShort: Locator = this.page.locator('#descriptionShort > div.DraftEditor-root > div > div')
    public fillDescriptionLong: Locator = this.page.locator('#descriptionLong> div.DraftEditor-root > div > div')
    public fillImprint: Locator = this.page.locator('textarea[id="imprint"]')
    public clickLabels: Locator = this.page.locator('div[data-testid="ZNT-dropdown_select-wrapper"]').nth(1);
    public selectLabels: Locator = this.page.getByTestId('German')
    public clickSaveChangesButton: Locator = this.page.locator('button:has-text("Save Changes")')
    public clickUpdateButton: Locator = this.page.locator('span[title="Update"]')
    public clickConfirmButton: Locator = this.page.locator('button[data-testid="confirmation-modal-confirm-btn"]')
    public locationNameCell = (locationName:string) => this.page.locator('td[role="cell"]').filter({hasText: `${locationName}`}).first()
    public successMessageUpdate: Locator = this.page.locator('span', { hasText: 'WE SUCCESSFULLY UPDATED YOUR LOCATIONS' });
    public clickSpecialOpeningHoursButton: Locator = this.page.locator('span:has-text("Add Special Hours")')
    public selectDays: Locator = this.page.locator('input[data-testid="soh-datePicker_open-picker"]')
    public clickDate: Locator = this.page.locator('svg[width="16"][height="16"][viewBox="0 0 16 16"][fill="none"]').nth(22);
    public selectDate: Locator = this.page.locator('div[aria-selected="false"][aria-disabled="false"]').nth(22);
    public bulkUpdateButton: Locator = this.page.locator('text=Bulk Update');
    //Bulk Update Rich Data
    public socialProfileText(socialProfileType: string): Locator {
        return this.page.locator(`input[id="${socialProfileType}"]`);
      }
    public clickSelectAttribute:Locator = this.page.locator('div[id="attributes"]')
    public selectAttribute:Locator = this.page.locator('span[title="Appointment links"]')
    public inputAttributeLinks:Locator = this.page.locator('input[data-testid="attribute-text-url_appointment"]')
    //Photos and Videos
    public tapPhotosAndVideosTab:Locator = this.page.locator('button[data-testid="ZNT-tabs_tabs-navigation-Photos & Videos"]')
    public postVideoUrlTab:Locator = this.page.locator('button[data-testid="tabs-navigation-Post Video URL"]')
    public inputVideoURL:Locator = this.page.locator('input[placeholder="Youtube or Vimeo URL here"]')
    public addVideoButton:Locator = this.page.locator('button[data-testid="add-video-url-button"]') 
    public dropFileVideo:Locator = this.page.locator('div[data-testid="media-uploader-file-dropzone"]')
    //Confirmation page
    public confirmationPage = (value: string) => this.page.getByTitle(`${value}`)
    public confirmationSpecial = (value: string) => this.page.getByText(`${value}`)

    async clickAddLocationsButton() {
        await this.addLocationBtn.click()
    }

    async enterLocationName(location) {
        await this.selectLocationSearch.fill(location)
    }

    async selectLocation(location) {
        await this.selectLocationValue(location).click()
    }

    async clickSelectButton() {
        await this.selectLocationsButton.click()
    }

    async clickRichDataTab() {
        await this.richDataTab.click()
    }

    async validateChanges(value: string) {
        const element = this.confirmationPage(value);
        await expect(element).toHaveText(value);
        expect(this.confirmationPage(value)).toBeTruthy()
    }
    
    async validateSpecialChanges(value: string) {
        const element = this.confirmationSpecial(value);
        await expect(element).toHaveText(value);
        expect(this.confirmationSpecial(value)).toBeTruthy()
    }
    //bulk update basic data
    async clickNext() {
        await this.clickNextButton.waitFor({ state: 'visible' });
        await this.clickNextButton.click()
    }
    async updateOpeningHours() {
        await this.clickAddTimePeriod.click()
        await this.clickSelectADay.click()
        await this.selectADay.click()
        await this.clickOpensAt.click()
        await this.selectOpenTime.click()
        await this.clickClosesAt.click()
        await this.selectClosesTime.click()
        await this.fillOpeningHours.fill('Test Opening Hours Notes')
    }
    async updateBusinessInfoAndDescription() {
        await this.fillDescriptionShort.fill('Short Description Text')
        await this.fillDescriptionLong.fill('Long Description Text')
        await this.fillImprint.fill('Imprint Test')
    }
    async updateLabels() {
        await this.clickLabels.click()
        await this.selectLabels.click()
    }
    async clickSaveChanges() {
        await this.clickSaveChangesButton.click()
        await this.clickUpdateButton.click()
        await this.clickConfirmButton.click()
    }
    async setSpecialOpeningHoursDate() {
        await this.clickSpecialOpeningHoursButton.click()
        await this.selectDays.click()
        await this.clickDate.click()
    }
    async setSocialProfiles(socialProfile: string, socialProfileValue: string) {
        const inputLocator = this.socialProfileText(socialProfile);

        await inputLocator.waitFor({ state: 'visible', timeout: 5000 });
        await inputLocator.fill(socialProfileValue);
    }
    //Rich Data
    async setAttributes() {
        await this.clickSelectAttribute.click()
        await this.selectAttribute.click()
        await this.inputAttributeLinks.fill('https://www.appointment.com')
    }
    //Photos and Video
    async uploadUrlVideo() {
        await this.postVideoUrlTab.click()
        await this.inputVideoURL.fill('https://www.youtube.com/watch?v=WzuJANOPLyQ')
        await this.addVideoButton.click()
    } 
}