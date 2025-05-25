import { Locator, Page, expect } from "@playwright/test";

export default class ContentItems {
    
    constructor(private page: Page) {}
//TAB VIEWS
  menuTab = this.page.locator('button[data-testid="page-header-tab-menu"]')  
  peopleTab = this.page.locator('button[data-testid="page-header-tab-people"]')  
  productsTab = this.page.locator('button[data-testid="page-header-tab-products"]')  
  customTab = this.page.locator('button[data-testid="page-header-tab-custom"]')  
//ITEMS MAIN FIELDS
identifierText: Locator = this.page.locator('input[id="identifier"]')
nameText: Locator = this.page.locator('input[id="title"]')
titleText: Locator = this.page.locator('input[id="title"]')
peoplenameText: Locator = this.page.locator('input[id="name"]')
descriptionText: Locator = this.page.locator('textarea[id="description"]')
urlText: Locator = this.page.locator('input[id="url"]')
priceText: Locator = this.page.locator('input[id="price"]')
videoUrlText: Locator = this.page.locator('input[id="video"]')
//ITEMS IMAGE UPLOAD
addImageButton: Locator = this.page.locator('//button[text()="Add Image"]')
createItemButton: Locator = this.page.locator('//button[text()="Create Item"]')
saveItemButton: Locator = this.page.locator('button[data-testid="actions-bar-save"]')
browseImage: Locator = this.page.getByText('Browse Images')
imageDropZone: Locator = this.page.getByTestId('image-upload-dropzone').getByRole('img')
imgUpload: Locator = this.page.locator('div').filter({ hasText: 'Image UploadBrowse' }).first()
uploadButton: Locator = this.page.getByRole('button', { name: 'Upload' })
//ITEMS DELETE IMAGE
hoverImageIcon: Locator = this.page.locator('[data-testid="ZNT-media-preview-box_media-container"]')
deleteImageIcon: Locator = this.page.locator('[data-testid="ZNT-media-preview-box_media-delete-button"]')
deleteImageButton: Locator = this.page.getByRole('button', { name: 'Delete' })
recentlyCreatedItem = (itemName:string) => this.page.getByTitle(`${itemName}`)
//EDIT ITEM
editItemButton = this.page.getByRole('button', { name: 'Edit' })
//UPDATE ITEM
updateItemButton = this.page.getByTestId('actions-bar-update')
//DELETE ITEM
deleteItemButton = this.page.locator('tbody tr td div button').first()
confirmDeleteItem = this.page.locator('div button[type="button"]').last()
//ADDITIONAL ITEM FIELDS
currencyDropdown = this.page.locator('div[id=\"currency\"]')
currencyDropdownMenuItemOnly = this.page.getByTestId('app.content.lists.menu.item.page.currency_select-wrapper').locator('svg')
currencySelector = this.page.getByTestId('USD')
caloriesLow = this.page.locator('input[id=\"caloriesLow\"]')
caloriesHigh = this.page.locator('input[id=\"caloriesHigh\"]')
allergensClick = this.page.locator('div[id=\"allergens\"]')
allergensSelect = this.page.getByTestId('Dairy')
dietaryClick = this.page.locator('div[id=\"dietaryRestrictions\"]')
dietarySelect = this.page.getByTestId('Vegan')
//NAVIGATION
async goTo() {
    await this.page.goto(`${process.env.BASE_URL}/en/app/uberall/content-lists/collections`, { waitUntil: 'networkidle' });;
  }
    async selectCurrency() {
    await this.currencyDropdown.click()
    await this.currencySelector.click()
    }
    async selectCurrencyMenuItemOnly() {
        await this.currencyDropdownMenuItemOnly.click()
        await this.currencySelector.click()
        }
    async addImage() {
        await this.addImageButton.click();
        await this.browseImage.click();
        await this.imageDropZone.click();
    }
    async fillNutritionalFacts() {
    await this.caloriesLow.click();
    await this.caloriesLow.fill('450');
    await this.caloriesHigh.click();
    await this.caloriesHigh.fill('500');
    await this.allergensClick.click();
    await this.allergensSelect.click();
    await this.dietaryClick.click();
    await this.dietarySelect.click();
    }
    async clickEditButton(itemName : string) {
        await this.recentlyCreatedItem(itemName).hover()
        await this.editItemButton.isVisible()
        await this.editItemButton.click()
    }
    async clickDeleteButton(itemName : string) {
        await this.recentlyCreatedItem(itemName).hover()
        await this.deleteItemButton.isVisible()
        await this.deleteItemButton.click()
    }
    async clickDeleteImage() {
        await this.hoverImageIcon.hover()
        await this.deleteImageIcon.click()
        await this.deleteImageButton.click()
    }
}
    