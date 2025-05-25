import { expect, FrameLocator, Locator, Page, selectors } from "@playwright/test";
import * as assert from 'assert';

export default class sentiment {
    analyticsSidebarLink: Locator;
    sentimentDashboardLink: Locator;
    sentimentDashboard: Locator;
    sentimentScore: Locator;
    sentimentByType: Locator;
    trendingUp: Locator;
    trendingDown: Locator;
    sentimentByLocations: Locator;
    wordCloudModal: Locator;
    sentimentChartScoreSelector: Locator;
    sentimentChartExportReport: Locator;
    scoreFilterPanel: Locator;
    locationDashboardLoadingSpinner: Locator;
    noDataAvailableOnLocationDashboard: Locator;
    sentimentScoreFilterSelectAllButton: Locator;
    sentimentScore90to100: Locator;
    sentimentScore80To89: Locator;
    sentimentScore70To79: Locator;
    sentimentScore60To69: Locator;
    sentimentScoreLessThan60: Locator;
    applySelectedScoreToFilter: Locator;
    keywordsTrending: Locator;
    closeKeywordsModalButton: Locator;
    keywordsChart: Locator;
    trendingDownThemeFacilities: Locator;
    trendingDownThemeCovidPolicy: Locator;
    trendingDownThemeServiceAndStaff: Locator;
    trendingDownThemeWaitTime: Locator;
    trendingDownThemePricing: Locator;
    trendingUpThemeFacilities: Locator;
    trendingUpThemeCovidPolicy: Locator;
    trendingUpThemeServiceAndStaff: Locator;
    trendingUpThemeWaitTime: Locator;
    trendingUpThemePricing: Locator;
    themeFacilitiesTextInModal: Locator;
    themeWaitTimeTextInModal: Locator;
    themeServiceAndStaffTextInModal: Locator;
    themePricingTextInModal: Locator;
    themeCovidPolicyTextInModal: Locator;
    contextPaneThemeSelector: Locator;
    closeContextPaneThemeSelector: Locator;
    locationNameOnContextPane: Locator;
    firstLocationOnListScoreButton: Locator;
    firstLocationOnListName: Locator;
    sentimentFilter: Locator;
    sentimentDateFilter: Locator;
    sentimentAccountFilter: Locator;
    sentimentGroupFilter: Locator;
    sentimentLocationFilter: Locator;
    sentimentDirectoryFilter: Locator;
    sentimentFilterClearAllButton: Locator;
    sentimentfilterCancelButton: Locator;
    sentimentFilterApplyButton: Locator;
    analyticsHyperlinkForLocationManager: Locator;
    viewKeywordsButton: Locator;
    openFiltersButton: Locator;
    nextPageIcon: Locator;
    sentimentDropdownInContextPane: Locator;
    datePickerPresetsOpen: Locator;
    last12MonthsDateOption: Locator;
    datePickerOKButton: Locator;
    sentimentScoreLoadingSpinner: Locator;
    sentimentByTypeLoadingSpinner: Locator;
    trendingUpLoadingSpinner: Locator;
    trendingDownLoadingSpinner: Locator;
    sentimentByLocationDashboardLoadingSpinner: Locator;
    lastLocationOnListScoreButton: Locator;
    exportFeedButton: Locator;
    editThemesColumn: Locator;
    editThemesColumnAfterHiding: Locator;
    resetThemesColumnButton: Locator;
    applyThemeSelectionButton: Locator;
    themeBeveragesColumn: Locator;
    themeBeveragesColumnSelector: Locator;
    themeCovidPolicyColumn: Locator;
    themeCovidPolicyColumnSelector: Locator;
    themeFacilitiesColumn: Locator;
    themeFacilitiesColumnSelector: Locator;
    themeFoodColumn: Locator;
    themeFoodColumnSelector: Locator;
    themePricingColumn: Locator;
    themePricingColumnSelector: Locator;
    themeServiceAndStaffColumn: Locator;
    themeServiceAndStaffColumnSelector: Locator;
    themeWaitTimeColumn: Locator;
    themeWaitTimeColumnSelector: Locator;



    constructor(public page: Page) {

        this.analyticsSidebarLink = page.getByRole('link', { name: 'Analytics', exact: true })
        this.sentimentDashboardLink = page.getByTestId('sentiment-analysis')
        this.sentimentDashboard = page.getByTestId('sentiment-analysis-dashboard')
        this.viewKeywordsButton = page.getByText('View Keywords')
        this.openFiltersButton = page.getByTestId('ZNT-filter-wrapper_open-filters')
        this.sentimentChartExportReport = page.locator("#export-btn")
        this.sentimentFilterClearAllButton = page.getByTestId('ZNT-filter-wrapper_dropdown-clear-all')
        this.sentimentfilterCancelButton = page.getByTestId('ZNT-filter-wrapper_cancel')
        this.sentimentFilterApplyButton = page.getByTestId('ZNT-filter-wrapper_close-filters')
        this.sentimentLocationFilter = page.getByTestId('cascade-location-filter_select-wrapper')
        this.sentimentDirectoryFilter = page.getByTestId('directories-multiple-selector_select-wrapper')
        this.sentimentAccountFilter = page.getByTestId('cascade-account-filter_select-wrapper')
        this.sentimentGroupFilter = page.getByTestId('cascade-groups-filter-multi-selection_select-wrapper')
        this.sentimentDateFilter = page.getByTestId('day-picker-filter_open-picker')
        this.sentimentChartScoreSelector = page.locator('xpath=//*[starts-with(@class,"empty-select")]')
        this.sentimentScore = page.locator('mf-overall-grade.sentiment-card')
        this.sentimentByType = page.locator('mf-total-mentions.sentiment-card')
        this.trendingDown = page.locator('mf-trending.sentiment-card:has(h3:has-text("Trending down"))')
        this.trendingUp = page.locator('mf-trending.sentiment-card:has(h3:has-text("Trending up"))')
        this.nextPageIcon = page.locator('xpath=//mat-icon[contains(text(),"navigate_next")]');
        this.sentimentByLocations = page.locator('mf-sentiment-locations.sentiment-card.dashboard-chart')
        this.wordCloudModal = page.getByRole('dialog', { name: 'Keywords Trending' })
        this.closeKeywordsModalButton = page.getByTestId('close-modal-button')
        this.trendingDownThemeFacilities = page.locator("#open-theme-trending-down-facilities");
        this.trendingDownThemeCovidPolicy = page.locator("#open-theme-trending-down-covid_policy");
        this.trendingDownThemeServiceAndStaff = page.locator("#open-theme-trending-down-service");
        this.trendingDownThemeWaitTime = page.locator("#open-theme-trending-down-wait_time");
        this.trendingDownThemePricing = page.locator("#open-theme-trending-down-pricing");
        this.trendingUpThemeFacilities = page.locator("#open-theme-trending-up-facilities");
        this.trendingUpThemeCovidPolicy = page.locator("#open-theme-trending-up-covid_policy");
        this.trendingUpThemeServiceAndStaff = page.locator("#open-theme-trending-up-service");
        this.trendingUpThemeWaitTime = page.locator("#open-theme-trending-up-wait_time");
        this.trendingUpThemePricing = page.locator("#open-theme-trending-up-pricing");
        this.closeContextPaneThemeSelector = page.locator('#close-flyout')
        this.themeFacilitiesTextInModal = page.getByRole('combobox', { name: 'Facilities and Amenities', exact: true }).getByText('Facilities and Amenities')
        this.themeWaitTimeTextInModal = page.getByRole('combobox', { name: 'Wait Time', exact: true }).getByText('Wait Time')
        this.themeCovidPolicyTextInModal = page.getByRole('combobox', { name: 'Covid Policy', exact: true }).getByText('Covid Policy')
        this.themeServiceAndStaffTextInModal = page.getByRole('combobox', { name: 'Service and Staff', exact: true }).getByText('Service and Staff')
        this.themePricingTextInModal = page.getByRole('combobox', { name: 'Pricing and Value', exact: true }).getByText('Pricing and Value')
        this.sentimentDropdownInContextPane = page.getByText('All Sentiments ( 3 )expand_more')
        this.datePickerPresetsOpen = page.getByTestId('day-picker-filter-presets_select-wrapper').locator('svg').first()
        this.last12MonthsDateOption = page.getByTestId('LAST_12_MONTHS')
        this.datePickerOKButton = page.getByRole('button', { name: 'Ok' })
        this.sentimentScoreLoadingSpinner = page.locator('mf-overall-grade').getByRole('progressbar')
        this.sentimentByTypeLoadingSpinner = page.locator('mf-total-mentions').getByRole('progressbar')
        this.trendingUpLoadingSpinner = page.locator('mf-trending').filter({ hasText: 'Trending up info' }).locator('circle')
        this.trendingDownLoadingSpinner = page.locator('mf-trending').filter({ hasText: 'Trending down info' }).locator('circle')
        this.firstLocationOnListScoreButton = page.locator('#open-all-theme-feed-0')
        this.firstLocationOnListName = page.locator('xpath=(//*[starts-with(@class,"mat-cell")]/b)[01]')
        this.locationNameOnContextPane = page.locator("xpath=//*[starts-with(@class, 'theme-brand-name')]")
        this.sentimentByLocationDashboardLoadingSpinner = page.locator('.base-layer > .spinner-wrapper')
        this.sentimentScore90to100 = page.locator('#option-grade-filter-90-100')
        this.sentimentScore80To89 = page.locator('#option-grade-filter-80-89')
        this.sentimentScore70To79 = page.locator('#option-grade-filter-70-79')
        this.sentimentScore60To69 = page.locator('#option-grade-filter-60-69')
        this.sentimentScoreLessThan60 = page.getByRole('option', { name: '<' })
        this.applySelectedScoreToFilter = page.getByRole('button', { name: 'Apply' })
        this.sentimentScoreFilterSelectAllButton = page.locator('#select-all-grade-filter')
        this.lastLocationOnListScoreButton = page.locator('#open-all-theme-feed-4')
        this.exportFeedButton = page.getByTestId('export-feed-button')
        this.editThemesColumn = page.getByRole('columnheader', { name: 'Beverages drag_indicator,' }).getByRole('button')
        this.editThemesColumnAfterHiding = page.getByRole('row', { name: 'Rank Location Mentions Score' }).locator('button')
        this.resetThemesColumnButton = page.getByText('Reset')
        this.applyThemeSelectionButton = page.getByRole('button', { name: 'Apply' }) 
        this.themeBeveragesColumn = page.getByRole('button', { name: 'Beverages' })
        this.themeBeveragesColumnSelector = page.getByRole('option', { name: 'Beverages' }).locator('mat-pseudo-checkbox')
        this.themeCovidPolicyColumn = page.getByRole('button', { name: 'Covid Policy' })
        this.themeCovidPolicyColumnSelector = page.getByRole('option', { name: 'Covid Policy' }).locator('mat-pseudo-checkbox')
        this.themeFacilitiesColumn = page.getByRole('button', { name: 'Facilities and Amenities' })
        this.themeFacilitiesColumnSelector = page.getByRole('option', { name: 'Facilities and Amenities' }).locator('mat-pseudo-checkbox')
        this.themeFoodColumn = page.getByRole('button', { name: 'Food' })
        this.themeFoodColumnSelector = page.getByRole('option', { name: 'Food' }).locator('mat-pseudo-checkbox')
        this.themePricingColumn = page.getByRole('button', { name: 'Pricing and Value' })
        this.themePricingColumnSelector = page.getByRole('option', { name: 'Pricing and Value' }).locator('mat-pseudo-checkbox')
        this.themeServiceAndStaffColumn = page.getByRole('button', { name: 'Service and Staff' })
        this.themeServiceAndStaffColumnSelector = page.getByRole('option', { name: 'Service and Staff' }).locator('mat-pseudo-checkbox')
        this.themeWaitTimeColumn = page.getByRole('button', { name: 'Wait Time' })
        this.themeWaitTimeColumnSelector = page.getByRole('option', { name: 'Wait Time' }).locator('mat-pseudo-checkbox')
    }

    async navigateToSentimentDashboard() {
        await expect(this.analyticsSidebarLink).toBeVisible()
        await this.analyticsSidebarLink.click()
        await expect(this.sentimentDashboardLink).toBeVisible()
        await this.sentimentDashboardLink.click()
        await this.applyLast12MonthsDateFilter()
    }

    async verifyDashboardLoad() {
        await expect(this.sentimentDashboard).toBeVisible()
    }

    async verifyDashboardLoadForSingleLocationManager() {
        await expect(this.sentimentDashboard).toBeVisible()
    }

    async filtersCheck() {
        await this.openFiltersButton.click()
        await expect(this.sentimentAccountFilter).toBeVisible({timeout:1000})
        await expect(this.sentimentGroupFilter).toBeVisible({timeout:1000})
        await expect(this.sentimentLocationFilter).toBeVisible({timeout:1000})
        await expect(this.sentimentDirectoryFilter).toBeVisible({timeout:1000})
        await expect(this.sentimentFilterClearAllButton).toBeVisible({timeout:1000})
        await expect(this.sentimentfilterCancelButton).toBeVisible({timeout:1000})
        await expect(this.sentimentFilterApplyButton).toBeVisible({timeout:1000})
    }

    async filtersCheckForLocationManager() {
        await this.openFiltersButton.click()
        await expect(this.sentimentDirectoryFilter).toBeVisible({timeout:1000})
        await expect(this.sentimentFilterClearAllButton).toBeVisible({timeout:1000})
        await expect(this.sentimentfilterCancelButton).toBeVisible({timeout:1000})
        await expect(this.sentimentFilterApplyButton).toBeVisible({timeout:1000})
    }

    async filtersCheckForMultiLocationManager() {
        await this.openFiltersButton.click()
        await expect(this.sentimentGroupFilter).toBeVisible({timeout:1000})
        await expect(this.sentimentLocationFilter).toBeVisible({timeout:1000})
        await expect(this.sentimentDirectoryFilter).toBeVisible({timeout:1000})
        await expect(this.sentimentFilterClearAllButton).toBeVisible({timeout:1000})
        await expect(this.sentimentfilterCancelButton).toBeVisible({timeout:1000})
        await expect(this.sentimentFilterApplyButton).toBeVisible({timeout:1000})
    }

    async verifyWordcloudModal() {
        await this.viewKeywordsButton.click()
        await expect(this.wordCloudModal).toBeVisible()
        await expect(this.closeKeywordsModalButton).toBeVisible()
        await this.closeKeywordsModalButton.click()
    }

    async getTrendingThemesList(trendingType: string): Promise<string[]> {
        let trendingUpThemeList: string[] = [];
        let trendingDownThemeList: string[] = [];
    
        switch (trendingType) {
            case "Trending Up":
                try {
                    if (await this.trendingUpThemeCovidPolicy.isVisible()) {
                        trendingUpThemeList.push("Covid Policy");
                    }
                } catch (e) {
                    console.log("Covid Policy Trending Up is not shown.");
                }
                try {
                    if (await this.trendingUpThemeFacilities.isVisible()) {
                        trendingUpThemeList.push("Facilities and Amenities");
                    }
                } catch (e) {
                    console.log("Facilities and Amenities Trending Up is not shown.");
                }
                try {
                    if (await this.trendingUpThemeWaitTime.isVisible()) {
                        trendingUpThemeList.push("Wait Time");
                    }
                } catch (e) {
                    console.log("Wait Time Trending Up is not shown.");
                }
                try {
                    if (await this.trendingUpThemePricing.isVisible()) {
                        trendingUpThemeList.push("Pricing and Value");
                    }
                } catch (e) {
                    console.log("Pricing and Value Trending Up is not shown.");
                }
                try {
                    if (await this.trendingUpThemeServiceAndStaff.isVisible()) {
                        trendingUpThemeList.push("Service and Staff");
                    }
                } catch (e) {
                    console.log("Service and Staff Trending Up is not shown.");
                }
                console.log("The list of available trending up themes for the given period is: ", trendingUpThemeList);
                return trendingUpThemeList;
    
            case "Trending Down":
                try {
                    if (await this.trendingDownThemeCovidPolicy.isVisible()) {
                        trendingDownThemeList.push("Covid Policy");
                    }
                } catch (e) {
                    console.log("Covid Policy Trending Down is not shown.");
                }
                try {
                    if (await this.trendingDownThemeFacilities.isVisible()) {
                        trendingDownThemeList.push("Facilities and Amenities");
                    }
                } catch (e) {
                    console.log("Facilities and Amenities Trending Down is not shown.");
                }
                try {
                    if (await this.trendingDownThemeWaitTime.isVisible()) {
                        trendingDownThemeList.push("Wait Time");
                    }
                } catch (e) {
                    console.log("Wait Time Trending Down is not shown.");
                }
                try {
                    if (await this.trendingDownThemePricing.isVisible()) {
                        trendingDownThemeList.push("Pricing and Value");
                    }
                } catch (e) {
                    console.log("Pricing and Value Trending Down is not shown.");
                }
                try {
                    if (await this.trendingDownThemeServiceAndStaff.isVisible()) {
                        trendingDownThemeList.push("Service and Staff");
                    }
                } catch (e) {
                    console.log("Service and Staff Trending Down is not shown.");
                }
                console.log("The list of available trending down themes for the given period is: ", trendingDownThemeList);
                return trendingDownThemeList;
        }
    }

    async clickOnTrendingThemes(trendingType: string): Promise<void> {
        const trendingThemesList = await this.getTrendingThemesList(trendingType);
    
        for (const theme of trendingThemesList) {
            switch (theme) {
                case "Covid Policy":
                    await (trendingType === "Trending Up" ? this.trendingUpThemeCovidPolicy : this.trendingDownThemeCovidPolicy).click();
                    await expect(this.themeCovidPolicyTextInModal).toBeVisible();
                    await expect(this.sentimentDropdownInContextPane).toBeVisible();
                    await expect(this.closeContextPaneThemeSelector).toBeVisible();
                    await this.closeContextPaneThemeSelector.click();
                    break;
                case "Facilities and Amenities":
                    await (trendingType === "Trending Up" ? this.trendingUpThemeFacilities : this.trendingDownThemeFacilities).click();
                    await expect(this.themeFacilitiesTextInModal).toBeVisible();
                    await expect(this.sentimentDropdownInContextPane).toBeVisible();
                    await expect(this.closeContextPaneThemeSelector).toBeVisible();
                    await this.closeContextPaneThemeSelector.click();
                    break;
                case "Wait Time":
                    await (trendingType === "Trending Up" ? this.trendingUpThemeWaitTime : this.trendingDownThemeWaitTime).click();
                    await expect(this.themeWaitTimeTextInModal).toBeVisible();
                    await expect(this.sentimentDropdownInContextPane).toBeVisible();
                    await expect(this.closeContextPaneThemeSelector).toBeVisible();
                    await this.closeContextPaneThemeSelector.click();
                    break;
                case "Pricing and Value":
                    await (trendingType === "Trending Up" ? this.trendingUpThemePricing : this.trendingDownThemePricing).click();
                    await expect(this.themePricingTextInModal).toBeVisible();
                    await expect(this.sentimentDropdownInContextPane).toBeVisible();
                    await expect(this.closeContextPaneThemeSelector).toBeVisible();
                    await this.closeContextPaneThemeSelector.click();
                    break;
                case "Service and Staff":
                    await (trendingType === "Trending Up" ? this.trendingUpThemeServiceAndStaff : this.trendingDownThemeServiceAndStaff).click();
                    await expect(this.themeServiceAndStaffTextInModal).toBeVisible();
                    await expect(this.sentimentDropdownInContextPane).toBeVisible();
                    await expect(this.closeContextPaneThemeSelector).toBeVisible();
                    await this.closeContextPaneThemeSelector.click();
                    break;
            }
        }
    }

    async waitForSpinners() {
        const spinners = [
            this.sentimentScoreLoadingSpinner,
            this.sentimentByTypeLoadingSpinner,
            this.trendingUpLoadingSpinner,
            this.trendingDownLoadingSpinner,
            this.sentimentByLocationDashboardLoadingSpinner
        ];
    
        await Promise.allSettled(spinners.map(spinner => 
            spinner.waitFor({ state: 'visible' }).catch(() => {})
        ));
    
        await Promise.allSettled(spinners.map(spinner => 
            spinner.waitFor({ state: 'hidden' }).catch(() => {})
        ));
    }

    async old_waitForSpinners() {
        await Promise.all([
            this.sentimentScoreLoadingSpinner.  waitFor({ state: 'visible' }),
            this.sentimentByTypeLoadingSpinner.waitFor({ state: 'visible' }),
            this.trendingUpLoadingSpinner.waitFor({ state: 'visible' }),
            this.trendingDownLoadingSpinner.waitFor({ state: 'visible' }),
            this.sentimentByLocationDashboardLoadingSpinner.waitFor({ state: 'visible' }),
        ]);
    
        await Promise.all([
            this.sentimentScoreLoadingSpinner.waitFor({ state: 'hidden' }),
            this.sentimentByTypeLoadingSpinner.waitFor({ state: 'hidden' }),
            this.trendingUpLoadingSpinner.waitFor({ state: 'hidden' }),
            this.trendingDownLoadingSpinner.waitFor({ state: 'hidden' }),
            this.sentimentByLocationDashboardLoadingSpinner.waitFor({ state: 'hidden' }),
        ]);
    }

    async applyLast12MonthsDateFilter() {
        await expect(this.sentimentDateFilter).toBeVisible()
        await this.sentimentDateFilter.click()
        await expect(this.datePickerPresetsOpen).toBeVisible()
        await this.datePickerPresetsOpen.click()
        await expect(this.last12MonthsDateOption).toBeVisible()
        await this.last12MonthsDateOption.click()
        await this.datePickerOKButton.click()
        await this.waitForSpinners()
    }

    async verifyFirstLocationOnList() {
        let firstLocationName = (await this.firstLocationOnListName.innerText()) + " |";
        firstLocationName = firstLocationName.toUpperCase().trim();
    
        await expect(this.firstLocationOnListScoreButton).toBeEnabled();
        await this.firstLocationOnListScoreButton.click();
    
        await expect(this.closeContextPaneThemeSelector).toBeVisible();
    
        const locationNameOnContextPane = (await this.locationNameOnContextPane.innerText()).trim();
        assert.strictEqual(firstLocationName, locationNameOnContextPane);
    }

    async selectScoreFromFilter(score: string) {
        await this.sentimentChartScoreSelector.click();
        switch (score) {
            case "90 to 100":
                await this.sentimentScore90to100.click();
                break;
            case "80 to 89":
                await this.sentimentScore80To89.click();
                break;
            case "70 to 79":
                await this.sentimentScore70To79.click();
                break;
            case "60 to 69":
                await this.sentimentScore60To69.click();
                break;
            case "Less than 60":
                await this.sentimentScoreLessThan60.click();
                break;
        }
    }

    async clearScoresFromList() {
        await this.sentimentChartScoreSelector.click();
        await expect(this.applySelectedScoreToFilter).toBeVisible();
        await this.sentimentScoreFilterSelectAllButton.click();
        await this.sentimentScoreFilterSelectAllButton.click();
        await this.applySelectedScoreToFilter.click();
    }

    async verifyScoreInRange(scoreRangeButton: any, highestScoreButton: any, lowestScoreButton: any, min: number, max: number) {
        await this.page.waitForTimeout(2000)
        await this.sentimentChartScoreSelector.click();
        await scoreRangeButton.click();
        await expect(this.applySelectedScoreToFilter).toBeVisible();
        await this.applySelectedScoreToFilter.click();
        await this.page.waitForTimeout(7000);
    
        await expect(highestScoreButton).toBeVisible();
        const highestScoreText = await highestScoreButton.innerText();
        const highestScore = parseInt(highestScoreText, 10);
        expect(highestScore).toBeGreaterThanOrEqual(min);
    
        const isLowestScoreButtonVisible = await lowestScoreButton.isVisible();
        if (isLowestScoreButtonVisible) {
            const lowestScoreText = await lowestScoreButton.innerText();
            const lowestScore = parseInt(lowestScoreText, 10);
            expect(lowestScore).toBeLessThanOrEqual(max);
        } else {
            console.log('Lowest score button not found. There might not be a fifth element on the dashboard page.');
        }
    
        if (scoreRangeButton !== this.sentimentScoreLessThan60) {
            this.clearScoresFromList();
        }
    }
    
    async verifyFilteredLocationsByScore() {
        await this.verifyScoreInRange(this.sentimentScore90to100, this.firstLocationOnListScoreButton, this.lastLocationOnListScoreButton, 90, 100);
        await this.verifyScoreInRange(this.sentimentScore80To89, this.firstLocationOnListScoreButton, this.lastLocationOnListScoreButton, 80, 89);
        await this.verifyScoreInRange(this.sentimentScore70To79, this.firstLocationOnListScoreButton, this.lastLocationOnListScoreButton, 70, 79);
        await this.verifyScoreInRange(this.sentimentScore60To69, this.firstLocationOnListScoreButton, this.lastLocationOnListScoreButton, 60, 69);
        await this.verifyScoreInRange(this.sentimentScoreLessThan60, this.firstLocationOnListScoreButton, this.lastLocationOnListScoreButton, 0, 59);
    }

    async clickOnExportReport() {
        const downloadPath = 'testsDownloads/report.csv';

        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.sentimentChartExportReport.click() 
        ]);

        await download.saveAs(downloadPath);
    }

    async clickOnExportFeedReport() {
        const downloadPath = 'testsDownloads/report.csv';

        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.exportFeedButton.click() 
        ]);

        await download.saveAs(downloadPath);
    }

    async verifyThemesColumnShow() {
        await expect(this.themeBeveragesColumnSelector).toBeVisible();
        await expect(this.themeCovidPolicyColumnSelector).toBeVisible();
        await expect(this.themeFacilitiesColumnSelector).toBeVisible();
        await expect(this.themeFoodColumnSelector).toBeVisible();
        await expect(this.themePricingColumnSelector).toBeVisible();
        await expect(this.themeServiceAndStaffColumnSelector).toBeVisible();
        await expect(this.themeWaitTimeColumnSelector).toBeVisible();
    }

    async verifyThemesSelectorOnLocationDashboard() {
        await expect(this.editThemesColumn).toBeVisible();
        await this.editThemesColumn.click();
        await this.verifyThemesColumnShow();
        await expect(this.resetThemesColumnButton).toBeVisible();
        await expect(this.applyThemeSelectionButton).toBeVisible(); 
    }

    async removeAllThemesFromDashboard() {
        await this.editThemesColumn.click();
        await this.verifyThemesColumnShow();
        await this.themeBeveragesColumnSelector.click();
        await this.themeCovidPolicyColumnSelector.click();
        await this.themeFacilitiesColumnSelector.click();
        await this.themeFoodColumnSelector.click();
        await this.themePricingColumnSelector.click();
        await this.themeServiceAndStaffColumnSelector.click();
        await this.applyThemeSelectionButton.click();
    }

    async verifyThemesColumnHide() {
        await expect(this.themeBeveragesColumn).not.toBeVisible();
        await expect(this.themeCovidPolicyColumn).not.toBeVisible();
        await expect(this.themeFacilitiesColumn).not.toBeVisible();
        await expect(this.themeFoodColumn).not.toBeVisible();
        await expect(this.themePricingColumn).not.toBeVisible();
        await expect(this.themeServiceAndStaffColumn).not.toBeVisible();
    }

    async resetThemeColumn() {
        await this.editThemesColumnAfterHiding.click();
        await this.verifyThemesColumnShow();
        await this.resetThemesColumnButton.click()
    }

    async verifyThemesColumnAreVisible() {
        await expect(this.themeBeveragesColumn).toBeVisible();
        await expect(this.themeCovidPolicyColumn).toBeVisible();
        await expect(this.themeFacilitiesColumn).toBeVisible();
        await expect(this.themeFoodColumn).toBeVisible();
        await expect(this.themePricingColumn).toBeVisible();
        await expect(this.themeServiceAndStaffColumn).toBeVisible();
    }
    async hideRandomColumns() {
        const columnMap = new Map([
            [this.themeBeveragesColumn, this.themeBeveragesColumnSelector],
            [this.themeCovidPolicyColumn, this.themeCovidPolicyColumnSelector],
            [this.themeFacilitiesColumn, this.themeFacilitiesColumnSelector],
            [this.themeFoodColumn, this.themeFoodColumnSelector],
            [this.themePricingColumn, this.themePricingColumnSelector],
            [this.themeServiceAndStaffColumn, this.themeServiceAndStaffColumnSelector]
        ]);

        const columns = Array.from(columnMap.keys());
        const shuffledColumns = columns.sort(() => Math.random() - 0.5);
        const columnsToHide = shuffledColumns.slice(0, 2);

        this.verifyThemesSelectorOnLocationDashboard();
        for (const column of columnsToHide) {
            console.log("Hiding column: ", column);
            await columnMap.get(column).click();
        }
        await this.applyThemeSelectionButton.click();

        for (const column of columnsToHide) {
            console.log("Verifying column is hidden: ", column);
            await expect(column).not.toBeVisible();
        }
    }
    


    
}