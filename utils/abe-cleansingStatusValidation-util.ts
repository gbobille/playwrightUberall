import { Page } from "@playwright/test";

export async function validateCleansingStatus(page:Page, customHeaders:any, locationID:any) {
    await page.setExtraHTTPHeaders(customHeaders);
    await page.goto(`${process.env.BASE_URL}/en/admin/location/show/${locationID}`, {timeout:90000})
    
    //In case the cleansed notification doesn't get to uberall, execute the cleanse manually
    if (await page.getByText('Cleansing StatusCLEANSED').isVisible() == false) {
        await page.locator('button[name="cleanse"]').click()
    }
    
    await page.waitForTimeout(5000); // Wait for 5 seconds
    const response = await page.getByText('Cleansing StatusCLEANSED').isVisible()
    return response
}