import { Locator, Page } from "@playwright/test"
export default class LoginPage {
    emailTxtField: Locator
    passwordTxtField: Locator
    loginBtn: Locator

    constructor(public page: Page) {
        this.emailTxtField = page.locator("#email")
        this.passwordTxtField = page.locator("#password")
        this.loginBtn = page.locator("input[value='LOGIN']")
    }

    async clickOnLogin() {
        await this.loginBtn.click()
    }

    //dont we have a log in method also coded in the components page?
    async logIn(email: string, password: string) {
        await this.emailTxtField.fill(email)
        await this.passwordTxtField.fill(password)
        this.clickOnLogin()
    }
}