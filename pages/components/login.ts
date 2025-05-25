import { Locator, Page } from "@playwright/test"
import DashboardPage from "../base/dashboardPage";
import HomePage from "../innovation/homepage/homepage";
import LocationOnboardingPage from "../base/onboardingPage";

export default class Login {
    static readonly url: string = process.env.LOGIN_URL || '/login'
    readonly page: Page
    readonly emailTextField: Locator
    readonly passwordTextField: Locator
    readonly loginBtn: Locator
    readonly errorMessage: Locator

    constructor(page: Page) {
        this.page = page
        this.emailTextField = this.page.getByPlaceholder('Email')
        this.passwordTextField = this.page.getByPlaceholder('Password')
        this.loginBtn = this.page.getByRole('button', {name: 'LOGIN'})
        this.errorMessage = this.page.locator('div[class="auth-failure-message alert alert-error"]')
    }

    async goto() {
        await this.page.goto(Login.url, {waitUntil: "domcontentloaded"})
        await this.isAt();
    }

    async isAt(): Promise<boolean> {
        return await this.emailTextField.isVisible()
    }

    // log in with default authentication pass
    // to use a different password in your test case, pass it as an argument
    async userLogin(email: string, password: string = process.env.AUTHENTICATION_PASS as string) {
        await this.fillLoginForm(email, password)
        await this.page.waitForURL(url => !url.toString().includes('/login'));
        await this.confirmLandingPage();
    }

    async loginSkipLandingValidation(email: string, password: string = process.env.AUTHENTICATION_PASS as string) {
        await this.goto()
        await this.fillLoginForm(email, password)
        await this.page.waitForURL(url => !url.toString().includes('/login'), {waitUntil: 'commit'});
    }

    // log in with the option to fail
    async attemptLogin(email: string, password: string = process.env.AUTHENTICATION_PASS as string) {
        await this.fillLoginForm(email, password)
        await Promise.race([
            this.page.waitForURL(url => !url.toString().includes('/login')),
            this.errorMessage.waitFor({state: 'visible', timeout: 10000})
        ])
    }

    private async fillLoginForm(email: string, password: string): Promise<void> {
        await this.emailTextField.fill(email)
        await this.page.waitForLoadState('domcontentloaded')
        await this.passwordTextField.fill(password)
        await this.page.waitForLoadState('domcontentloaded')
        await this.loginBtn.click()
    }

    /** the three possible Landing Pages after a default login are
     * 1. Dashboard Page
     * 2. Home Page
     * 3. Location Onboarding Page
     */
     async confirmLandingPage(): Promise<DashboardPage | HomePage | LocationOnboardingPage | undefined> {
        await this.page.waitForURL(url => !url.toString().includes('/login') && !url.toString().endsWith('/uberall'))
        try {
            await this.page.waitForNavigation({ timeout: 5000 });
        } catch (e) {
            console.log('>> Navigation Stuck after login, continuing... Test');
        }        await this.page.waitForURL(url =>
            url.toString().includes('/dashboard') ||
            url.toString().includes('/home') ||
            url.toString().includes('/onboarding')
        );
        const url = this.page.url();

        switch (true) {

            case url.endsWith('/home'):
                console.log('>> Browser landed on Home Page after login');
                const homePage = new HomePage(this.page);
                await homePage.isAt();
                return homePage;

            case url.includes('/dashboard'):
                console.log('>> Browser landed on Dashboard Page after login');
                const dashboardPage = new DashboardPage(this.page);
                await dashboardPage.isAt();
                return dashboardPage;

            case url.includes('/onboarding'):
                console.log('>> Browser landed on Onboarding Page after login');
                const onboardingPage = new LocationOnboardingPage(this.page);
                await onboardingPage.isAt();
                return onboardingPage;

            default:
                console.log(`>> Browser landed on ${url} Page after login`);
                return undefined
        }
    }
}
