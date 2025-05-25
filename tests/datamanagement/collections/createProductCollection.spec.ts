import { expect, test } from "@playwright/test";
import ContentCollections from "../../../pages/datamanagement/contentCollections/contentCollectionPage";
import BulkUpdate from "../../../pages/datamanagement/bulkUpdatePage";
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig } from "../dataManagement.config";
import CreateRandomString from "../../../utils/createRandomString-util";

test.describe("Locations Collection - Product", { tag: '@dm_regression' }, () => {

    test.beforeEach("Given user successfully logs in", async ({ page }) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    });

    test(`Verify it is possible to create a Product Collection`, async ({ page }) => {
        const collectionsPage = new ContentCollections(page);
        const bulkUpdatePage = new BulkUpdate(page);
        //generate a random identifier
        const Identifier = await CreateRandomString.generateRandomString(8, 'alphanumeric');

        await test.step(`And user is on the collections page`, async () => {
            await collectionsPage.goTo()
        });
        await test.step(`When user selects the option to create a new Product collection`, async () => {
            const collectionType = "products"; 
            await collectionsPage.collectionTypeSelector(collectionType);
        });
        await test.step(`And user enters all the fields for the Products collection`, async () => {
            await collectionsPage.nameText.fill("Automated Products Collection Name");
            await collectionsPage.identifierText.fill("Automated Products Collection" + Identifier);
            await collectionsPage.descriptionText.fill("Automated Products Collection Description")
        });
        await test.step(`And user selects a location`, async () => {
            await collectionsPage.addLocationsButton.click()
            await bulkUpdatePage.enterLocationName("Data Management - Transaction");
            await bulkUpdatePage.selectLocationValue("Data Management - Transaction Links 1").click();
            await bulkUpdatePage.selectLocationValue("Data Management - Transaction Links 2").click();
            await bulkUpdatePage.clickSelectButton();
        });
        await test.step(`And user creates a new section`, async () => {
            await collectionsPage.addSectionButton.click()
            await collectionsPage.sectionTitle.fill("Automated Section Title");
            await collectionsPage.sectionDescription.fill("Automated Section Description");
            await collectionsPage.saveSectionButton.click()
        });
        await test.step(`And user adds a few items to the section`, async () => {
            await collectionsPage.expandSectionButton.click()
            await collectionsPage.addItemButton.click()
            await collectionsPage.itemToSelect.click()
            await collectionsPage.addItemsConfirm.click()
        });
        await test.step(`And user saves the changes`, async () => {
            await collectionsPage.saveCollectionButton.click()
        });
        await test.step(`Then changes are persistent`, async () => {
            // Wait for the collection to appear in the collection list
            await collectionsPage.recentlyCreatedCollection("Automated Products Collection"+ Identifier).waitFor({ state: 'visible' });
            // Assert that the collection name is visible
            await expect(collectionsPage.recentlyCreatedCollection("Automated Products Collection" + Identifier)).toBeVisible();
            // Click delete and confirm
            await collectionsPage.clickDeleteButton("Automated Products Collection"+ Identifier);
            await collectionsPage.confirmDeleteCollection.click()
        });
    });

    test.afterEach("Close browser", async ({ page }) => {
        await page.close();  // Close the browser after all tests are finished
    });
});
