import { Page } from "@playwright/test"

export default class getIDFromURL {
    static async getLocationIDFromURL(page:Page) {
        var url = await page.url()
        var locationId = url.match(/\d+/)
        var result = locationId.map(function (x) {
            return parseInt(x,10)
        })
        return result
    }
}