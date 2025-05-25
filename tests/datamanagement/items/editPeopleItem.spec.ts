import { expect, test } from "@playwright/test";
import ContentItems from "../../../pages/datamanagement/contentCollections/contentItemsPage";
import { loginUberallAppAs } from "../../../utils/login-util";
import uploadFileUtil from "../../../utils/upload-file-utils"
import { dataManagementConfig } from "../dataManagement.config";

test.describe("Create People Item", { tag: '@dm_regression'}, () => {

    //to be improved in the future - for ALL DM TESTS at least make a generic log in method that can be called once
    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    });

    test(`Verify it is possible to create a People Item @Production`, async ({ page }) => {
        const itemsPage = new ContentItems(page);

        await test.step(`And user is on the collections page`, async () => {
            await itemsPage.goTo()
        });

        await test.step(`And user navigates to people tab`, async () => {
            await itemsPage.peopleTab.click()
        });

        await test.step(`When user clicks on Create Item button`, async () => {
            await itemsPage.createItemButton.click()
        });

        await test.step(`And user enters all the fields for the new people item`, async () => {
            await itemsPage.identifierText.fill("Automated People Item Identifier")
            await itemsPage.peoplenameText.fill("Automated People Item Name")
            await itemsPage.descriptionText.fill("Automated People Item Description")
            await itemsPage.urlText.fill("https://www.uberall.com")
            await itemsPage.titleText.fill("Automated People Item Title")
            await itemsPage.addImage()
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'apple-landscape.jpeg')
            await itemsPage.uploadButton.click()
        });

        await test.step(`And user saves the changes`, async () => {
            await itemsPage.saveItemButton.click()
        });

        await test.step(`Then user updates the new people item`, async () => {
            await expect(itemsPage.recentlyCreatedItem("Automated People Item Identifier")).toBeVisible();
            await itemsPage.clickEditButton("Automated People Item Identifier");
        });

        await test.step(`And user edit all the fields for the new people item`, async () => {
            await itemsPage.identifierText.fill("Edited People Item Identifier")
            await itemsPage.peoplenameText.fill("Edited People Item Name")
            await itemsPage.descriptionText.fill("Edited People Item Description")
            await itemsPage.urlText.fill("https://www.uberall.com")
            await itemsPage.titleText.fill("Edited People Item Title")
            await itemsPage.clickDeleteImage()
            await itemsPage.addImage()
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'AppleMapsSocialPost.jpeg')
            await itemsPage.uploadButton.click()
        });

        await test.step(`And user updates the changes`, async () => {
            await itemsPage.updateItemButton.click()
        });

        await test.step(`Then changes are persistent`, async () => {
            await expect(itemsPage.recentlyCreatedItem("Edited People Item Identifier")).toBeVisible();
            await itemsPage.clickDeleteButton("Edited People Item Identifier");
            await itemsPage.confirmDeleteItem.click();
        });
    });

    test.afterEach("Close browser", async ({ page }) => {
        await page.close();  // Close the browser after all tests are finished
    });
});