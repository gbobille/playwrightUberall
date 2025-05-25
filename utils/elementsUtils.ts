import { Page, expect, Locator } from "@playwright/test";

//shouldn't we delegate the responsibility of validation to each page? I think abstracting this much complicates the navigation thru the project
export default class ElementsHelpers {
    async validateElementText(text, element) {
        await expect(element).toHaveText(text)
    }
}