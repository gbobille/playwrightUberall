import { expect, Locator, Page } from "@playwright/test";
import Utils from "../../utils/utils";

export default class LocatorPages {
    locatorBuilderTitle: Locator
    createStoreFinderBtn: Locator
    searchStoreLocator: Locator
    editStoreLocator: Locator
    colorTab: Locator
    pagesTab: Locator
    changeBkGroundColorTxt: Locator
    changeBkGroundColorDropDown: Locator
    saveChangesBtn: Locator
    confirmationBanner: Locator
    addAttributeBtn: Locator
    firstCustomHTMLAddSectionOptions: Locator
    openCustomHtmlDropDown: Locator
    selectFirstCustomHtmlOption: Locator
    locationSortingLbl: Locator
    locationSortingCustomLbl: Locator
    customSorting: Locator
    showFavoriteStoreOn: Locator
    cTAOn: Locator
    cTAComponent: Locator
    customFieldLbl: Locator
    deleteBtn: Locator
    confirmDeletionBtn: Locator
    sourceMainElement: Locator
    targetMainElement: Locator
    sidebarLabel: Locator
    backGroundColorPicker: Locator
    headerSectionLabel: Locator
    utils: Utils


    constructor(public page: Page) {
        this.locatorBuilderTitle = page.getByText("Locator + Pages Builder")
        this.createStoreFinderBtn = page.getByTestId('website-self-service-action-area-create-locator-button')
        this.searchStoreLocator = page.getByTestId('website-self-service-action-area-search-box')
        this.editStoreLocator = page.getByTestId('website-self-service-store-locator-list-grid-view-card-item-button-edit')
        this.colorTab = page.getByTestId('website-self-service-config-page-tab-color')
        this.pagesTab = page.getByTestId('website-self-service-config-page-tab-pages')
        this.changeBkGroundColorTxt = page.getByTestId('website-self-service-color-picker-input-field-button-background-color')
        this.changeBkGroundColorDropDown = page.getByTestId('website-self-service-color-picker-toggle-button-background-color')
        this.saveChangesBtn = page.getByTestId('website-self-service-actions-bar-save')
        this.addAttributeBtn = page.getByTestId('website-self-service-drop-down-attributes-button')
        this.firstCustomHTMLAddSectionOptions = page.getByText('Custom HTML').first()
        this.openCustomHtmlDropDown = page.getByTestId('website-self-service-pages-tab-custom-field-drop-down-wrapper')
        this.selectFirstCustomHtmlOption = page.getByTestId('First_Custom_Field')
        this.locationSortingLbl = page.getByTestId('website-self-service-location-list-sort-option-header')
        this.locationSortingCustomLbl = page.locator('(//div[@data-testid="website-self-service-options-box-location-list-sort-item"])[2]')
        this.customSorting = page.getByTestId('website-self-service-custom-location-list-sort-label-input')
        this.confirmationBanner = page.getByTestId('website-self-service-notification-banner-success')
        this.showFavoriteStoreOn = page.getByTestId('website-self-service-toggle-box-show-favorite-store-view-button')
        this.cTAOn = page.getByTestId('website-self-service-toggle-box-call-to-action-button-view-button')
        this.cTAComponent = page.getByTestId('website-self-service-common-dropdown-max-custom-cta-buttons-in-location-list')
        this.customFieldLbl = page.getByRole('button', { name: 'Custom HTML' })
        this.deleteBtn = this.customFieldLbl.getByTestId("website-self-service-pages-tab-drag-and-drop-delete-icon")
        this.confirmDeletionBtn = page.getByTestId('website-self-service-column-section-delete-modal-submit-button')
        this.sourceMainElement = page.getByRole('button', { name: 'Categories' }).locator('.self-service-common-drag-and-drop-box-icons-right')
        this.targetMainElement = page.getByRole('button', { name: 'Brands' }).locator('.self-service-common-drag-and-drop-box-icons-right')
        this.sidebarLabel = page.getByTestId('website-self-service-config-page-tab-container').getByText('Sidebar')
        this.backGroundColorPicker = page.locator('//div[@data-testid="website-self-service-color-picker-container-button-background-color"]')
        this.headerSectionLabel = page.getByTestId("website-self-service-section-header-header")

        this.utils = new Utils()
    }

    async verifyLocatorPagesOpen() {
        await expect(this.locatorBuilderTitle).toBeVisible()
    }

    async searchForLocator(locatorName: string) {
        await this.searchStoreLocator.clear()
        await this.searchStoreLocator.type(locatorName)
        await this.searchStoreLocator.press('Enter')
    }

    async openStoreLocator() {
        await this.editStoreLocator.click()
    }

    async openColorTab() {
        await this.colorTab.click()
    }

    async openPagesTab() {
        await this.page.waitForLoadState("domcontentloaded")
        await this.pagesTab.click()
    }

    async changeColor(color: string) {
        await this.changeBkGroundColorTxt.scrollIntoViewIfNeeded()
        await this.changeBkGroundColorTxt.clear()
        await this.changeBkGroundColorTxt.fill(color)
        await this.page.keyboard.press("Enter")
    }

    async verifyColorChange() {
        await this.page.waitForTimeout(5000)
        await this.changeBkGroundColorDropDown.scrollIntoViewIfNeeded()
        await expect(this.changeBkGroundColorDropDown).toHaveScreenshot()
    }

    async saveChanges() {
        await this.saveChangesBtn.click()
        await this.confirmationBanner.waitFor({ state: "visible" })
        await expect(this.confirmationBanner).toBeVisible()
    }

    async addCustomHtmlToPrimaryColumn() {
        await this.page.mouse.wheel(0, 1000);
        await this.addAttributeBtn.first().click()
        await this.firstCustomHTMLAddSectionOptions.click()
    }

    async selectCustomHtmlInPrimaryColumn() {
        await this.openCustomHtmlDropDown.click()
        await this.selectFirstCustomHtmlOption.click()
    }

    async deleteCustomHtmlFromMainColumn(sfName: string) {
        await this.openStoreLocatorEditor(sfName);
        await this.openPagesTab();
        await this.sidebarLabel.scrollIntoViewIfNeeded()
        await this.sidebarLabel.click()
        let attempts = 4;
        while (attempts > 0) {
            try {
                await this.deleteBtn.waitFor({ state: "visible" })
                await this.deleteBtn.click({ force: true })
                await this.confirmDeletionBtn.waitFor({ state: "visible" });
                break;
            } catch (error) {
                attempts--;
                if (attempts === 0) {
                    throw new Error("Failed to make confirmDeletionBtn visible after clicking deleteBtn.");
                }
                console.log(`Retrying click on deleteBtn, attempts left: ${attempts}`);
            }
        }
        await this.confirmDeletionBtn.click();
        await this.saveChanges();
    }

    async openStoreLocatorEditor(sfName: string) {
        await this.verifyLocatorPagesOpen()
        await this.searchForLocator(sfName)
        await this.openStoreLocator()
    }

    async changeSideMenuSorting() {
        await this.page.getByRole('button', { name: 'Brands' }).scrollIntoViewIfNeeded()
        await this.page.getByRole('button', { name: 'Brands' }).click()
        await this.page.getByRole('button', { name: 'Brands' }).getByTestId('website-self-service-pages-tab-drag-and-drop-box-left-icon').hover({ force: true, timeout: 5000 })
        await this.page.mouse.down({ button: "left" })
        await this.page.getByRole('button', { name: 'Payment Options' }).getByTestId('website-self-service-pages-tab-drag-and-drop-box-left-icon').hover({ force: true, timeout: 5000 })
        await this.page.mouse.up({ button: "left" })
    }

    async revertSideMenuSorting() {
        await this.openStoreLocatorEditor("TestSF2")
        await this.openPagesTab()
        await this.page.waitForLoadState("domcontentloaded")
        await this.page.mouse.wheel(0, 1050);
        const newSourceElement = await this.page.getByRole('button', { name: 'Brands' }).locator('.self-service-common-drag-and-drop-box-icons-right')
        const newTargetElement = await this.page.getByRole('button', { name: 'Categories' }).locator('.self-service-common-drag-and-drop-box-icons-right')
        await this.utils.dragAndDrop(this.page, newSourceElement, newTargetElement, { x: 0, y: (await newTargetElement.boundingBox()).y })
        await this.saveChanges()
    }

    //verify custom sorting is displayed
    async addCustomSorting() {
        const storeLocatorPreviewFrame = await this.page.frameLocator('//iframe[@title="store-locator"]')
        await expect(storeLocatorPreviewFrame.locator(".ubsf_store-finder-button")).toBeVisible()
        await this.locationSortingLbl.isVisible()
        await this.locationSortingCustomLbl.click()
        await expect(storeLocatorPreviewFrame.getByTestId('sort-options-dropdown-box')).toBeVisible()
    }

    //verify vaforite location
    async enableFavoriteLocationBtn() {
        const storeLocatorPreviewFrame = await this.page.frameLocator('//iframe[@title="store-locator"]')
        await this.showFavoriteStoreOn.click()
        await expect(storeLocatorPreviewFrame.locator('.store-finder-secondary-button.ubsf_favorite-store-button').first()).toBeVisible()
    }

    //verify cta
    async enableCTABtn() {
        await this.cTAOn.click()
        await expect(this.cTAComponent).toBeVisible()
        const storeLocatorPreviewFrame = await this.page.frameLocator('//iframe[@title="store-locator"]')
        await expect(storeLocatorPreviewFrame.getByTestId('custom-cta-button').first()).toBeVisible()
    }
}