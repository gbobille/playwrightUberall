import { Page, expect, Locator } from "@playwright/test";
export default class CleansingDashboard {

    readonly page               : Page
    readonly navRouterLink      : (locatorRouterLink: string) => Locator
    readonly userProfileButton  : Locator
    readonly logOutButton       : Locator

    constructor(page: Page) {
        this.page               = page
        this.navRouterLink      = (locatorRouterLink: string) => this.page.locator(`app-nav-item[routerlink="${locatorRouterLink}"]`)
        this.userProfileButton  = this.page.locator('mat-icon[class="g-account-circle mat-icon notranslate mat-menu-trigger material-icons mat-icon-no-color"]') 
        this.logOutButton       = this.page.locator('button[role="menuitem"]')
    }

    async validateLinkPresent(linkName:string) {
        await expect(this.navRouterLink(linkName)).toBeVisible()
    }
}