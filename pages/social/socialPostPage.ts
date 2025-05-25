import { Locator, Page, expect } from "@playwright/test";

const path: string = "./tests/social/test_data/"

export default class Social { 
    leftNavSocialMenu: Locator
    calendarTab: Locator
    postListViewTab: Locator
    newPostButton: Locator
    createNewPostButton: Locator
    facebookButton: Locator
    googleButton: Locator
    instagramButton: Locator
    instagramHandle: Locator
    arrowDownButton: Locator
    instagramPostType: Locator
    facebookPostType:Locator
    instagramTypeReels: Locator
    addMediaButton: Locator
    titleTxtbox: Locator
    descriptionLabel: Locator
    successMessage: Locator
    doneButton: Locator
    dropImageButton: Locator
    dropVideoButton: Locator
    fbDropImageButton: Locator
    googleDropImageButton: Locator
    publicationDateButton: Locator
    publishNowButton: Locator
    confirmNowButton: Locator
    publishToTheFacebookCheckbox: Locator
    chooseBrandPagesDropdown: Locator
    brandPageOptions: Locator
    addLocationButton: Locator
    searchBusiness : Locator
    selectLocation : Locator
    selectButton : Locator
    editButton : Locator
    deleteButton: Locator
    deletePostButton: Locator
    scheduleForLaterButton: Locator
    postNowButton: Locator
    saveChangesButton: Locator
    googlePostTypeNews: Locator

    
    constructor(public page: Page) {
        this.leftNavSocialMenu = page.getByTestId('publish').getByRole('link', { name: 'Social' })
        this.calendarTab = page.getByTestId('page-header-tab-social-post-calendar')
        this.postListViewTab = page.getByTestId('page-header-tab-social-post-list')
        this.newPostButton = page.getByText('New post')
        this.createNewPostButton = page.getByTestId('posting-create-new-post').getByText('Create new post')
        this.facebookButton = page.getByTestId('social-post-directory-select-social-directory-option-FACEBOOK')
        this.googleButton = page.getByTestId('social-post-directory-select-social-directory-option-GOOGLE')
        this.instagramButton = page.getByTestId('social-post-directory-select-social-directory-option-INSTAGRAM')
        this.instagramHandle = page.getByTestId('ZNT-dropdown_select-wrapper')
        this.arrowDownButton = page.getByTestId('ZNT-dropdown_select-wrapper').locator('svg').nth(1)
        this.instagramPostType = page.locator('label').filter({ hasText: 'Posts' })
        this.facebookPostType = page.locator('label').filter({ hasText: 'Post' })
        this.instagramTypeReels = page.locator('label').filter({ hasText: 'Reels' })
        this.addMediaButton = page.getByRole('button', { name: 'Add Media' })
        this.titleTxtbox = page.getByTestId('social-post-content-title-input')
        this.descriptionLabel = page.locator('.public-DraftStyleDefault-block')
        this.successMessage = page.locator(`div[class="toast-container"] div[class^="zenit"] `)
        this.doneButton = page.getByTestId('UploaderModal-confirm-button')
        this.dropImageButton = page.locator(`input[accept="image/jpeg"]`)
        this.dropVideoButton = page.locator(`input[accept="video/mp4,video/quicktime"]`)
        this.fbDropImageButton = page.locator(`input[accept="image/png,image/jpeg,image/bmp,image/gif,image/tiff"]`)
        this.googleDropImageButton = page.locator(`input[accept="image/png,image/jpeg"]`)
        this.publicationDateButton = page.getByTestId('post-publication-date_open-picker')
        this.publishNowButton = page.getByRole('button', { name: 'Publish Now' })
        this.confirmNowButton = page.getByRole('button', { name: 'Confirm' })
        this.publishToTheFacebookCheckbox = page.locator('label').filter({ hasText: 'Publish to the Facebook Brand' })
        this.chooseBrandPagesDropdown = page.getByTestId('ZNT-dropdown_select-wrapper').locator('svg')
        // this.brandPageOptions = page.getByText('Uberall QA Live Directory')
        this.brandPageOptions = page.getByText('Biocoop')
        this.addLocationButton = page.getByTestId('app-common-select-locations-button')
        this.searchBusiness = page.getByPlaceholder('Search businesses')
        this.selectLocation = page.getByText('Barcelona 08034, Carrer del Trinquet')
        this.selectButton = page.getByTestId('add-locations-button')
        this.editButton = page.getByRole('button', { name: 'Edit' })
        this.deleteButton = page.getByRole('button', { name: 'Delete' })
        this.deletePostButton = page.getByRole('button', { name: 'Delete Post' })
        this.scheduleForLaterButton = page.getByText('Schedule for later')
        this.postNowButton = page.getByTestId('social-post-form-submit-button')
        this.saveChangesButton = page.getByTestId('posting-form-post-save-changes-button')
        this.googlePostTypeNews = page.locator('label').filter({ hasText: 'News' })
    }

    async openSocialPages() {
        await this.leftNavSocialMenu.click()
    }

    async clickCalendarTabButton() {
        await this.calendarTab.click()
    }

    async clickPostListViewTabButton() {
        await this.postListViewTab.click()
    }

    async clickNewPostButton() {
        await this.newPostButton.click()
    }

    async clickCreateNewPostButton() {
        await this.createNewPostButton.click()
    }

    async clickFacebookButton() {
        await this.facebookButton.click()
    }

    async clickGoogleButton(){
        await this.googleButton.click()
    }

    async clickInstagramButton() {
        await this.instagramButton.click()
    }

    async clickInstagramHandleDropdown() {
        await this.instagramHandle.click()
    }

    async clickArrowDownButton(){
        await this.arrowDownButton.click()
    }

    async selectInstagramHandle(selected_handler: string){
        await this.page.getByText(selected_handler, { exact: true }).click()
    }

    async selectInstagramPostType(){
        await this.instagramPostType.click()
    }

    async selectFacebookPostType(){
        await this.facebookPostType.click()
    }

    async selectNewsGooglePostType(){
        await this.googlePostTypeNews.click()
    }

    async selectInstagramTypeReels(){
        await this.instagramTypeReels.click()
    }

    async clickAddMediaButton(){
        await this.addMediaButton.scrollIntoViewIfNeeded({timeout: 30_000})
        await this.addMediaButton.click()
    }
    
    async uploadMedia(imageFileName: string){
        const testDataLocationFile = path+imageFileName; 
        await this.dropImageButton.or(this.dropVideoButton).or(this.fbDropImageButton).or(this.googleDropImageButton).setInputFiles(testDataLocationFile)
        await this.doneButton.click();
    }
    
    async addTitlePostContent(test_title: string){
        await this.titleTxtbox.fill(test_title) 
    }

    async addDescriptionPostContent(test_description: string){
        await this.descriptionLabel.scrollIntoViewIfNeeded({timeout: 30_000})
        await this.descriptionLabel.click()
        await this.descriptionLabel.fill(test_description)
    }

    async selectInstagramHandles(selected_handler: string){
        this.clickInstagramHandleDropdown()
        const instagramHandlerMenu = this.page.getByText(selected_handler, { exact: true })
        await instagramHandlerMenu.waitFor()        
        this.selectInstagramHandle(selected_handler)
        this.clickArrowDownButton()   
    }

    async clickPublicationDateButton(){
        await this.publicationDateButton.click()
    }

    async clickPublishNowButton(){
        await this.publishNowButton.click()
    }

    async clickConfirmNowButton(){
        await this.confirmNowButton.click()
    }

    async clickonEditButton(POST_CONTENT_TITLE: string, ACTION_BUTTON:string){
        return this.page.getByRole('list').locator('div').filter({ hasText: POST_CONTENT_TITLE}).getByRole(`button`).filter({hasText: ACTION_BUTTON}).click()
    }

    async checkPublishToTheFacebookCheckbox() {
        await this.publishToTheFacebookCheckbox.check()
    }

    async clickChooseBrandPageDropdown() {
        await this.chooseBrandPagesDropdown.click()
    }

    async chooseBrandPage(){
        await this.brandPageOptions.click()

    }

    async clickAddLocationsButton() {
        await this.addLocationButton.click()
    }

    async clickSeachBusiness() {
        await this.searchBusiness.click()
    }

    async selectBusiness(SEARCH_BUSINESS: string){
        return this.page.getByText(SEARCH_BUSINESS).click()
    }

    async clickSelectedLocation() {
        await this.selectLocation.click()
    }

    async clickSelectButton(){
        await this.selectButton.click()
    }

    async verifyPostPreviewDisplayed(SocialPostMedia:string){

        let message = "";

        switch(SocialPostMedia){
            case "Facebook":
                message = "Facebook photo preview"
                break;
            case "Instagram":
                message = "Instagram photo preview"
                break;
            default:
                message = "Facebook photo preview"
                break;
        }
        const uploadPreview = this.page.getByRole('img', {name: `${message}`})
        await expect.soft(uploadPreview).toBeVisible()   
    }

    PostPreviewCalendarEvent(Media:string){
        const date = new Date()

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateNow = `${year}-${month}-${day}`

        const calendarDate = this.page.locator(`//table/tbody/tr/td[@data-date="${dateNow}"]/div/div[@class="fc-daygrid-day-events"]`)
        const calendarEvent = calendarDate.locator(`//div[@class="fc-daygrid-event-harness"]/a/div[contains(@data-for,"${Media}")]`)
        return calendarEvent
    }

    async verifyPostPreviewDisplayedCalendar(Media:string){
        const calendarEvent = this.PostPreviewCalendarEvent(Media)
        await expect.soft(calendarEvent).toBeVisible()
    }

    async clickPostPreviewCalendarEvent(Media:string){
        const calendarEvent = this.PostPreviewCalendarEvent(Media)
        await calendarEvent.click()
    }

    async clickEditButton(){
        this.editButton.click()
    }

    async clickDeleteButton(){
        this.deleteButton.click()
    }

    async clickOnDeletePostButton(){
        this.deletePostButton.click()
    }

    async clickOnScheduleForLaterButton(){
        this.scheduleForLaterButton.click()
    }

    async clickOnPostNowButton(){
        this.postNowButton.click()
    }

    async clickSaveChangesButton(){
        await this.saveChangesButton.click()
    }
}
