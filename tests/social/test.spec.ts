import { expect, test } from "@playwright/test";
import { testConfig } from "../../testconfig.config";
import { PageManager } from "../../pages/pageManager";

test.beforeEach("Given user navigates to Social", async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}`, { waitUntil: "domcontentloaded" });
  console.log(`${process.env.BASE_URL}`);
});

test.describe("Enviroment Test", async () => {
  test(`Environment Test @environmentTest`, async ({
    page,
  }) => {
    /**
     *Scenario: Delete a Social Post
     *  Given user is on the social posts page
     *  And a social post exists
     *  When user removes the post
     *  Then the post is deleted correctly
     */
    const pm = new PageManager(page);
  });
});
