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
*  Create for Social Post: facebook
**/

test.describe("Create a Social Post: Facebook", async () => {  
    const testTitle: string = "AUTO_FB_POST_" + Date.now()
    const testDescription: string = "AutoTest_Description_" + Date.now()
    const businessName = "Bike Racks Smart Conversation"

    test(`Check the Facebook post preview is displayed correctly @engageregression @social`, async ({ page }) => {
    /** 
        * Scenario: Create a Social Post Facebook
	    *   Given user is on the social posts page
	    *   When user creates a Facebook social post
	    *   Then the Facebook post preview is displayed correctly
	    *   And the Facebook post is saved correctly
        */
    
        const pm = new PageManager(page)

        await test.step("When user creates a Facebook social post", async () => {
            await pm.social().openSocialPages()
            await pm.social().clickNewPostButton()
            await pm.social().clickCreateNewPostButton()
            await pm.social().clickFacebookButton()
        })
    
        await test.step("And user select the Facebook Brand Page to Publish", async () => {
            await pm.social().checkPublishToTheFacebookCheckbox()
            await pm.social().clickChooseBrandPageDropdown()
            await pm.social().chooseBrandPage()
        })

        await test.step("And user select the Facebook Post Type", async () => {
            await pm.social().selectFacebookPostType()
        })

        await test.step("And user select the Facebook Post Type", async () => {
            await pm.social().clickAddLocationsButton()
            await pm.social().clickSeachBusiness()
            await pm.social().selectBusiness(businessName)
            await pm.social().clickSelectedLocation()
            await pm.social().clickSelectButton()
        })
    
        await test.step("And user Add Image to post", async () => {
            await pm.social().clickAddMediaButton()  
            await pm.social().uploadMedia("Test_Image_01.jpg")
        })
    
        await test.step("Then the Facebook post preview is displayed correctly", async () => {
            await pm.social().verifyPostPreviewDisplayed("Facebook")
        })

        await test.step("When user add Post Content Title and Description", async () => {
            await pm.social().addTitlePostContent(testTitle)
            await pm.social().addDescriptionPostContent(testDescription)
        })   

        await test.step("And user Post the new Facebook", async () => {
            await pm.social().clickOnScheduleForLaterButton()
            await pm.social().clickOnPostNowButton()
        })   
    
        await test.step("Then the Facebook Post successfully scheduled", async () => {
            await page.waitForLoadState();
            await expect.soft(pm.social().successMessage).toHaveText("Post successfully scheduled")
            await expect.soft(page.getByText(testTitle)).toBeVisible();
            await expect.soft(page.getByText(testDescription)).toBeVisible();
        })
    })

    test(`Check the user able to Edit an Facebook Post successfully @engageregression @social`, async ({ page }) => {
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
        
        await test.step("And user select a social post to be edited", async () => {
            const NewPost = page.getByText(testTitle)
            await expect.soft(NewPost).toBeVisible()
            await pm.social().clickonEditButton(testTitle, 'Edit')
        })

        await test.step("And user edit the date and Publish now", async () => {
            await pm.social().clickPublicationDateButton()
            await pm.social().clickPublishNowButton()
        })

        await test.step("And user save changes of the edited social post", async () => {
            await pm.social().clickSaveChangesButton()
        }) 
        
        await test.step("Then check the Post edited successfully", async () => {
            await page.waitForLoadState();
            await expect.soft(pm.social().successMessage).toHaveText("Post successfully scheduled")
        })
    })

    test(`Check the user able to Remove an Facebook Post successfully @engageregression @social`, async ({ page }) => {
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
        
        await test.step("And user select a post to be deleted", async () => {
            const NewPost = page.getByText(testTitle)
            await expect.soft(NewPost).toBeVisible();
            await pm.social().clickonEditButton(testTitle, 'Remove')
        })

        await test.step("And user confirm the post to be deleted", async () => {
            await pm.social().clickConfirmNowButton()
        }) 

        await test.step("Then the Post successfully deleted", async () => {
            await page.waitForLoadState();
            await expect.soft(pm.social().successMessage).toHaveText("Post removed successfully")
        })

        await test.step("And the Post not present on the list of posts page", async () => {
            await page.waitForLoadState();
            await expect.soft(page.getByText(testTitle)).not.toBeVisible();
        })
    })
})

test.describe("Create a Social Post thru Calendar Tab: Facebook", async () => {
    const TitleCalendarPost: string = "AUTO_FB_POST_CAL_" + Date.now()
    const DescriptionCalendarPost: string = "AutoTest_Description_Cal_" + Date.now()
    
    test(`Create the Facebook post thru Calendar Tab @engageregression @social`, async ({ page }) => {
        /** 
            * Scenario: Create a Social Post Facebook
            *   Given user is on the social posts page
            *   When user creates a Facebook social post thru Calendar Tab
            *   Then the Facebook post preview is displayed correctly
            *   And the Facebook post is saved correctly
            */
        
        const pm = new PageManager(page)
    
        await test.step("When user creates a Facebook social post", async () => {
            await pm.social().openSocialPages()
            await pm.social().clickCalendarTabButton()
            await pm.social().clickNewPostButton()
            await pm.social().clickCreateNewPostButton()
            await pm.social().clickFacebookButton()
        })
        
        await test.step("And user select the Facebook Brand Page to Publish", async () => {
            await pm.social().checkPublishToTheFacebookCheckbox()
            await pm.social().clickChooseBrandPageDropdown()
            await pm.social().chooseBrandPage()
        })
    
        await test.step("And user select the Facebook Post Type", async () => {
            await pm.social().selectFacebookPostType()
        })
    
        await test.step("And user select the Facebook Post Type", async () => {
            await pm.social().clickAddLocationsButton()
            await pm.social().clickSeachBusiness()
            await pm.social().selectBusiness("Bike Racks Smart Conversation")
            await pm.social().clickSelectedLocation()
            await pm.social().clickSelectButton()
        })
        
        await test.step("And user Add Image to post", async () => {
            await pm.social().clickAddMediaButton()  
            await pm.social().uploadMedia("Test_Image_01.jpg")
        })
        
        await test.step("Then the Facebook post preview is displayed correctly", async () => {
            await pm.social().verifyPostPreviewDisplayed("Facebook")
        })
    
        await test.step("When user add Post Content Title and Description", async () => {
            await pm.social().addTitlePostContent(TitleCalendarPost)
            await pm.social().addDescriptionPostContent(DescriptionCalendarPost)
        })   
    
        await test.step("And user Post the new Facebook", async () => {
            await pm.social().clickOnScheduleForLaterButton()
            await pm.social().clickOnPostNowButton()
        })   
        
        await test.step("Then the Facebook Post successfully scheduled", async () => {
            await page.waitForLoadState();
            await expect.soft(pm.social().successMessage).toHaveText("Post successfully scheduled")
            await page.waitForLoadState();
            await pm.social().verifyPostPreviewDisplayedCalendar('FACEBOOK');
        })
    })

    test(`Edit Facebook Post in Calendar tab @engageregression @social`, async ({ page }) => {
        /** 
        *Scenario: Edit a Social Post
        *  Given user is on the social posts page
        *  And a social post exists
        *  When user edits the post thru Calendar Tab
        *  Then the post is edited correctly
        */
        
        const pm = new PageManager(page)

        await test.step("When user is on the social posts page", async () => {
            await pm.social().openSocialPages()
            await pm.social().clickCalendarTabButton()
        })  
        
        await test.step("And user select a social post to be edited", async () => {
            await pm.social().clickPostPreviewCalendarEvent("FACEBOOK")
        })

        await test.step("And user edit the date and Publish now", async () => {
            await pm.social().clickEditButton()
            await pm.social().clickPublicationDateButton()
            await pm.social().clickPublishNowButton()
        })

        await test.step("And user save changes the edited social post", async () => {
            await pm.social().clickSaveChangesButton()
        }) 
        
        await test.step("Then check the Post edited successfully", async () => {
            await page.waitForLoadState();
            await expect.soft(pm.social().successMessage).toHaveText("Post successfully scheduled")
        })
    })

    test(`Remove the Facebook Post in Calendar Tab @engageregression @social`, async ({ page }) => {
        /** 
        *Scenario: Delete a Social Post
        *  Given user is on the social posts page
        *  And a social post exists
        *  When user removes the post thru Calendar Tab
        *  Then the post is deleted correctly
        */
        
        const pm = new PageManager(page)
    
        await test.step("When user is on the social posts page", async () => {
            await pm.social().openSocialPages()
            await pm.social().clickCalendarTabButton()
        })  
        
        await test.step("And user select a post to be deleted", async () => {
            await pm.social().clickPostPreviewCalendarEvent("FACEBOOK")
            await pm.social().clickDeleteButton()
        })

        await test.step("And user confirm the post to be deleted", async () => {
            await pm.social().clickOnDeletePostButton()
        }) 

        await test.step("Then the Post successfully deleted", async () => {
            await page.waitForLoadState();
            await expect.soft(pm.social().successMessage).toHaveText("Post was successfully deleted")
        })
    })
})

