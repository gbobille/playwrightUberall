import {Locator, Page} from 'playwright'

// This class is used to interact with React Select dropdowns
class ReactSelectUtils {
    private static inputBox: (page: Page, nav: Locator) => Locator
    private static select: (page: Page, num: number, nav: Locator) => Locator
    private static optionSelect: (page: Page) => Locator


/** Initializes the elements so they can be used in the class without having to initialize them in every function */
    private static initializeConstructorElements() {
        this.inputBox = (page: Page, nav: Locator) => nav.locator('input[role]')
        this.select = (page: Page, num: number, nav: Locator) => nav.locator(`div[id*='option-${num}']`)
        this.optionSelect = (page: Page) => page.locator("//div[@class='Select-option']")
    }
    /** Selects the nth element of a React select dropdown */
    static async selectOption(page: Page, nav: Locator, optionNum?: number): Promise<void> {
        this.initializeConstructorElements()
        await nav.click()

        if (optionNum !== undefined) {
            await this.select(page, optionNum, nav).waitFor({timeout: 10000})
            await this.select(page, optionNum, nav).click()
        }
    }

    /** Selects a specific element of a React select dropdown by String */
    static async selectOptionByName(page: Page, nav: Locator, name: string, optionNum = 0): Promise<void> {
        this.initializeConstructorElements()
        await nav.click()
        const inputBox = this.inputBox(page, nav)
        await inputBox.fill(name)
        try {
            const selectOption = this.select(page, optionNum, nav)
            const selectWithoutIdOption = this.optionSelect(page)

            // Wait for either selectOption or selectWithoutIdOption to appear
            await Promise.race([
                selectOption.waitFor({timeout: 20000}),
                selectWithoutIdOption.waitFor({timeout: 20000})
            ])

            // Click the visible option
            if (await selectOption.isVisible()) {
                await selectOption.click()
            } else if (await selectWithoutIdOption.isVisible()) {
                await selectWithoutIdOption.click()
            }
        } catch {
            await inputBox.press('Backspace')
            const selectOption = this.select(page, optionNum, nav)
            const selectWithoutIdOption = this.optionSelect(page)

            // Wait for either selectOption or selectWithoutIdOption to appear
            await Promise.race([
                selectOption.waitFor({timeout: 20000}),
                selectWithoutIdOption.waitFor({timeout: 20000})
            ])

            // Click the visible option
            if (await selectOption.isVisible()) {
                await selectOption.click()
            } else if (await selectWithoutIdOption.isVisible()) {
                await selectWithoutIdOption.click()
            }
        }
    }
}

export {ReactSelectUtils}