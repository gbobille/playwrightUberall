import { Page } from "@playwright/test";
import Login from "../pages/components/login";
import CleansingLogin from "../pages/components/cln-login";

/**
 * Logs into the Uberall application UI using the provided credentials to fill in both user email and password.
 *
 * @param {Page} page - The Playwright page object.
 * @param {string} username - The username for login.
 * @param {string} password - The password for login.
 * @returns {Promise<boolean>} - A promise that resolves to true if the login is successful, otherwise false.
 */
export async function loginUberallAppAs(page: Page, username: string, password: string): Promise<boolean> {
    try { 
        const loginPage = new Login(page)
        await loginPage.goto()
        await loginPage.userLogin(username,password)
        return true
    } catch (error) {
        console.error(`Error logging in as ${username}: ${error}`)
        return false
    }
}

export async function loginGeodesyAppAs(page: Page, username: any, password: any): Promise<void> {
    const loginPage = new CleansingLogin(page)
    await loginPage.goto()
    await loginPage.userLogin(username,password)
}