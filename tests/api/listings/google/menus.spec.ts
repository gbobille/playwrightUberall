 
import { APIRequestContext, APIResponse, expect, test } from "@playwright/test";
import BaseCall from "../../../../api/uberall/baseCall";
import { listingsConfig } from "../../../listings/listings.config";
import createRequestBodyUtil from "../../../../api/uberall/utils/create-request-body-util";

const locationID = listingsConfig.LIS_LOCATION_GOOGLE_PUBLISHING;
const googleListingID = listingsConfig.GOOGLE_LISTINGS_GOOGLE_PUBLISHING;
const menuItemID = listingsConfig.MENU_ITEM_ID;
let userToken = "";
let apiContext: APIRequestContext;
let response: APIResponse;
const apiUtils = new BaseCall()
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))
const headers = {
    "cookie": process.env.COOKIE as string,
    "Content-Type": "application/x-www-form-urlencoded"
}

//Content Collection Parameters
let collectionID: any = null
let section1: any = null
let section2: any = null
let item: any = null
let payload = new Map<any, any>()
let contentLists: object[] = []

test.describe.configure({ mode: 'serial' });
test.setTimeout(2400000);

test.describe("Google Publishing Tests - Menu Items", { tag: '@Publishing' }, () => {
    
    test(`Verify it is possible to publish two different menu items from different sections`, async ({page}) => {    
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });

        await test.step(`And user creates a menu collection and assigns it to the location`, async() => {
            //section creation
            section1 = await createSectionPayload("First Course", "First Course", [36865063,36865064])
            section2 = await createSectionPayload("Second Course", "Second Course", [36881625,36881626])
            contentLists.push(JSON.parse(section1))
            contentLists.push(JSON.parse(section2))

            //collection creation
            payload = createCollectionPayload("MENU", "Menu Collection - Automation - Publishing", "Menu Collection - Automation - Publishing", "Menu Collection",
                "ITALIAN", locationID, contentLists)
            const requestBody = await createRequestBodyUtil.createBody(payload)
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.postRequest(apiContext, `/api/collections/?access_token=${userToken}`, requestBody)
            collectionID = response.response.collection.id
        });

        await test.step(`And user clears the update history`, async () => {
            await delay(5000)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)
        });
        
        await test.step(`When user syncs the listing`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')
        });

        await test.step(`And user pushes the update`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
        });

        await test.step(`Then the listing's items have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const menu = directoryResponse.menus
            
            const expectedSectionNames = [[{"displayName": "First Course"}],[{"displayName": "Second Course"}]]
            const expectedPrices = ["9", "5", "120", "4"]
            const expectedCurrencies = ["EUR", "EUR", "USD", "USD"]
            const expectedLabels = ["Apfelküchle", "Schokopizza", "Argentinian Barbecue", "Ice Cream"]

            let expectIndex = 0
            menu.forEach((section:any, index:any) => {
                expect(section.cuisines).toEqual(["ITALIAN"])
                expect(section.labels).toEqual(expectedSectionNames[index])
                const itemsPerSection = section.sections
                
                itemsPerSection.forEach((menuItem:any) => {
                    expect(menuItem.items[0].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[0].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[0].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                    expect(menuItem.items[1].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[1].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[1].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                });
            });
        });
    });
    
    test(`Verify it is possible to publish three different menu items from the same section`, async ({page}) => {
        
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });

        await test.step(`And user creates a menu collection and assigns it to the location`, async() => {
            //section creation
            section1 = await createSectionPayload("First Course", "First Course", [36865063,36865064,36881625])
            contentLists.push(JSON.parse(section1))

            //collection creation
            payload = createCollectionPayload("MENU", "Menu Collection - Automation - Publishing", "Menu Collection - Automation - Publishing", "Menu Collection",
                "AMERICAN", locationID, contentLists)
            const requestBody = await createRequestBodyUtil.createBody(payload)
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.postRequest(apiContext, `/api/collections/?access_token=${userToken}`, requestBody)
            collectionID = response.response.collection.id
        });

        await test.step(`And user clears the update history`, async () => {
            await delay(5000)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)
        });
        
        await test.step(`When user syncs the listing`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')
        });

        await test.step(`And user pushes the update`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
        });

        await test.step(`Then the listing's items have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const menu = directoryResponse.menus
            
            const expectedSectionNames = [[{"displayName": "First Course"}]]
            const expectedPrices = ["9", "5", "120"]
            const expectedCurrencies = ["EUR", "EUR", "USD"]
            const expectedLabels = ["Apfelküchle", "Schokopizza", "Argentinian Barbecue"]

            let expectIndex = 0
            menu.forEach((section:any, index:any) => {
                expect(section.cuisines).toEqual(["AMERICAN"])
                expect(section.labels).toEqual(expectedSectionNames[index])
                const itemsPerSection = section.sections
                
                itemsPerSection.forEach((menuItem:any) => {
                    expect(menuItem.items[0].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[0].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[0].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                    expect(menuItem.items[1].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[1].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[1].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                });
            });
        });
    });

    test(`Verify if a menu item that was published is modified, then the new changes will be published`, async ({page}) => {
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });

        await test.step(`And user creates a menu collection and assigns it to the location`, async() => {
            //section creation
            section1 = await createSectionPayload("Main Course", "Main Course", [36865063,36865064,36881625])
            contentLists.push(JSON.parse(section1))

            //collection creation
            payload = createCollectionPayload("MENU", "Menu Collection - Automation - Publishing", "Menu Collection - Automation - Publishing", "Menu Collection",
                "AMERICAN", locationID, contentLists)
            const requestBody = await createRequestBodyUtil.createBody(payload)
            
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.postRequest(apiContext, `/api/collections/?access_token=${userToken}`, requestBody)
            collectionID = response.response.collection.id
        });

        await test.step(`And user clears the update history`, async () => {
            await delay(5000)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)
        });
        
        await test.step(`When user syncs the listing`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')
        });

        await test.step(`And user pushes the update`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
        });

        await test.step(`Then the listing's items have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const menu = directoryResponse.menus
            
            const expectedSectionNames = [[{"displayName": "Main Course"}]]
            const expectedPrices = ["9", "5", "120"]
            const expectedCurrencies = ["EUR", "EUR", "USD"]
            const expectedLabels = ["Apfelküchle", "Schokopizza", "Argentinian Barbecue"]

            let expectIndex = 0
            menu.forEach((section:any, index:any) => {
                expect(section.cuisines).toEqual(["AMERICAN"])
                expect(section.labels).toEqual(expectedSectionNames[index])
                const itemsPerSection = section.sections
                
                itemsPerSection.forEach((menuItem:any) => {
                    expect(menuItem.items[0].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[0].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[0].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                    expect(menuItem.items[1].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[1].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[1].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                });
            });
        });

        await test.step(`When user modifies one of the collection's items`, async () => {
            item = await createItemPayload("Argentinian Asado", "Argentinian Asado", 17000)
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.patchRequest(apiContext, `/api/menu-items/${menuItemID}?access_token=${userToken}`, item)
        });

        await test.step(`And user clears the update history`, async () => {
            await delay(5000)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)
        });
        
        await test.step(`When user syncs the listing`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')
        });

        await test.step(`And user pushes the update`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
        });

        await test.step(`Then the listing's items have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const menu = directoryResponse.menus
            
            const expectedSectionNames = [[{"displayName": "Main Course"}]]
            const expectedPrices = ["9", "5", "170"]
            const expectedCurrencies = ["EUR", "EUR", "USD"]
            const expectedLabels = ["Apfelküchle", "Schokopizza", "Argentinian Asado"]

            let expectIndex = 0
            menu.forEach((section:any, index:any) => {
                expect(section.cuisines).toEqual(["AMERICAN"])
                expect(section.labels).toEqual(expectedSectionNames[index])
                const itemsPerSection = section.sections
                
                itemsPerSection.forEach((menuItem:any) => {
                    expect(menuItem.items[0].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[0].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[0].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                    expect(menuItem.items[1].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[1].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[1].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                });
            });
        });
    });

    test(`Verify if a menu item that was published is removed from the collection, then the new changes will be published`, async ({page}) => {
        await test.step(`Given user logs in with valid credentials for elegible sales partner`, async() => {
            userToken = await apiUtils.getAccessToken(listingsConfig.CHILD_ADMIN_USERNAME, process.env.CHILD_ADMIN_PASSWORD);
        });

        await test.step(`And user creates a menu collection and assigns it to the location`, async() => {
            //section creation
            section1 = await createSectionPayload("Main Course", "Main Course", [36865063,36865064,36881625])
            contentLists.push(JSON.parse(section1))

            //collection creation
            payload = createCollectionPayload("MENU", "Menu Collection - Automation - Publishing", "Menu Collection - Automation - Publishing", "Menu Collection",
                "AMERICAN", locationID, contentLists)
            const requestBody = await createRequestBodyUtil.createBody(payload)
            
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.postRequest(apiContext, `/api/collections/?access_token=${userToken}`, requestBody)
            collectionID = response.response.collection.id
        });

        await test.step(`And user clears the update history`, async () => {
            await delay(5000)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)
        });
        
        await test.step(`When user syncs the listing`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')
        });

        await test.step(`And user pushes the update`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
        });

        await test.step(`Then the listing's items have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const menu = directoryResponse.menus
            
            const expectedSectionNames = [[{"displayName": "Main Course"}]]
            const expectedPrices = ["9", "5", "120"]
            const expectedCurrencies = ["EUR", "EUR", "USD"]
            const expectedLabels = ["Apfelküchle", "Schokopizza", "Argentinian Barbecue"]

            let expectIndex = 0
            menu.forEach((section:any, index:any) => {
                expect(section.cuisines).toEqual(["AMERICAN"])
                expect(section.labels).toEqual(expectedSectionNames[index])
                const itemsPerSection = section.sections
                
                itemsPerSection.forEach((menuItem:any) => {
                    expect(menuItem.items[0].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[0].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[0].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                    expect(menuItem.items[1].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[1].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[1].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                });
            });
        });

        await test.step(`When user removes one of the collection's items`, async () => {
            section1 = await createSectionPayload("Main Course", "Main Course", [36865063,36865064])
            contentLists = []
            contentLists.push(JSON.parse(section1))
            
            const payload = new Map<any, any>()
            payload.set("contentLists", contentLists)

            const requestBody = await createRequestBodyUtil.createBody(payload)
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.patchRequest(apiContext, `/api/collections/${collectionID}?access_token=${userToken}`, requestBody)
        });        

        await test.step(`And user clears the update history`, async () => {
            await delay(5000)
            apiContext = await apiUtils.createApiContextWithHeaders(process.env.BASE_URL, headers)
            response = await apiUtils.getRequest_responseHTML(apiContext, `/en/admin/location/clearLocationHistory/${locationID}`)
        });
        
        await test.step(`When user syncs the listing`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncCheck/${googleListingID}?noJob=true`, '')
        });

        await test.step(`And user pushes the update`, async () => {
            await delay(5000)
            response = await apiUtils.postRequest(apiContext, `/en/admin/listing/syncListingData/${googleListingID}?noJob=true&force=on`, '')
        });

        await test.step(`Then the listing's items have been properly changed`, async () => {
            await delay(5000)
            await page.setExtraHTTPHeaders(headers);
            await page.goto(`${process.env.BASE_URL}/en/admin/listing/showDirectoryResponse/${googleListingID}`, { waitUntil: 'load' })
            const directoryResponse = JSON.parse(await page.locator('pre').innerText())
            const menu = directoryResponse.menus
            
            const expectedSectionNames = [[{"displayName": "Main Course"}]]
            const expectedPrices = ["9", "5"]
            const expectedCurrencies = ["EUR", "EUR"]
            const expectedLabels = ["Apfelküchle", "Schokopizza"]

            let expectIndex = 0
            menu.forEach((section:any, index:any) => {
                expect(section.cuisines).toEqual(["AMERICAN"])
                expect(section.labels).toEqual(expectedSectionNames[index])
                const itemsPerSection = section.sections
                
                itemsPerSection.forEach((menuItem:any) => {
                    expect(menuItem.items[0].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[0].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[0].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                    expect(menuItem.items[1].attributes.price.units).toEqual(expectedPrices[expectIndex])
                    expect(menuItem.items[1].attributes.price.currencyCode).toEqual(expectedCurrencies[expectIndex])
                    expect(menuItem.items[1].labels[0].displayName).toEqual(expectedLabels[expectIndex])
                    expectIndex = expectIndex+1
                });
            });
        });
    });
});

function createCollectionPayload(type:string, name:string, identifier:string, description:string, cuisine:string, locationID:any, contentLists:any) {
    const collectionBody = new Map<any, any>()
    collectionBody.set("type", type)
    collectionBody.set("name", name)
    collectionBody.set("identifier", identifier)
    collectionBody.set("description", description)
    collectionBody.set("cuisineType", cuisine)
    collectionBody.set("locationIds", [locationID])
    collectionBody.set("contentLists", contentLists)

    return collectionBody
}

async function createSectionPayload(title:string, description:string, itemIds:any) {
    const sectionBody = new Map<any, any>()
    sectionBody.set("title", title)
    sectionBody.set("description", description)
    sectionBody.set("itemIds", itemIds)
    const body = await createRequestBodyUtil.createBody(sectionBody)
    return body
}

async function createItemPayload(identifier:string, title:string, price:any) {
    const itemBody = new Map<any, any>()
    itemBody.set("identifier", identifier)
    itemBody.set("title", title)
    itemBody.set("price", price)
    const body = await createRequestBodyUtil.createBody(itemBody)
    return body
}

test.afterEach(async () => {
    await test.step(`After each method`, async () => {
        //Restore global variables
        payload.clear()
        contentLists = []
        section1 = null
        section2 = null

        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "");
        
        //Delete collection
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (collectionID != null) {
            await apiUtils.deleteRequest(apiContext, `/api/collections/${collectionID}?access_token=${userToken}`);
        }
        
        //Restore items values
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (test.info().title == "Verify if a menu item that was published is removed from the collection, then the new changes will be published") {
            const item = await createItemPayload("Argentinian Barbecue", "Argentinian Barbecue", 12000)
            const apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', "")
            response = await apiUtils.patchRequest(apiContext, `/api/menu-items/${menuItemID}?access_token=${userToken}`, item)  
        }
    });
});