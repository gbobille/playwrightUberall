import { Page } from "@playwright/test"
import * as path from 'path';

export default class uploadFileUtil {
    static async uploadFile(page:Page, element:string, filePath:string, fileName:string) {
        const dropFileArea = (locator : string) => page.locator(locator)
        await dropFileArea(element).setInputFiles(path.resolve(__dirname, `../tests/testData/${filePath}/${fileName}`));
    }
}