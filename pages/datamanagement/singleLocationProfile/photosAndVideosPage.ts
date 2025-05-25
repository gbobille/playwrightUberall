import { Locator, Page } from "@playwright/test";
import * as path from 'path';

export default class PhotosAndVideos {
    uploadPhotoButton: Locator
    dropFileArea: Locator
    confirmButton: Locator
    photoUploaded: Locator
    uploadVideoButton: Locator
    uploadVideoBulkButton: Locator
    albumName: String
    saveItem: Locator
    postVideoUrlButton: Locator
    inputVideoUrl: Locator
    addVideoUrl: Locator
    videoURLUploaded: Locator
    videoFileUploaded: Locator
    readonly albumTab : (albumName : string) => Locator
    readonly logoCoverPlaceholder : (logoCoverPlaceholder : string) => Locator

    constructor(page: Page) {
        this.uploadPhotoButton = page.getByTestId('album-photos-add-photo-button-PHOTO')
        this.uploadVideoButton =  page.getByTestId('add-video-button')
        this.uploadVideoBulkButton = page.getByTestId('media-uploader-file-dropzone').getByRole('img')
        this.dropFileArea = page.locator('input[type="file"]')
        this.confirmButton = page.locator('button[data-testid=\"UploaderModal-confirm-button\"]')
        this.photoUploaded = page.getByText('Changes have been saved').first()
        this.videoURLUploaded = page.getByTestId('MediaPreviewBox-590974_media-container').locator('div').nth(3)
        this.videoFileUploaded = page.getByTestId('MediaPreviewBox-590977_media-container').locator('div').nth(2)
        this.albumTab = (albumName : string) => page.getByTestId(`ZNT-tabs_tabs-navigation-${albumName}`)
        this.logoCoverPlaceholder = (logoCoverPlaceholder : string) => page.getByTestId(`dropzone-box-${logoCoverPlaceholder}`)
        this.saveItem = page.locator('button[data-testid=\"save-item\"]')
        this.postVideoUrlButton = page.getByTestId('tabs-navigation-Post Video URL')
        this.inputVideoUrl = page.getByPlaceholder('Youtube or Vimeo URL here')
        this.addVideoUrl = page.getByTestId('add-video-url-button')
    }

    async clickAlbumTab(album) {
        await this.albumTab(album).click()
    }

    async uploadPhoto() {
        await this.dropFileArea.setInputFiles(path.resolve(__dirname, '../../../tests/testData/images/Exterior.jpg'));
    }

    async clickConfirmUpload() {
        await this.confirmButton.click()
    }

    async clickUploadVideo() {
        await this.uploadVideoButton.click()
    }
}