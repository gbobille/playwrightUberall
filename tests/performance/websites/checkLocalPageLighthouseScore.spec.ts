// import { test } from "@playwright/test";
// import Utils from "../../../utils/utils";
// import { playAudit } from "playwright-lighthouse";

// test.describe("Performance test", async () => {
//     const utils = new Utils()
//     const records = await utils.readDataFromCSV('tests/testData/Lighthouseurls.csv')
    
//     records.forEach(record => {
//         test(`Check: ${record.name} lighthouse score for storefinder @performance`, async ({ playwright }) => {

//             const browser = await playwright['chromium'].launch({
//                 args: ['--remote-debugging-port=9222'],
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
//                         performance: 94,
//                         accessibility: 80,
//                         'best-practices': 80,
//                         seo: 80,
//                         pwa: 20,
//                     },
//                     config: lighthouseDesktopConfig,
//                     // config: lighthouseConfig,
//                     port: 9222,
//                     reports: {
//                         formats: {
//                             html: true, //defaults to false
//                         },
//                         name: `${record.name}-ligthouse-score${new Date().toISOString()}`, //defaults to `lighthouse-${new Date().getTime()}`
//                         directory: `${process.cwd()}/lighthouse`, //defaults to `${process.cwd()}/lighthouse`
//                     }
//                 });
//                 await page.close()
//                 await browser.close()
//             })
//         })
//     })
// })