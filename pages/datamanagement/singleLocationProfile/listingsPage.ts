import { Locator, Page} from "@playwright/test";

export default class LocationListings { 
    facebookText: Locator
    openFacebook: Locator
    instagramText: Locator
    openInstagram: Locator
    trustPilotText: Locator
    openTrustPilot: Locator
    googleText: Locator
    openGoogle: Locator

    constructor(page: Page) {
        this.facebookText = page.getByText('Facebook')
        this.openFacebook = page.getByTestId('open-url-99033852').getByRole('img')
        this.instagramText = page.getByText('Instagram')
        this.openInstagram = page.getByTestId('open-url-99033771').getByRole('img')
    }
}