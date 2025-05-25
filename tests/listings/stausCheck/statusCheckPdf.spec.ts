import {test} from '../../setup'
import {WhitelabelStatusCheckPage} from '../../../pages/listings/statusCheck/whitelabelStatusCheckPage'
import {StatusCheck} from '../../../models/listings/statusCheckModel'
import * as fs from 'fs'
import {format} from 'date-fns';
import {expect} from "@playwright/test"
import path from "path"

let whitelistStatusCheckPage: WhitelabelStatusCheckPage

const downloadPath = path.resolve(__dirname, '../../../downloads')
const STATUS_CHECK_PDF_FILE = path.join(downloadPath, `status_report-Santorini-${format(new Date(), 'yyyyMMdd')}.pdf`);
const minimalFileSize = 10000

const statusCheckByOthers = new Map<string, string>([
    ["country", "Germany"],
    ["name", "Santorini"],
    ["street", "Cauerstraße 28"],
    ["zip", "10587"]
])
const STATUS_CHECK_VALUES1 = new StatusCheck(
    statusCheckByOthers.get("country") ?? "",
    statusCheckByOthers.get("name") ?? "",
    statusCheckByOthers.get("street") ?? "",
    statusCheckByOthers.get("zip") ?? ""
)

test.beforeEach(async ({page}) => {
    whitelistStatusCheckPage = new WhitelabelStatusCheckPage(page)
    // Creates the download directory if it does not exist
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, {recursive: true})
    }
})

test.describe('Whitelabel Status Check: Check for Status Check PDF download size', () => {

    test('Whitelabel Status Check: Check for Status Check PDF download size @Listings_schedule', async ({page, step}) => {
        await step('Given: a Status Check is performed ', async () => {
            await whitelistStatusCheckPage.goto(WhitelabelStatusCheckPage.url)
            await whitelistStatusCheckPage.performStatusCheck(STATUS_CHECK_VALUES1)
        })

        await step('When: The export PDF is downloaded', async () => {

            const [download] = await Promise.all([
                page.waitForEvent('download'),
                whitelistStatusCheckPage.downloadStatusCheckPdf()
            ])
            const filePath = path.join(downloadPath, download.suggestedFilename())
            await download.saveAs(filePath)
            console.log(`File downloaded to: ${filePath}`)
        })

        await step('Then: the file is downloaded correctly', async () => {
            const pdfFileExists = fs.existsSync(STATUS_CHECK_PDF_FILE)
            expect(pdfFileExists).toBe(true)
        })

        await step('And: the file needs to be larger than minimalFileSize KB', async () => {
            const pdfFileSize = fs.statSync(STATUS_CHECK_PDF_FILE).size
            expect(pdfFileSize).toBeGreaterThan(minimalFileSize)
        })
    })

    test.afterAll(() => {
        // Deletes the downloaded file if it exists
        if (fs.existsSync(STATUS_CHECK_PDF_FILE)) {
            fs.unlinkSync(STATUS_CHECK_PDF_FILE)
        }
    })
})
