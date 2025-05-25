import { test } from '../../setup'
import Login from "../../../pages/components/login"
import RevenueWidget from '../../../pages/innovation/homepage/revenueWidget'
import RevenueEstimatorPanel from '../../../pages/innovation/homepage/revenueEstimatorPanel'
import { expect } from 'playwright/test'

let login: Login
let revenueWidget: RevenueWidget
let editCalculationsPanel: RevenueEstimatorPanel
let  currentCurrency: any , newCurrency: any, adjustmentCurrency: any

test.beforeEach(async ({page}) => {
    login = new Login(page)
    revenueWidget = new RevenueWidget(page)
    editCalculationsPanel = new RevenueEstimatorPanel(page)
})

test.describe('Revenue Widget', () => {

    test('Verify that as a admin user I can edit currency of Revenue Estimator.', { tag: '@revenuewidget' }, async ({ page }) => {

        await test.step('Given an admin user logins our platform', async () => {
            await login.goto()
            await login.userLogin(process.env.QA_INNOVATION_USER_ADMIN, process.env.QA_P)
        })

        await test.step('When User navigates to Homepage', async () => {
            await page.waitForURL(url => url.toString().includes('/home'))
        })

        await test.step('Then Revenue Estimator widget will be displayed in the right format', async () => {
            await expect(revenueWidget.revenueWidgetEditCalculationsButton).toBeVisible()
            currentCurrency = await revenueWidget.revenueWidgetScoreAmountCurrency.textContent()
        })

        await test.step('Then I click the Edit Calculations link', async () => {
            await revenueWidget.revenueWidgetEditCalculationsButton.click()
        })

        await test.step('Then the Calculation Panel should displayed', async () => {
            await expect(editCalculationsPanel.revenueEstimatorPanel).toBeVisible()
            await expect(editCalculationsPanel.refineYourCalculationBtn).toBeVisible()
        })

        await test.step('Then I can adjust the Currency', async () => {
            await editCalculationsPanel.clickOnCountryCurrency('USD')
            await expect(editCalculationsPanel.countryCode).toHaveText('USD')
        })

        await test.step('And Click the Refine Your Calculation button ', async () => {
            await editCalculationsPanel.refineYourCalculationBtn.click()
            await expect(editCalculationsPanel.revenueEstimatorPanel).not.toBeVisible()
            newCurrency = await revenueWidget.revenueWidgetScoreAmountCurrency.textContent()
            expect(newCurrency.replace(/[0-9]/g, '') != currentCurrency.replace(/[0-9]/g, '')).toBeTruthy()
        })
    })

    test('Verify that as a admin user I can edit Average Purchase and Time Period of Revenue Estimator.', { tag: '@revenuewidget' }, async ({ page }) => {

        await test.step('Given an admin user logins our platform', async () => {
            await login.goto()
            await login.userLogin(process.env.QA_INNOVATION_USER_ADMIN, process.env.QA_P)
        })

        await test.step('When User navigates to Homepage', async () => {
            await page.waitForURL(url => url.toString().includes('/home'))
        })

        await test.step('Then Revenue Estimator widget will be displayed in the right format', async () => {
            await expect(revenueWidget.revenueWidgetEditCalculationsButton).toBeVisible()
            currentCurrency = await revenueWidget.revenueWidgetScoreAmountCurrency.textContent()
        })

        await test.step('Then I can edit the Average Purchase and Time Period', async () => {
            await revenueWidget.revenueWidgetEditCalculationsButton.click()
            await editCalculationsPanel.averagePurchaseTextField.fill("10")
            await editCalculationsPanel.pastMonthTimePeriodBtn.click()
            await editCalculationsPanel.refineYourCalculationBtn.click()
            await expect(editCalculationsPanel.revenueEstimatorPanel).not.toBeVisible()
            adjustmentCurrency = await revenueWidget.revenueWidgetScoreAmountCurrency.textContent()
            expect(currentCurrency.substring(1).trim() != adjustmentCurrency.substring(1).trim()).toBeTruthy()
            await expect(editCalculationsPanel.timeRangeLabel).toHaveText('Past Month')
            await revenueWidget.revenueWidgetEditCalculationsButton.click()
            await editCalculationsPanel.averagePurchaseTextField.fill("10")
            await editCalculationsPanel.pastYearTimePeriodBtn.click()
            await editCalculationsPanel.refineYourCalculationBtn.click()
            await expect(editCalculationsPanel.revenueEstimatorPanel).not.toBeVisible()
            await expect(editCalculationsPanel.timeRangeLabel).toHaveText('Past Year')
        })
    })

    test.afterAll(async () => {
        await test.step(`Restore to the default value`, async () => {
            await revenueWidget.revenueWidgetEditCalculationsButton.click()
            await expect(editCalculationsPanel.revenueEstimatorPanel).toBeVisible()
            await expect(editCalculationsPanel.refineYourCalculationBtn).toBeVisible()
            await editCalculationsPanel.clickOnCountryCurrency()
            await expect(editCalculationsPanel.countryCode).toHaveText('EUR')
            await editCalculationsPanel.averagePurchaseTextField.fill("7")
            await editCalculationsPanel.pastQuarterTimePeriodBtn.click()
            await editCalculationsPanel.refineYourCalculationBtn.click()
            await expect(editCalculationsPanel.revenueEstimatorPanel).not.toBeVisible()
        })
    })
})