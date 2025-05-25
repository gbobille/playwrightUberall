import { Page, expect, Locator } from "@playwright/test";
export default class CleansingLogin {
    static   readonly url     : string = process.env.GEODESY_BASE_URL
    readonly page             : Page
    readonly emailTextField   : Locator
    readonly passwordTextField: Locator
    readonly loginBtn         : Locator

    constructor(page: Page) {
        this.page              = page
        //this.emailTextField    = this.page.getByPlaceholder('Username')
        this.emailTextField     = this.page.locator('input[formcontrolname="username"]')
        //this.passwordTextField = this.page.getByPlaceholder('Password')
        this.passwordTextField     = this.page.locator('input[formcontrolname="password"]')
        this.loginBtn          = this.page.locator('button[color="primary"]')
    }

    async goto() {
        await this.page.goto(CleansingLogin.url, { waitUntil: "domcontentloaded" })
    }

    async userLogin(email: string, password: string) {
        await this.emailTextField.fill(email)
        await this.passwordTextField.fill(password)
        await this.loginBtn.click()
    }
}