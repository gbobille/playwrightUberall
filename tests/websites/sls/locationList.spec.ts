import { test, expect } from "@playwright/test";
import StoreLocatorPage from "../../../pages/websites/storeLocator";

test.describe('SLS - Penningtons: Header, Footer, and Location List Sanity', { tag: ['@sls', '@webregression', '@prodregression'] }, () => {
    let storeLocator: StoreLocatorPage;

    const baseUrl = "https://locations.penningtons.com";
    const storeBaseUrl = "https://www.penningtons.com/en";

    test.beforeEach(async ({ page }) => {
        storeLocator = new StoreLocatorPage(page);
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await storeLocator.cookiesBtn.click();
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
    });

    test(`Verify the store locator loads successfully and checks the header and footer`, async ({ page }) => {
        const headerLogo = page.getByRole('link', { name: 'Penningtons Sizes 14 to' });
        const termsAndConditions = storeLocator.termsAndConditions(storeBaseUrl);
        const privacyPolicy = storeLocator.privacyPolicy(storeBaseUrl);

        await test.step("Then the logo in the header should be visible", async () => {
            await expect(headerLogo).toBeVisible({ timeout: 5000 });
        });

        await test.step("And the header menu list should be visible", async () => {
            await expect(storeLocator.menuCategoryList).toBeVisible();
        });

        await test.step("And wait for the location list widget to load", async () => {
            await storeLocator.locationListID.waitFor({ state: 'visible' });
        });

        await test.step("And the footer should display Terms & Conditions and Privacy policy texts", async () => {
            await expect(termsAndConditions).toBeVisible();
            await expect(privacyPolicy).toBeVisible();
        });
    });

    test(`Verify the location list elements are visible`, async ({ page }) => {
        await test.step("When user accepts the cookies", async () => {
            await storeLocator.popupCloseButton.click();
            await page.getByText(/© \d{4} Reitmans \(Canada\)/).click();
        });

        await test.step("Then the first item in the location list should display the store name 'Penningtons'", async () => {
            await expect(storeLocator.locationName).toHaveText('Penningtons');
        });

        await test.step(`And the first item in the location list should display the address`, async () => {
            const locationAddress = storeLocator.locationAddress('7302 Market Crossing, Unit 1');
            await expect(locationAddress).toBeVisible();
        });

        await test.step("And the first item in the location list should display the location status details", async () => {
            await expect(storeLocator.firstLocationStatusIcon).toBeVisible();
            await expect(storeLocator.firstLocationClosedNowMessage).toBeVisible();

            const statusMessage = await storeLocator.firstLocationClosedNowMessage.textContent();
            expect(statusMessage?.trim().startsWith('Closed') || statusMessage?.trim().startsWith('Open')).toBe(true);
        });
    });

    test(`Verify the location name is clickable`, async ({ page }) => {
        const expectedHref = 'https://locations.penningtons.com/bc-burnaby-5350';

        await test.step("Then the first location name should have the correct href and be clickable", async () => {
            await expect(storeLocator.locationName).toHaveAttribute('href', expectedHref);
            await storeLocator.locationName.click();
            await expect(page).toHaveURL(expectedHref);
        });
    });

    test(`Verify the phone icon is clickable`, async () => {
        await test.step("Then the phone icon should be clickable", async () => {
            await expect(storeLocator.phoneIcon).toHaveAttribute('href', 'tel:+1 604-435-2214');
            await storeLocator.phoneIcon.click();
        });
    });

    test(`Verify the directions icon is clickable`, async ({ page }) => {
        await test.step("Then the directions icon should be clickable", async () => {
            const [newTab] = await Promise.all([
                page.context().waitForEvent('page'),
                storeLocator.directionsIcon.click(),
            ]);

            await newTab.waitForLoadState('domcontentloaded');
            await expect(newTab).toHaveURL(/google\.com\/maps/);
            await expect(newTab).toHaveTitle(/Google Maps/i);
        });
    });
});