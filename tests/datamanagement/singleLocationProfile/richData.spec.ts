import { expect, test } from "@playwright/test";
import { dataManagementConfig }  from "../dataManagement.config";
import RichData from "../../../pages/datamanagement/singleLocationProfile/richDataPage";
import SaveChangesBar from "../../../pages/datamanagement/saveChanges";
import BulkUpdate from "../../../pages/datamanagement/bulkUpdatePage";
import BaseCall from "../../../api/uberall/baseCall";
import { loginUberallAppAs } from "../../../utils/login-util";

//LODGING FIELDS
test.describe("Locations Rich Data - Lodging Fields", { tag: '@dm_regression' }, () => {

    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    })

    test(`Verify it is possible to set lodging fields a location`, async ({ page }) => {
        const richDataPage = new RichData (page)
        const saveChangesBarPage = new SaveChangesBar (page)

        await test.step(`And user is on the location rich data page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_GOOGLE_LODGING}/rich-data`, { waitUntil: 'domcontentloaded' });
        })

        await test.step(`When user selects one amenity from the list`, async() => {
            await richDataPage.clickLodgingFields()
            await richDataPage.selectAmenity('Game Room')
        })

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.clickSaveButton()
        })

        await test.step(`Then user validates the changes are persistent`, async() => {
            await richDataPage.validateAmenities()
        })
     })

     test.afterEach(async ({}) => {
        const apiUtils = new BaseCall()
        const userToken = await apiUtils.getAccessToken(dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/x-www-form-urlencoded', "")
    
        //Construct Locations Body
        let requestBodyJSON = {
            "lodgingFields":[]
        }
        const requestBody = JSON.stringify(requestBodyJSON)
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
        await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_GOOGLE_LODGING}?access_token=${userToken}`, requestBody)
    })
})

//TRANSACTION LINKS
test.describe("Locations Rich Data - Edition - Transaction Links", { tag: '@dm_regression' }, () => {
    
    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    });

    test(`Verify it is possible to set transaction links to a location`, async ({ page }) => {
        const richDataPage = new RichData (page);
        const saveChangesBarPage = new SaveChangesBar (page);

        await test.step(`And user is on the location rich data page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_TRANSACTION_LINKS}/rich-data`, { waitUntil: 'domcontentloaded' });
        });

        await test.step(`When user enters 1 transaction link per type`, async () => {
            await richDataPage.addTransactionLink('DINING_RESERVATION','https://www.dining.com/123&345?890');
            await richDataPage.addTransactionLink('FOOD_DELIVERY','https://www.food-delivery.com/123&345?890');
            await richDataPage.addTransactionLink('FOOD_ORDERING','https://www.food-ordering.com/123&345?890');
            await richDataPage.addTransactionLink('FOOD_TAKEOUT','https://www.food-takeout.com/123&345?890');
        });

        await test.step(`And user saves the changes`, async () => {
            await saveChangesBarPage.clickSaveButton()
        });

        await test.step(`Then changes are persistent`, async () => {
            await expect(saveChangesBarPage.saveButton).not.toBeVisible();
            await richDataPage.validateTransactionLink('DINING_RESERVATION','https://www.dining.com/123&345?890');
            await richDataPage.validateTransactionLink('FOOD_DELIVERY','https://www.food-delivery.com/123&345?890');
            await richDataPage.validateTransactionLink('FOOD_ORDERING','https://www.food-ordering.com/123&345?890');
            await richDataPage.validateTransactionLink('FOOD_TAKEOUT','https://www.food-takeout.com/123&345?890');
        });
    });

    test(`Verify it is possible to see only commong TLs when choosing several locations for bulk update`, async ({page}) => {
        const richDataPage = new RichData (page);
        const saveChangesBarPage = new SaveChangesBar (page);
        const bulkUpdatePage = new BulkUpdate (page);

        await test.step(`And user is on the bulk update data page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/bulk-update`, { waitUntil: 'domcontentloaded' });
        });

        await test.step(`When user clicks the option to open the bulk update modal`, async () => {
            await bulkUpdatePage.addLocationBtn.click();
        });

        await test.step(`And user searches for two locations`, async () => {
            await bulkUpdatePage.enterLocationName("Data Management - Transaction")
        });

        await test.step(`And user selects the location retrieved`, async () => {
            await bulkUpdatePage.selectLocationValue("Data Management - Transaction Links 1").click();
            await bulkUpdatePage.selectLocationValue("Data Management - Transaction Links 2").click();
        });

        await test.step(`And user selects the option to move forward`, async () => {
            await bulkUpdatePage.clickSelectButton();
        });

        await test.step(`And user clicks the button Next`, async () => {
            await saveChangesBarPage.clickNextButton();
        }); 

        await test.step(`And user is on the rich data tab of the bulk update modal`, async () => {
            await bulkUpdatePage.clickRichDataTab();
        });

        await test.step(`And user enters 1 transaction link per type`, async () => {
            await richDataPage.addTransactionLink('DINING_RESERVATION','https://dining.com');
            await richDataPage.addTransactionLink('FOOD_DELIVERY','https://food-delivery.com');
            await richDataPage.addTransactionLink('FOOD_ORDERING','https://food-ordering.com');
            await richDataPage.addTransactionLink('FOOD_TAKEOUT','https://food-takeout.com');
        });

        await test.step(`And user clicks the button Next`, async () => {
            await saveChangesBarPage.clickNextButton();
        });

        await test.step(`Then user validates the changes in the confirmation page`, async () => {
            await bulkUpdatePage.validateChanges("Food Takeout: https://food-takeout.com, Food Ordering: https://food-ordering.com, Food Delivery: https://food-delivery.com, Dining Reservation: https://dining.com")
        });
    });

    test.afterEach(async ({}) => {
        const apiUtils = new BaseCall()
        const userToken = await apiUtils.getAccessToken(dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/x-www-form-urlencoded', "")
    
        //Construct Locations Body
        let requestBodyJSON = {
            "transactionLinks":[],
            "services":[]
        }
        const requestBody = JSON.stringify(requestBodyJSON)
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
        await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_TRANSACTION_LINKS}?access_token=${userToken}`, requestBody)
        await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_SERVICES}?access_token=${userToken}`, requestBody)
    });
});

//SERVICES
test.describe("Locations Rich Data - Edition - Services", { tag: '@dm_regression, @Production' }, () => {
    test.beforeEach("Given user successfully logs in", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    });

    test(`Verify it is possible to set google service items`, async({page}) => {
        const richDataPage = new RichData (page);
        const saveChangesBarPage = new SaveChangesBar (page);

        await test.step(`And user is on the location rich data page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_SERVICES}/rich-data`, { waitUntil: 'domcontentloaded' });
        });

        await test.step(`When user clicks the combobox`, async() => {
            await richDataPage.servicesBoxClick();
        });

        await test.step(`And user selects the service option`, async() => {
            await richDataPage.selectService('roof_repair')
        });

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.clickSaveButton()
        });

        await test.step(`Then the changes are persistent`, async() => {
            await richDataPage.validateSelectedService('roof_repair')
        });

    });

    test(`Verify it is possible to set free form service items`, async({page}) => {
        const richDataPage = new RichData (page);
        const saveChangesBarPage = new SaveChangesBar (page);

        await test.step(`And user is on the location rich data page`, async () => {
            await page.goto(`${process.env.BASE_URL}/en/app/uberall/locationEdit/${dataManagementConfig.DM_LOCATION_SERVICES}/rich-data`, { waitUntil: 'domcontentloaded' });
        });

        await test.step(`When user clicks the combobox`, async() => {
            await richDataPage.servicesBoxClick();
        });

       await test.step(`And user adds the new free form service`, async() => {
            await richDataPage.createFreeFormService('New free form service')
       });

        await test.step(`And user saves the changes`, async() => {
            await saveChangesBarPage.clickSaveButton()
        });

        await test.step(`Then the changes are persistent`, async() => {
            await richDataPage.validateSelectedService('New free form service')
        });
    });

    test.afterEach(async ({}) => {
        //Get user token
        const apiUtils = new BaseCall()
        const userToken = await apiUtils.getAccessToken(dataManagementConfig.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

        let apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/x-www-form-urlencoded', "")
 
        //Construct Locations Body
        let requestBodyJSON = {
            "transactionLinks":[],
            "services":[]
        }
        const requestBody = JSON.stringify(requestBodyJSON)
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
        await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_TRANSACTION_LINKS}?access_token=${userToken}`, requestBody)
        await apiUtils.patchRequest(apiContext, `/api/locations/${dataManagementConfig.DM_LOCATION_SERVICES}?access_token=${userToken}`, requestBody)
    });
});
