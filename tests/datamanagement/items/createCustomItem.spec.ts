import { expect, test } from "@playwright/test";
import ContentItems from "../../../pages/datamanagement/contentCollections/contentItemsPage";
import { loginUberallAppAs } from "../../../utils/login-util";
import uploadFileUtil from "../../../utils/upload-file-utils"
import { dataManagementConfig } from "../dataManagement.config";

test.describe("Create Custom Item", { tag: '@dm_regression'}, () => {

    //to be improved in the future - for ALL DM TESTS at least make a generic log in method that can be called once
    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    });

    test(`Verify it is possible to create a Custom Item @Production`, async ({ page }) => {
        const itemsPage = new ContentItems(page);

        await test.step(`And user is on the collections page`, async () => {
            await itemsPage.goTo()
        });

        await test.step(`And user navigates to custom tab`, async () => {
            await itemsPage.customTab.click()
        });

        await test.step(`When user clicks on Create Item button`, async () => {
            await itemsPage.createItemButton.click()
        });

        await test.step(`And user enters all the fields for the new custom item`, async () => {
            await itemsPage.identifierText.fill("Automated Custom Item Identifier")
            await itemsPage.nameText.fill("Automated Custom Item Name")
            await itemsPage.descriptionText.fill("Automated Custom Item Description")
            await itemsPage.urlText.fill("https://www.uberall.com")
            await itemsPage.videoUrlText.fill("https://www.youtube.com/watch?v=EngW7tLk6R8")
            await itemsPage.addImage()
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'apple-landscape.jpeg')
            await itemsPage.uploadButton.click();
        });


        await test.step(`And user saves the changes`, async () => {
            await itemsPage.saveItemButton.click()
        });

        await test.step(`Then changes are persistent`, async () => {
            await expect(itemsPage.recentlyCreatedItem("Automated Custom Item Identifier")).toBeVisible();
            await itemsPage.clickDeleteButton("Automated Custom Item Identifier");
            await itemsPage.confirmDeleteItem.click()
        });
    });

    test.afterEach("Close browser", async ({ page }) => {
        await page.close();  // Close the browser after all tests are finished
    });
});