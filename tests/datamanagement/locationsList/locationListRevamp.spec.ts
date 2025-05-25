/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/valid-describe-callback */
import { expect, test } from "@playwright/test";
import LocationListRevamp from "../../../pages/datamanagement/locationListRevamp";
import BasicData from "../../../pages/datamanagement/singleLocationProfile/basicDataPage";
import AddNewLocation from "../../../pages/datamanagement/contentCollections/addNewLocationPage";
import { loginUberallAppAs } from "../../../utils/login-util";
import { dataManagementConfig } from "../dataManagement.config";
import BulkUpdate from "../../../pages/datamanagement/bulkUpdatePage";
import FileImport from "../../../pages/datamanagement/fileImportPage";

test.describe(`Location List Revamp - Verify enabled user can view the new Location List page @locationlistrevamp @dm_regression`, async () => {

    test.beforeEach("Given user successfully logs in and navigates to the Location List page", async ({page}) => {
        await loginUberallAppAs(page, dataManagementConfig.DM_LOCATIONLIST_REVAMP_USER, process.env.ADMIN_PASSWORD)
        await page.goto(`${process.env.BASE_URL}/en/app/uberall/locations`, { waitUntil: 'domcontentloaded' })
    })

    test(`Verify user can view the new Location List Page`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)
        
        await test.step(`When user clicks the map view and the map is displayed`, async () => {
            await locationListRevamp.mapButton.click()
            await locationListRevamp.map.isVisible()
        })

        await test.step(`And user clicks the List View and the list of locations is displayed`, async () => {
            await locationListRevamp.locationListButton.click()
        })

        await test.step(`Then user can view the new Column Headers`, async () => {
            await expect(locationListRevamp.columnHeader('Identifier')).toBeVisible()
            await expect(locationListRevamp.columnHeader('Action Required')).toBeVisible()
            await expect(locationListRevamp.columnHeader('Profile Completion')).toBeVisible()
            await expect(locationListRevamp.columnHeader('Product Plan')).toBeVisible()
        })
    })

    test(`Verify user can access locations from the new Location List Page`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)
        const basicData = new BasicData (page)

        await test.step(`When user filters by business - Bike Racks Smart Conversation`, async() => {
            await locationListRevamp.businessFilter.click()
            await locationListRevamp.selectBusiness('Bike Racks Smart Conversation').click()
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`And user clicks a location`, async () => {
            await locationListRevamp.locationName.click()
        })

        await test.step(`Then user verifies they're on the location page`, async () => {
            await basicData.locationName('DM_GENERAL_TESTS').click()
        })
    })

    test(`Verify user can add a new location from the new Location List Page`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)
        const addNewLocationPage = new AddNewLocation (page)

        await test.step(`When user clicks Add Location button and selects manual`, async () => {
            await locationListRevamp.addLocationButton.click()
            await locationListRevamp.manualButton.click()
        })

        await test.step(`Then user verifies they're on the Add New Location page`, async() => {
            await addNewLocationPage.addNewLocationTitle.click()
            await addNewLocationPage.businessInformationTitle.isVisible()
        })
    })

    test(`Verify user can search for a location using the Search Bar`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user types a location on the search field`, async () => {
            await locationListRevamp.searchLocation('pulled pork paradise philippines')
        })

        await test.step(`Then user verifies the correct location is displayed`, async() => {
            await expect(locationListRevamp.searchResult('pulled pork paradise philippines')).toBeVisible()
        })
    })

    test(`Verify user can use filters and the correct locations are displayed`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user clicks Actions Required`, async () => {
            await locationListRevamp.actionsRequiredButton.click()
        })

        await test.step(`And user filters by Business: Bike Racks Smart Conversation`, async () => {
            await locationListRevamp.businessFilter.click()
            await locationListRevamp.selectBusiness('Bike Racks Smart Conversation').click()
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`Then user verifies the correct locations are shown`, async() => {
            await expect(locationListRevamp.searchResult('DM_GENERAL_TESTS')).toBeVisible()
        })
    })

    test (`Verify user can use Advanced Filters and the correct columns and locations are displayed`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user opens the Advanced Filter modal`, async() => {
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`And user selects United States from the Country's list`, async() => {
            await locationListRevamp.countryFilter.click()
            await locationListRevamp.countrySelector('Philippines').click()
            await locationListRevamp.closeAdvancedFilters.click()
        })

        await test.step(`Then user verifies correct locations are shown`, async() => {
            await expect(locationListRevamp.searchResult('pulled pork paradise philippines')).toBeVisible()
        })
    })

    test (`Verify user can view the Business column`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user filters by business - Bike Racks Smart Conversation`, async() => {
            await locationListRevamp.businessFilter.click()
            await locationListRevamp.selectBusiness('Bike Racks Smart Conversation').click()
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`Then user verifies Business Column is appearing`, async() => {
            await locationListRevamp.businessName.click()
            await expect(locationListRevamp.bikeRackSmartConversation).toBeVisible()
        })
    })

    test (`Verify Admin user can view the Product Plan column`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user filters by business - Bike Racks Smart Conversation`, async() => {
            await locationListRevamp.businessFilter.click()
            await locationListRevamp.selectBusiness('Bike Racks Smart Conversation').click()
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`Then user verifies Product Plan Column is appearing`, async() => {
            await expect(locationListRevamp.productPlan).toBeVisible()
        })
    })

    test (`Verify user can access the Bulk Editor page from the new Location List Page`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)
        const bulkUpdateEditor = new BulkUpdate (page)

        await test.step(`When user clicks the Bulk Editor button`, async() => {
            await locationListRevamp.bulkUpdateButton.click()
            await locationListRevamp.bulkEditorButton.click()
        })

        await test.step(`Then user verifies they can reach the Bulk Editor page`, async() => {
            await bulkUpdateEditor.clickAddLocationsButton()
        })
    })

    test (`Verify user can access the Location Template Import page from the new Location List Page`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)
        const fileImport = new FileImport (page)

        await test.step(`When user clicks the Bulk Editor button`, async() => {
            await locationListRevamp.bulkUpdateButton.click()
            await locationListRevamp.excelImportButton.click()
        })

        await test.step(`Then user verifies they can reach the Bulk Editor page`, async() => {
            await fileImport.locationTemplateTitle.click()
        })
    })

    test (`Verify user can select locations and sync them`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user filters by business - Brandpage Connect without FB`, async() => {
            await locationListRevamp.businessFilter.click()
            await locationListRevamp.selectBusiness('Brandpage Connect without FB').click()
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`And user selects all locations`, async() => {
            await locationListRevamp.selectAllLocations.click()
        })

        await test.step(`And user clicks the Sync button`, async() => {
            await locationListRevamp.syncButton.click()
            await locationListRevamp.confirmSyncButton.click()
        })

        await test.step(`Then user verifies sync is successful`, async() => {
            await expect(locationListRevamp.syncSuccess).toBeVisible()
        })
    })

    test (`Verify user can select locations and export them`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user filters by business - Brandpage Connect without FB`, async() => {
            await locationListRevamp.businessFilter.click()
            await locationListRevamp.selectBusiness('Brandpage Connect without FB').click()
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`And user selects all locations`, async() => {
            await locationListRevamp.selectAllLocations.click()
        })

        await test.step(`And user clicks the Export button`, async() => {
            await locationListRevamp.exportButton.click()
        })

        await test.step(`Then user verifies download is processed`, async() => {
            await expect(locationListRevamp.downloadingMessage).toBeVisible()
            const download2Promise = page.waitForEvent('download')
            const download = await download2Promise;
        })
    })

    test (`Verify user can see Actions Required: Missing Listings tag when filtering by Actions Required`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user clicks Actions Required button`, async () => {
            await locationListRevamp.actionsRequiredButton.click()
        })

        await test.step(`And user filters by business - Bike Racks Smart Conversation`, async() => {
            await locationListRevamp.businessFilter.click()
            await locationListRevamp.selectBusiness('Bike Racks Smart Conversation').click()
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`Then user verifies they can see the Missing Listings tag`, async () => {
            await expect(locationListRevamp.missingListings).toBeVisible()
        })
    })

    test(`Verify user can't view Actions Required when locations are Closed`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user clicks Actions Required button`, async () => {
            await locationListRevamp.actionsRequiredButton.click()
        })

        await test.step(`And user selects a Business`, async () => {
            await locationListRevamp.businessFilter.click()
            await locationListRevamp.selectBusiness('Anna\'s Test').click()
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`And filters by Location Status = Closed`, async() => {
            await locationListRevamp.clickStatus.click()
            await locationListRevamp.closeStatus.click()
        })

        await test.step(`And user clicks Actions Required button`, async() => {
            await locationListRevamp.actionsRequiredButton.click()
        })

        await test.step(`Then user verifies locations are not appearing`, async() => {
            await locationListRevamp.noLocationsFound.click()
        })
    })

    test(`Verify user can't view Actions Required when locations are Inactive`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user clicks Actions Required button`, async () => {
            await locationListRevamp.actionsRequiredButton.click()
        })

        await test.step(`And user selects a Business`, async () => {
            await locationListRevamp.businessFilter.click()
            await locationListRevamp.selectBusiness('Anna\'s Test').click()
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`And filters by Location Status = Inactive`, async() => {
            await locationListRevamp.clickStatus.click()
            await locationListRevamp.inactiveStatus.click()
        })

        await test.step(`And user clicks Actions Required button`, async() => {
            await locationListRevamp.actionsRequiredButton.click()
        })

        await test.step(`Then user verifies locations are not appearing`, async() => {
            await locationListRevamp.noLocationsFound.click()
        })
    })

    test(`Verify user can search labels in the filters`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp (page)

        await test.step(`When user opens the Advanced Filter modal`, async() => {
            await locationListRevamp.openAdvancedFilters.click()
        })

        await test.step(`And user searches for a specific label`, async () => {
            await locationListRevamp.labelFilter.click()
            await locationListRevamp.labelInput.fill('label1')
            await locationListRevamp.labelSelector('label1').click()
            await locationListRevamp.closeAdvancedFilters.click()
        });

        await test.step(`Then user verifies the correct locations are displayed`, async () => {
                await expect(locationListRevamp.searchResult('pulled pork paradise philippines')).toBeVisible()
            });
    });
    
    test(`Verify user can successfully search locations with various fields`, async ({ page }) => {
        const locationListRevamp = new LocationListRevamp(page);

        const searchFields = [
            { field: 'name', value: 'DM_AUTOMATED_LOCATION', expectedResult: 'DM_AUTOMATED_LOCATION' },
            { field: 'street', value: 'Eitelstraße', expectedResult: 'Bubbles Dog Wash' },
            { field: 'streetNo', value: '67', expectedResult: 'Euromaster' },
            { field: 'zip', value: '1112', expectedResult: 'Address - SU - Cleansing Location 7 - Rizal Park - Philippines' },
            { field: 'city', value: 'Berlin', expectedResult: 'Bubbles Dog Wash' },
            { field: 'country', value: 'DE', expectedResult: 'Elis\'s playground' },
            { field: 'identifier', value: '12345', expectedResult: 'Euromaster' },
        ];

        await test.step(`Then user verifies the correct locations are displayed for all fields`, async () => {
            for (const {value, expectedResult } of searchFields) {
                    await locationListRevamp.searchLocation(value);
                    await expect(locationListRevamp.searchResult(expectedResult)).toBeVisible();
            }
        });
    });
})