import fs from 'fs';
import { parse } from 'csv-parse/sync';
import AxeBuilder from '@axe-core/playwright';
import { BrowserContext, Locator, Page, TestInfo, expect } from '@playwright/test';
import { AxeResults } from 'axe-core';
import * as Handlebars from 'handlebars';

export default class Utils {

    async readDataFromCSV(path: string) {
        const records = parse(fs.readFileSync(path), {
            columns: true,
            skip_empty_lines: true
        });

        return records
    }

    /**
    * Utility to generate a random name
    */
    generateRandomName(): string {
        return `test-${Math.random().toString(36).substring(2, 8)}`;
    }

    async accessibilityScanRefined(page: Page) {
        const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a']).analyze();
        const violations = accessibilityScanResults.violations.map((violation) => ({
            description: violation.description,
            nodes: violation.nodes.map((node) => ({
                html: node.html,
                impact: node.impact,
                help: violation.help,
                helpUrl: violation.helpUrl,
            })),
        }))
        return violations
    }

    async accessibilityScanner(page: Page) {
        await page.waitForLoadState('networkidle');
        const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a']).analyze();
        return accessibilityScanResults
    }

    /**
     * TO BE CHECKED
     * This method will read the violations and map it to a json object then write this object to a json file
     * Note: the object were parsed before but not displayed in the console or the report because of the size of the object yet on josn it`s displayed
     * @param results is the results object from scanning 
     * @param customer is the customer name from the file in which we are reading customer urls
     */
    async violationsScanner(results: AxeResults, testName: TestInfo) {
        const violations = await results.violations.map((violation) => {
            return {
                description: violation.description,
                nodes: violation.nodes.map((node) => ({
                    html: node.html,
                    impact: node.impact,
                    help: violation.help,
                    helpUrl: violation.helpUrl,
                })),
            }
        })

        const numViolations = violations.length;
        const date = new Date();
        const currentTime = date.toLocaleString()

        const reportObject = {
            currentTime,
            numViolations,
            violations
        }

        const fileName = `violationsReport/${testName}-violations.json`;
        const data = JSON.stringify(reportObject, null, 2);
        fs.writeFileSync(fileName, data, { flag: 'w' });

        console.log(`Violations data saved to ${fileName}`)

        const reportTemplate = Handlebars.compile(`
    <html>
      <head>
        <title>Test Report</title>
      </head>
      <body>
        <h1>Test Report</h1>
        <p>Execution time: {{currentTime}} </p>
        <p>Test results: {{accessibilityTestResults}} </p>
        <ul>
          {{#each results}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
        <h2>Violations data</h2>
        <pre>{{violations}}</pre>
      </body>
    </html>
  `);
        let accessibilityTestResults: string
        if (numViolations <= 0) {
            accessibilityTestResults = 'Pass'
        } else {
            accessibilityTestResults = 'Fail'
        }

        const reportData = {
            currentTime,
            accessibilityTestResults,
            violations: data,
        };
        const reportHtml = reportTemplate(reportData)
        fs.writeFileSync(`test-results/${testName}-violations-test-report.html`, reportHtml, { flag: 'w' })
        return violations
    }

    async validateScreenShot(context: BrowserContext, url: string, element: string) {
        const page2 = await context.newPage()
        await page2.goto(url, { waitUntil: 'networkidle' })
        await expect(page2).toHaveScreenshot({
            fullPage: true,
            mask: [page2.locator(`${element}`), page2.locator('.ubsf_details-open-now.ubsf_open'), page2.locator('.ubsf_similar-locations-list')]
        })
        await page2.close()
    }

    async dragAndDrop(
        page: Page,
        dragLocator: Locator,
        dropLocator: Locator,
        targetPosition?: { x: number; y: number }
    ) {
        const dragBoundingBox = await dragLocator.boundingBox();
        const dropBoundingBox = await dropLocator.boundingBox();

        // moving the mouse to the center of the drag HTML element
        await page.mouse.move(dragBoundingBox.x + dragBoundingBox.width / 2, dragBoundingBox.y + dragBoundingBox.height / 2);

        // activating the drag action
        await page.mouse.down();

        // if targetPosition is undefined, defining the center of the
        // drop HTML element as the target position
        const targetX = targetPosition?.x || dropBoundingBox.x + dropBoundingBox.width / 2;
        const targetY = targetPosition?.y || dropBoundingBox.y + dropBoundingBox.height / 2;

        // moving the mouse to the (targetX, targetY) coordinates of the
        // drop element
        await page.mouse.move(targetX, targetY);

        // releasing the mouse and terminating the drop option
        await page.mouse.up();
    }
}