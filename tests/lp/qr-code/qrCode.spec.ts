import { test } from "@playwright/test";
import QrCode from "../../../pages/lp/app/qrCode";
import { loginUberallAppAs } from "../../../utils/login-util";

test.describe("End to end test for QR Code", { tag: ['@lp_regression', '@qrcode'] }, () => {

    test(`Create QR Code as a Location Manager with a single location`, async ({ page }) => {
        const qrCodeGenerator = new QrCode(page)

        await test.step("Given user login to Uberall", async () => {
            await loginUberallAppAs(page, process.env.WEB_LOCATION_USERNAME, process.env.WEB_LOCATION_PASSWORD)
        })

        await test.step("When user navigates to QR Code page", async () => {
            await qrCodeGenerator.clickQrCodeButton("Location Hub").click({ timeout: 30000 })
            await qrCodeGenerator.clickQrCodeButton("QR code generator").click({ timeout: 30000 })
        })

        await test.step("And when user clicks Generate QR Code button and creates a single URL", async () => {
            await qrCodeGenerator.generateButton.click({ timeout: 30000 })
            await qrCodeGenerator.nextButton.click()
        })

        await test.step("And when user clicks Generate QR Code button", async () => {
            await qrCodeGenerator.ownUrl.fill("https://uberall.com")
            await qrCodeGenerator.nextButton.click()
        })

        await test.step("Then user verifies success message", async () => {
            await qrCodeGenerator.successMessage.first().click()
        })
    })

    test(`Create QR Code as an admin with multiple locations`, async ({ page }) => {
        const qrCodeGenerator = new QrCode(page)

        await test.step("Given user login to Uberall", async () => {
            await loginUberallAppAs(page, process.env.WEB_ADMIN_USERNAME2, process.env.WEB_ADMIN_PASSWORD2)
        })

        await test.step("When user navigates to QR Code page", async () => {
            await qrCodeGenerator.clickQrCodeButton("Location Hub").click({ timeout: 30000 })
            await qrCodeGenerator.clickQrCodeButton("QR code generator").click({ timeout: 30000 })        
        })

        await test.step("And when user clicks Generate QR Code button and select multiple locations", async () => {
            await qrCodeGenerator.generateButton.click({ timeout: 30000 })
            await qrCodeGenerator.useURLText.click()
            await qrCodeGenerator.nextButton.click()
            await qrCodeGenerator.clickEditLocations("Edit Locations").click()
            await qrCodeGenerator.searchLocation.click()
            await qrCodeGenerator.searchLocation.fill('Pulled Pork Paradise EV Parking')
            await qrCodeGenerator.clickLocationName("Pulled Pork Paradise EV Parking").click({ timeout: 30000 })
            await qrCodeGenerator.searchLocation.click()
            await qrCodeGenerator.searchLocation.press('Meta+a')
            await qrCodeGenerator.searchLocation.fill('PPP test sync')
            await qrCodeGenerator.clickLocationName("PPP test sync").click({ timeout: 30000 })
            await qrCodeGenerator.addButton.click()
            await qrCodeGenerator.dropdown.locator('svg').click()
            await qrCodeGenerator.qrCodeUrl.click()
        })

        await test.step("And when user clicks Generate QR Code button ", async () => {
            await qrCodeGenerator.nextButton.click()
        })

        await test.step("Then user verifies success message", async () => {
            await qrCodeGenerator.successMessage.first().click()
        })
    })
})