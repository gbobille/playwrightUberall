// import { test } from "@playwright/test";
// import { playAudit } from "playwright-lighthouse";
// import Utils from "../../../utils/utils";

// test.describe("Performance test", async () => {
//     const utils = new Utils()
//     const records = await utils.readDataFromCSV('tests/testData/Lighthouseurls.csv')
    
//     records.forEach(record => {
//         test(`Check: ${record.name} lighthouse score for storefinder mobile @performancemobile`, async ({ playwright }) => {

//             const browser = await playwright['chromium'].launch({
//                 args: ['--remote-debugging-port=9222'
//                 //,'--test-type=browser', '--no-sandbox','--force-fieldtrials=*BackgroundTracing/default/'
//             ],
//             });
    
//             const page = await browser.newPage();
        
//             await test.step("Given user open storefinder", async () => {
//                 await page.goto(`${record.URL}`)
//                 await page.waitForLoadState("networkidle")
//                 await page.waitForLoadState("domcontentloaded")
//             })
    
//             await test.step("Then lighthouse score will pass thresholds", async () => {
//                 await playAudit({
//                     page: page,
//                     thresholds: {
//                         performance: 85,
//                         accessibility: 80,
//                         'best-practices': 80,
//                         seo: 80,
//                         pwa: 20,
//                     },
//                     port: 9222,
//                     reports: {
//                         formats: {
//                             html: true, //defaults to false
//                         },
//                         name: `${record.name}-mobile-ligthouse-score${new Date().toISOString()}`, //defaults to `lighthouse-${new Date().getTime()}`
//                         directory: `${process.cwd()}/lighthouse`, //defaults to `${process.cwd()}/lighthouse`
//                     }
//                 });
//                 await page.close()
//                 await browser.close()
//             })
//         })
//     })
// })