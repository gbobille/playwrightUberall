import { expect, test } from "@playwright/test";
import { testConfig } from "../../testconfig.config";
import { PageManager } from "../../pages/pageManager";
import Login from "../../pages/components/login";

test.beforeEach("Given user navigates to Social", async ({page}) => {
    const pm = new PageManager(page)
    
    await page.goto(`${process.env.BASE_URL}`)
    const login = new Login(page)
    await login.goto()
    await login.userLogin(process.env.QA_ENGAGE_USER, process.env.QA_P_OLDNAV)
    })

/**
*  Create for Social Post: Google News
**/
test.describe("Create a Social Post: Google News", async () => {  

    let testTitle: string = "AUTO_GOOGLE_POST_" + Date.now()
    let testDescription: string = "Auto_Google_Desc_" + Date.now()

    test(`Check the Google News post preview is displayed correctly`, async ({ page }) => {
    /** 
        * Scenario: Create a Social Post Google News
	    *   Given user is on the social posts page
	    *   When user creates a Google News social post
	    *   Then the news post preview is displayed correctly
	    *   And the news post is saved correctly
        */
    
        const pm = new PageManager(page)

        await test.step("When user creates a Google post", async () => {
            await pm.social().openSocialPages()
            await pm.social().clickNewPostButton()
            await pm.social().clickCreateNewPostButton()
            await pm.social().clickGoogleButton()
        })

        await test.step("When user select the Google Post Type", async () => {
            await pm.social().selectNewsGooglePostType()
        })

        await test.step("When user select the Google Post Type", async () => {
            await pm.social().clickAddLocationsButton()
            await pm.social().clickSeachBusiness()
            await pm.social().selectBusiness("Bike Racks Smart Conversation")
            await pm.social().clickSelectedLocation()
            await pm.social().clickSelectButton()
        })
    
        await test.step("When user Add Image to post", async () => {
            await pm.social().clickAddMediaButton()  
            await pm.social().uploadMedia("Test_Image_01.jpg")
        })
    
        await test.step("Then Google post preview is displayed correctly", async () => {
            await pm.social().addTitlePostContent(testTitle)
            await pm.social().addDescriptionPostContent(testDescription)
        })

        await test.step("When user Post the new Google", async () => {
            await pm.social().clickOnScheduleForLaterButton()
            await pm.social().clickOnPostNowButton()
        })   
    
        await test.step("Then the Google Post successfully scheduled", async () => {
            await page.waitForLoadState();
            await expect.soft(page.getByText(testTitle)).toBeVisible();
            await expect.soft(page.getByText(testDescription)).toBeVisible();
            await expect.soft(pm.social().successMessage).toHaveText("Post successfully scheduled")
        })

        // await test.step("Then the Google Post is scheduled on the list of posts page", async () => {
        //     await page.waitForLoadState();
        //     await expect.soft(page.getByText(testTitle)).toBeVisible();
        //     await expect.soft(page.getByText(testDescription)).toBeVisible();
        // })
    })

    test(`Check the user able to Edit a Google Post successfully`, async ({ page }) => {
        /** 
        *Scenario: Edit a Social Post
        *  Given user is on the social posts page
        *  And a social post exists
        *  When user edits the post
        *  Then the post is edited correctly
        */
        
        const pm = new PageManager(page)

        await test.step("When user is on the social posts page", async () => {
            await pm.social().openSocialPages()
        })  
        
        await test.step("When user select a social post to be edited", async () => {
            const NewPost = page.getByText(testTitle)
            await expect.soft(NewPost).toBeVisible()
            await pm.social().clickonEditButton(testTitle, 'Edit')
        })

        await test.step("When user edit the date and Publish now", async () => {
            await pm.social().clickPublicationDateButton()
            await pm.social().clickPublishNowButton()
        })

        await test.step("When user save changes the edited social post", async () => {
            // await pm.social().clickSubmitButton()
            await pm.social().clickSaveChangesButton()
        }) 
        
        await test.step("Then check the Post edited successfully", async () => {
            await page.waitForLoadState();
            await expect.soft(pm.social().successMessage).toHaveText("Post successfully scheduled")
        })
    })

    test(`Check the user able to Remove the Google Post successfully`, async ({ page }) => {
        /** 
        *Scenario: Delete a Social Post
        *  Given user is on the social posts page
        *  And a social post exists
        *  When user removes the post
        *  Then the post is deleted correctly
        */
        
        const pm = new PageManager(page)
    
        await test.step("When user is on the social posts page", async () => {
            await pm.social().openSocialPages()
        })  
        
        await test.step("When user select a post to be deleted", async () => {
            const NewPost = page.getByText(testTitle)
            await expect.soft(NewPost).toBeVisible();
            await pm.social().clickonEditButton(testTitle, 'Remove')
        })

        await test.step("When user confirm the post to be deleted", async () => {
            await pm.social().clickConfirmNowButton()
        }) 

        await test.step("Then the Post successfully deleted", async () => {
            await page.waitForLoadState();
            await expect.soft(pm.social().successMessage).toHaveText("Post removed successfully")
        })

        await test.step("Then the Post not present on the list of posts page", async () => {
            await page.waitForLoadState();
            await expect.soft(page.getByText(testTitle)).not.toBeVisible();
        })
    })
})

