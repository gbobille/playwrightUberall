import {Locator, Page} from 'playwright'
import {ReactSelectUtils} from "../../../utils/reactSelectUtils"
import {StatusCheck} from "../../../models/listings/statusCheckModel"

class WhitelabelStatusCheckPage {
    page: Page
    static url = "/check/qatestpartner"
    private checkNowButton: Locator
    private country: Locator
    private name: Locator
    private street: Locator
    private zip: Locator
    private listingRow: Locator
    private listingDirectory: Locator
    private listingStatus: Locator
    private directoryStatus: Locator
    private pdfDownloadButton: Locator
    private pdfDownloadSpinner: Locator
    private loadingAnimation: Locator
    private addressBox: Locator

    constructor(page: Page) {
        this.page = page
        // Status Check Search
        this.checkNowButton = page.locator("//input[contains(@class, 'status-check-button')]")
        this.country = page.locator("//div[contains(@class, 'country-dropdown')]")
        this.name = page.locator("//input[@name='name']")
        this.street = page.locator("//input[@name='street']")
        this.zip = page.locator("//input[@name='zip']")
        // Not Managed By Us
        this.listingRow = page.locator("//div[@class =  'ubsc_unmanaged-results-table-box']//div[contains(@class, 'ubsc_result-listing-row')]")
        this.listingDirectory = page.locator("//div[@class = 'ubsc_results-table-cell ubsc_directory-cell']//img")
        this.listingStatus = page.locator("//div[@class = 'ubsc_results-table-cell ubsc_address-cell']/div")
        this.directoryStatus = page.locator("//div[@class = 'ubsc_results-table-cell ubsc_status-cell']//img")
        this.pdfDownloadButton = page.locator("#ubsc_pdf-export-link")
        this.pdfDownloadSpinner = page.locator("//div[@class = 'ubsc_pdf-export-wrapper']//div[@class = 'ubsc_spinner-animation']")
        // Loading Animation Modal
        this.loadingAnimation = page.locator("//div[contains(@class, 'loading-animation-modal')]//div[contains(@class, 'animation-progress')]")
        // Managed By Us
        this.addressBox = page.locator("//div[@class = 'ubsc_address-box']")
    }

    async goto(url: string) {
        await this.page.goto(url, {waitUntil: 'networkidle'})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        return await this.checkNowButton.isVisible() ||
            await this.listingRow.isVisible() ||
            await this.addressBox.isVisible()
    }

    async addStatusCheckInfo(statusCheck: StatusCheck): Promise<void> {
        await ReactSelectUtils.selectOptionByName(this.page, this.country, statusCheck.country)
        await this.name.fill(statusCheck.name)
        await this.street.fill(statusCheck.street)
        await this.zip.fill(statusCheck.zip)
    }

    async performStatusCheck(statusCheck: StatusCheck): Promise<void> {
        await this.addStatusCheckInfo(statusCheck)
        await this.checkNowButton.click()
        await this.loadingAnimation.isVisible()
        await this.loadingAnimation.waitFor({state: 'hidden', timeout: 60000})
    }

    async getAllDirectoriesManagedByOthers(): Promise<Array<{ type: string, status: string }>> {
        await this.listingDirectory.first().waitFor({state: 'visible'})
        await this.listingStatus.first().waitFor({state: 'visible'})

        const directories = await this.listingDirectory.elementHandles()
        const statuses = await this.listingStatus.elementHandles()

        return Promise.all(directories.map(async (directory, i) => ({
            type: (await directory.getAttribute('src'))?.split("png/").pop()?.split(".")[0] || '',
            status: await statuses[i].textContent() || ''
        })))
    }

    async getDirectoryElementsManagedByUs(): Promise<Array<{ type: string, status: string }>> {
        await this.listingDirectory.first().waitFor({state: 'visible'})
        const listingElements: Array<{ type: string, status: string }> = []
        const directories = await this.listingDirectory.elementHandles()
        const statuses = await this.directoryStatus.elementHandles()

        for (let i = 0; i < directories.length; i++) {
            const type = (await directories[i].getAttribute('src'))?.split("png/").pop()?.split(".")[0] || ''
            const status = (await statuses[i].getAttribute('src'))?.split(".svg")[0].split("_")[1] || ''
            listingElements.push({type, status})
        }
        return listingElements
    }

    async getManagedListingInformation(): Promise<StatusCheck> {
        const text = await this.addressBox.innerText()
        const lines = text.split('\n').map(line => line.trim())
        const name = lines[0]
        const street = lines[2]
        const zip = lines[3].split(' ')[0] || ''

        return {
            country: ' ',
            name,
            street,
            zip
        }
    }

    async downloadStatusCheckPdf(): Promise<void> {
        await this.pdfDownloadButton.waitFor({state: 'visible'})
        await this.pdfDownloadButton.click()
        await this.pdfDownloadSpinner.waitFor({state: 'visible'})
        await this.pdfDownloadSpinner.waitFor({state: 'hidden'})
        await this.pdfDownloadButton.waitFor({state: 'visible'})
    }
}

export {WhitelabelStatusCheckPage}
