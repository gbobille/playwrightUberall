import { Locator, Page, expect } from "@playwright/test";

export default class ProfileSuggestion {
    googlePhotoSuggestion: Locator
    googlePhotoExpanded: Locator

    constructor(private page: Page) {
        this.googlePhotoSuggestion = page.locator('.data-review-diff-img').first()
        this.googlePhotoExpanded = page.locator('.photo-carousel-item > .data-review-select-image > .data-review-diff-img').first()
    }
}