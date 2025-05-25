// import { chromium, FullConfig } from "@playwright/test";
// import HomePage from "../../pages/websites/dashboard";
// import LoginPage from "../../pages/websites/loginPage";
// import { testConfig } from "../../testconfig.config";

// async function globalSetup(config: FullConfig) {
//     //Launch browser
//     const browser = await chromium.launch();
//     const page = await browser.newPage()

//     //Login
//     const loginPage = new LoginPage(page)
//     await page.goto(`${testConfig.prodSelfServices}`)
//     await loginPage.logIn(`${testConfig.username}`, `${testConfig.password}`)
//     const homePage = new HomePage(page)
//     await homePage.validateHomePageIsOpen()

//     //Store loggedin state and close browser
//     await page.context().storageState({ path: 'utils/auth/loggedInState.json' });
//     await browser.close();
// }

// export default globalSetup;