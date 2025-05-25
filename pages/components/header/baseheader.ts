import {Locator, Page} from "@playwright/test"
import Login from "../login";

export class Header {
    private page: Page
    private uberallLogo: Locator
    addLocationHeaderButton: Locator
    private currentUserDropdown: Locator
    private currentUserLogin: Locator
    private dropdownItem: (item: UserDropdownList) => Locator

    constructor(page: Page) {
        this.page = page
        this.uberallLogo = page.locator("//div[@class='logo-wrapper']//a[contains(@href, 'app/uberall')]")
        this.addLocationHeaderButton = page.locator("//img[contains(@class, 'add-location')]")
        this.currentUserDropdown = page.locator("//div[contains(@class, 'user-dropdown-wrapper')]")
        this.currentUserLogin = page.locator("//span[@class= 'user-dropdown-email']")
        this.dropdownItem = (item: UserDropdownList) => page.locator(`//ul[contains(@class, 'user-dropdown-list')]/li[${item}]`)
    }

    async clickOnUberallLogo(): Promise<void> {
        await this.uberallLogo.click()
    }

    private async selectDropdownItem(item: UserDropdownList): Promise<void> {
        await this.currentUserDropdown.click()
        await this.dropdownItem(item).click()
    }

    //ToDo: Implement into Password and Email Edit Specs
    async goToSettings(): Promise<void> {
        await this.selectDropdownItem(UserDropdownList.SETTINGS)
    }

    //ToDo: Implement into Logout Specs
    async logout(): Promise<boolean> {
        await this.selectDropdownItem(UserDropdownList.LOGOUT)
        return new Login(this.page).isAt()
    }
}

export enum UserDropdownList {
    SETTINGS = "1",
    INVOICES = "2",
    FAQ = "3",
    API_KEYS = "4",
    LOGOUT = "last()"
}
