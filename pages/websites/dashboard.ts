import { expect, Locator, Page } from "@playwright/test";

export default class Dashboard {
    dashBoardLinkSideMenu: Locator
    locatorBuilderLinkSideMenu: Locator
    dashBoardLinkSideMenuNewNav: Locator
    locatorBuilderLinkSideMenuNewNav: Locator

    constructor(public page: Page) {
        this.dashBoardLinkSideMenu = page.locator('[href="/en/app/uberall/dashboard"]')
        this.locatorBuilderLinkSideMenu = page.locator('[href="/en/app/uberall/websites"]')
        this.dashBoardLinkSideMenuNewNav = page.getByRole('link', { name: 'Dashboard' })
        this.locatorBuilderLinkSideMenuNewNav = page.getByRole('link', { name: 'Locator + Pages' })
    }

    async navigateToLocatorPages(){
        await this.validateHomePageIsOpen()
        await this.openLocatorPages()
    }

    async navigateToLocatorPagesNewNav(){
        await this.validateHomePageIsOpenNewNav()
        await this.locatorBuilderLinkSideMenuNewNav.click({timeout: 50000})
    }

    async validateHomePageIsOpen() {
        await expect(this.dashBoardLinkSideMenu).toBeVisible()
    }

    async validateHomePageIsOpenNewNav() {
        await expect(this.dashBoardLinkSideMenuNewNav).toBeVisible()
    }

    async openLocatorPages() {
        await this.locatorBuilderLinkSideMenu.click({timeout: 60000})
    }
}