import { expect, test } from "@playwright/test";
import ContentItems from "../../../pages/datamanagement/contentCollections/contentItemsPage";
import { loginUberallAppAs } from "../../../utils/login-util";
import uploadFileUtil from "../../../utils/upload-file-utils"
import { dataManagementConfig } from "../dataManagement.config";

test.describe("Create Product Item", { tag: '@dm_regression'}, () => {

    //to be improved in the future - for ALL DM TESTS at least make a generic log in method that can be called once
    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    });

    test(`Verify it is possible to create a Product Item @Production`, async ({ page }) => {
        const itemsPage = new ContentItems(page);

        await test.step(`And user is on the collections page`, async () => {
            await itemsPage.goTo()
        });

        await test.step(`And user navigates to products tab`, async () => {
            await itemsPage.productsTab.click()
        });

        await test.step(`When user clicks on Create Item button`, async () => {
            await itemsPage.createItemButton.click()
        });

        await test.step(`And user enters all the fields for the new product item`, async () => {
            await itemsPage.identifierText.fill("Automated Product Item Identifier")
            await itemsPage.nameText.fill("Automated Product Item Name")
            await itemsPage.descriptionText.fill("Automated Product Item Description")
            await itemsPage.urlText.fill("https://www.uberall.com")
            await itemsPage.videoUrlText.fill("https://www.youtube.com/watch?v=EngW7tLk6R8")
            await itemsPage.priceText.fill("100")
            await itemsPage.selectCurrency()
            await itemsPage.addImage()
            await uploadFileUtil.uploadFile(page, 'input[type="file"]', 'images', 'apple-landscape.jpeg')
            await itemsPage.uploadButton.click();
        });


        await test.step(`And user saves the changes`, async () => {
            await itemsPage.saveItemButton.click()
        });

        await test.step(`Then changes are persistent`, async () => {
            await expect(itemsPage.recentlyCreatedItem("Automated Product Item Identifier")).toBeVisible();
            await itemsPage.clickDeleteButton("Automated Product Item Identifier");
            await itemsPage.confirmDeleteItem.click()
        });
    });

    test.afterEach("Close browser", async ({ page }) => {
        await page.close();  // Close the browser after all tests are finished
    });
});