import { Locator, Page } from "@playwright/test";

export default class ContentCollections {

    constructor(private page: Page) { }
    //TAB VIEWS
    collectionTab: Locator = this.page.locator('button[data-testid="page-header-tab-collections"]')
    //COLLECTION LIST
    recentlyCreatedCollection = (collectionName: string) => this.page.getByTitle(`${collectionName}`)
    deleteCollectionButton = this.page.locator('tbody tr td div button').first()
    confirmDeleteCollection = this.page.locator('div button[type="button"]').last()
    //NEW COLLECTION PAGE
    newCollectionButton: Locator = this.page.getByRole('button', { name: 'New Collection' })
    menuSelector: Locator = this.page.locator('#main').getByRole('list').getByText('Menu')
    peopleSelector: Locator = this.page.getByTitle('People', { exact: true })
    productsSelector: Locator = this.page.getByTitle('Products', { exact: true })
    customSelector: Locator = this.page.getByTitle('Custom', { exact: true })
    //COLLECTIONS MAIN FIELDS
    nameText: Locator = this.page.locator('input[id="name"]')
    identifierText: Locator = this.page.locator('input[id="identifier"]')
    descriptionText: Locator = this.page.locator('textarea[id="description"]')
    urlText: Locator = this.page.locator('input[id="url"]')
    dropdown: Locator = this.page.locator('div[id=\"cuisineType\"]')
    selectorMenuCollection: Locator = this.page.getByTestId('AMERICAN')
    //ADD LOCATIONS SECTION
    addLocationsButton: Locator = this.page.getByTestId('app-common-select-locations-button')
    //ADD SECTION
    addSectionButton: Locator = this.page.getByTestId('add-section-button')
    sectionTitle: Locator = this.page.locator('input[id="title"]')
    sectionDescription: Locator = this.page.locator('input[id="description"]')
    saveSectionButton: Locator = this.page.locator('button[data-testid="add-section-save-button"]')
    expandSectionButton: Locator = this.page.getByTestId('ZNT-accordion_trigger')
    //ADD ITEMS SECTION
    addItemButton: Locator = this.page.getByTestId('add-item-button')
    itemToSelect: Locator = this.page.locator('tbody tr td div label span').first()
    addItemsConfirm: Locator = this.page.getByTestId('add-items-confirm-button')
    //COLLECTIONS BOTTOM BAR ELEMENTS
    saveCollectionButton = this.page.locator('button[data-testid="actions-bar-save"]')
    //NAVIGATIONS
        async goTo() {
        // Navigate to the main collections page
        await this.page.goto(`${process.env.BASE_URL}/en/app/uberall/content-lists/collections`, { waitUntil: 'networkidle' }); 
    }
    async goToCollectionCreate(collectionType: string = 'collection') {
         // Navigate to the specific collection creation page based on collectionType
        await this.page.goto(`${process.env.BASE_URL}/en/app/uberall/content-lists/collections/${collectionType}/create`, { waitUntil: 'networkidle' });   
    }
    //COLLECTION TYPE SELECTOR
    async collectionTypeSelector(collectionType: string = 'collection') {
        await this.newCollectionButton.click()
        switch (collectionType) {
            case 'menu':
                await this.menuSelector.click()
                break;
            case 'people':
                await this.peopleSelector.click()
                break;
            case 'products':
                await this.productsSelector.click()
                break;
            case 'custom':
                await this.customSelector.click()
                break;
        }
    }
    async selectDropdownMenuCollection() {
        await this.dropdown.click()
        await this.selectorMenuCollection.click()
    }
    async clickDeleteButton(collectionName: string) {
        await this.recentlyCreatedCollection(collectionName).hover()
        await this.deleteCollectionButton.isVisible()
        await this.deleteCollectionButton.click()
    }
}