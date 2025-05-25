import { test } from '../../setup'
import Login from "../../../pages/components/login"
import RevenueWidget from '../../../pages/innovation/homepage/revenueWidget'
import { expect } from 'playwright/test'


test.describe('Revenue Widget', () => {

    test('Verify that Revenue widget is displayed correctly when Admin user has custom config', { tag: '@revenuewidget' }, async ({ page }) => {
        const login = new Login(page)
        const revenueWidget = new RevenueWidget(page)

        await test.step('Given an admin user logins our platform', async () => {
            await login.goto()
            await login.userLogin(process.env.QA_INNOVATION_USER_ADMIN, process.env.QA_P)
        })

        await test.step('When User navigates to Homepage', async () => {
            await page.waitForURL(url => url.toString().includes('/home'))
        })

        await test.step('Then Revenue Estimator widget will be displayed in the right format', async () => {
            await expect(revenueWidget.revenueWidget).toHaveScreenshot({ mask: [revenueWidget.revenueWidgetScore, revenueWidget.revenueWidgetFooter] })
            await expect(revenueWidget.revenueWidgetTitle).toHaveText('Revenue EstimatorBeta')
            await expect(revenueWidget.revenueWidgetDescription).toHaveText('Every click counts! Uncover how your digital traffic translates into revenue.')
            await expect(revenueWidget.revenueWidgetScore).toHaveText('€37.80%')
            await expect(revenueWidget.revenueWidgetEditCalculationsButton).toBeVisible()
            await revenueWidget.revenueWidgetTooltip.click()
            await expect(revenueWidget.revenueWidgetTooltipText).toHaveText('An estimate of past earnings based on interactions and conversion rates.')
        })
    })

    test('Verify that Revenue widget is displayed correctly when Business manager has custom config', { tag: '@revenuewidget' }, async ({ page }) => {
        const login = new Login(page)
        const revenueWidget = new RevenueWidget(page)

        await test.step('Given a Business manager user logins our platform', async () => {
            await login.goto()
            await login.userLogin(process.env.QA_INNOVATION_USER_BUSINESSM, process.env.QA_P)
        })

        await test.step('When User navigates to Homepage', async () => {
             await page.waitForURL(url => url.toString().includes('/home'))
        })

        await test.step('Then Revenue Estimator widget will be displayed in the right format', async () => {
            await expect(revenueWidget.revenueWidget).toHaveScreenshot({ mask: [revenueWidget.revenueWidgetScore, revenueWidget.revenueWidgetFooter] })
            await expect(revenueWidget.revenueWidgetTitle).toHaveText('Revenue EstimatorBeta')
            await expect(revenueWidget.revenueWidgetDescription).toHaveText('Every click counts! Uncover how your digital traffic translates into revenue.')
            await expect(revenueWidget.revenueWidgetScore).toHaveText('€37.80%')
            await revenueWidget.revenueWidgetTooltip.click()
            await expect(revenueWidget.revenueWidgetTooltipText).toHaveText('An estimate of past earnings based on interactions and conversion rates.')
        })
    })
})