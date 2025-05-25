import { Page, Locator } from 'playwright';
import assert from 'assert';
import * as XLSX from 'xlsx';
import { expect } from '@playwright/test';
import { xlsxExpectedColumns } from '../reporting/reportingData/reportsExpectedColumns';


export default class DashboardPage {
    page: Page;
    static url = '/dashboard';
    dashboardActivityFeed: Locator;
    duplicateSuppressionWidget: Locator;
    profileCompletenessWidget: Locator;
    listingHealthWidget: Locator;
    averageRatingWidget: Locator;
    averageRatingActivityWidget: Locator;
    reviewAnalysisWidget: Locator;
    feedbackActivityWidget: Locator;
    facebookImpressionsWidget: Locator;
    facebookClicksWidget: Locator;
    googleImpressionsMapsWidget: Locator;
    googleImpressionsSearchWidget: Locator;
    googleClicksWidget: Locator;
    reviewAnalysisArrowLeftButton: Locator;
    reviewAnalysisArrowRightButton: Locator;
    downloadExcel: Locator;
    creatingReportLabel: Locator;
    datePickerButton: Locator;
    dateContainer: Locator;
    applyDatesToDatePickerButton: Locator;
    cancelDateOnDatePickerButton: Locator;
    clearFiltersButton: Locator;
    homeDashboardSideLink: Locator;
    locationFilterTextbox: Locator;
    locationSearchButton: Locator;
    setDateFilterButton: Locator;
    datePickerPresetsOpen: Locator;
    last12MonthsDateOption: Locator;
    datePickerApplyButton: Locator;
    exportExcelFileButton: Locator;
    creatingReportLoader: Locator;
    googleBookingsWidget: Locator;
    resultsFound: Locator;

    private initialWidgetData: { [key: string]: string | null } = {};
    private readonly widgetIds = [
        '#average-rating-widget',
        '#rating-history-widget',
        '#customer-feedback-keywords-widget',
        '#customer-feedback-replies-widget',
        '#reviews-activity-widget',
        '#facebook-views-widget',
        '#facebook-clicks-widget',
        '#google-clicks-widget'
    ];

    constructor(page: Page) {
        this.page = page;
        this.dashboardActivityFeed = page.locator("//div[@class='activity-feed-scroll-wrapper']");
        this.duplicateSuppressionWidget = page.locator("#suppressed-duplicates-widget");
        this.profileCompletenessWidget = page.locator("#profile-completeness-widget");
        this.listingHealthWidget = page.locator("#listing-health-widget");
        this.averageRatingWidget = page.locator("#average-rating-widget");
        this.averageRatingActivityWidget = page.locator("#rating-history-widget");
        this.reviewAnalysisWidget = page.locator("#customer-feedback-keywords-widget");
        this.feedbackActivityWidget = page.locator("#reviews-activity-widget");
        this.facebookImpressionsWidget = page.locator("#facebook-views-widget");
        this.facebookClicksWidget = page.locator("#facebook-clicks-widget");
        this.googleImpressionsMapsWidget = page.locator("#google-impressions-maps-widget");
        this.googleImpressionsSearchWidget = page.locator("#google-impressions-search-widget");
        this.googleClicksWidget = page.locator("#google-clicks-widget");
        this.reviewAnalysisArrowLeftButton = page.locator("//*[@class='customerFeedbackKeywordsWidgetArrowLeft']");
        this.reviewAnalysisArrowRightButton = page.locator("//*[@class='customerFeedbackKeywordsWidgetArrowRight']");
        this.downloadExcel = page.locator("(//span[contains(text(),'Excel')])[1]");
        this.creatingReportLabel = page.locator("//span[contains(text(),'Creating report...')]");
        this.datePickerButton = page.locator("//*[@class='time-range-picker-button']");
        this.dateContainer = page.locator("//*[@class='time-range-picker-filter-container']");
        this.applyDatesToDatePickerButton = page.locator("//span[contains(text(),'Apply')]");
        this.cancelDateOnDatePickerButton = page.locator("//span[contains(text(),'Cancel')]");
        this.clearFiltersButton = page.locator("//span[contains(text(),'clear')]");
        this.homeDashboardSideLink = page.getByRole('link', { name: 'Dashboard', exact: true });
        this.locationFilterTextbox = page.getByPlaceholder('Choose a location');
        this.locationSearchButton = page.getByText('Search', { exact: true });
        this.setDateFilterButton = page.getByTestId('ZNT-date-double_open-picker');
        this.datePickerPresetsOpen = page.getByTestId('ZNT-date-double-presets_select-wrapper').locator('svg');
        this.last12MonthsDateOption = page.getByTestId('2');
        this.datePickerApplyButton = page.getByRole('button', { name: 'Apply' });
        this.exportExcelFileButton = page.getByRole('button', { name: 'Excel' });
        this.creatingReportLoader = page.getByRole('button', { name: 'Creating report...' });
        this.googleBookingsWidget = page.locator('#google-business-bookings-widget');
        this.resultsFound = page.getByText('Results:1 locationClosed &');
    }

    async goTo() {
        const fullUrl = `${process.env.BASE_URL}${DashboardPage.url}`;
        console.log(`Navigating to URL: ${fullUrl}`);
        await this.page.goto(DashboardPage.url, { waitUntil: "domcontentloaded" });
        await this.isAt();
    }

    async isAt(): Promise<boolean> {
        await Promise.race([
            this.dashboardActivityFeed.waitFor({state: 'visible'}),
            this.datePickerButton.first().waitFor({state: 'visible'}),
        ])
        return true
    }

    async navigateToHomeDashboard() {
        await expect(this.homeDashboardSideLink).toBeVisible();
        await this.homeDashboardSideLink.click();
    }

    async verifyDashboardLoad() {
        const elements = [
            this.locationFilterTextbox,
            this.locationSearchButton,
            this.clearFiltersButton,
            this.setDateFilterButton,
            this.exportExcelFileButton,
            this.averageRatingWidget,
            this.averageRatingActivityWidget,
            this.reviewAnalysisWidget,
            this.feedbackActivityWidget,
            this.facebookImpressionsWidget,
            this.facebookClicksWidget,
            this.googleImpressionsMapsWidget,
            this.googleImpressionsSearchWidget,
            this.googleClicksWidget,
            this.googleBookingsWidget
        ];

        for (const element of elements) {
            await expect(element).toBeVisible();
        }
    }

    async filterByLocation(location: string) {
        await this.locationFilterTextbox.fill(location);
        await this.locationSearchButton.click();
        await expect(this.resultsFound).toBeVisible();
    }

    async filterByDate() {
        await expect(this.setDateFilterButton).toBeVisible();
        await this.setDateFilterButton.click();
        await expect(this.datePickerPresetsOpen).toBeVisible();
        await this.datePickerPresetsOpen.click();
        await expect(this.last12MonthsDateOption).toBeVisible();
        await this.last12MonthsDateOption.click();
        await expect(this.datePickerApplyButton).toBeVisible();
        await this.datePickerApplyButton.click();
        await this.page.waitForTimeout(5000);
    }

    async clickOnDownloadYourMetrics() {
        await expect(this.exportExcelFileButton).toBeVisible();
        const downloadPath = 'testsDownloads/metrics.xlsx';

        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.exportExcelFileButton.click()
        ]);
        await download.saveAs(downloadPath);
    }

    async validateExcelFile(path: string) {
        const workbook = XLSX.readFile(path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (data.length < 3) {
            throw new Error('Excel file does not have enough rows');
        }

        const actualColumns = data[0];
        assert.deepStrictEqual(actualColumns, xlsxExpectedColumns, 'Column names do not match');

        const row = data[2];
        const requiredColumns = ["Location id", "Location name", "Address", "Average rating", "Total ratings"];

        requiredColumns.forEach((column, index) => {
            const columnIndex = actualColumns.indexOf(column);
            if (columnIndex === -1) {
                throw new Error(`Column "${column}" is missing`);
            }
            assert(row[columnIndex], `Row 3 is missing data for "${column}"`);
        });
    }

    async storeWidgetData() {
        for (const widgetId of this.widgetIds) {
            this.initialWidgetData[widgetId] = await this.page.locator(widgetId).innerText();
        }
    }

    async compareWidgetData(): Promise<boolean> {
        let allDataChanged = true;
        for (const widgetId of this.widgetIds) {
            const currentWidgetData = await this.page.locator(widgetId).innerText();
            console.log(`Previous data for ${widgetId}:`, this.initialWidgetData[widgetId]);
            console.log(`Current data for ${widgetId}:`, currentWidgetData);
            if (this.initialWidgetData[widgetId] === currentWidgetData) {
                allDataChanged = false;
            }
        }
        return allDataChanged;
    }

    async verifyDataChangesOnWidgets(): Promise<boolean> {
        await this.storeWidgetData();
        await this.filterByDate();
        return await this.compareWidgetData();
    }
}

export { DashboardPage };