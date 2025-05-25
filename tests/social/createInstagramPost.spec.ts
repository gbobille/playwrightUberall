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
*  Create for Social Post Instagram
**/
test.describe("Create a Social Post Instagram", async () => {  

   const testTitle: string = "AUTO_IG_POST_" + Date.now()
   const testDescription: string = "AutoTest_Description_" + Date.now()

   test(`Check the Instagram post preview is displayed correctly @engageregression @social`, async ({ page }) => {
      /** 
      * Scenario: Create a Social Post Instagram
	   *     Given user is on the social posts page
	   *     When user creates an Instagram social post
	   *     Then the Instagram post preview is displayed correctly
	   *     And the Instagram post is saved correctly
      */
      
      const pm = new PageManager(page)

      await test.step("When user creates an Instagram social post", async () => {
         await pm.social().openSocialPages()
         await pm.social().clickNewPostButton()
         await pm.social().clickCreateNewPostButton()
         await pm.social().clickInstagramButton()
      })
      
      await test.step("And user select the Instagram Handle(s)", async () => {
         await pm.social().selectInstagramHandles("salgo_en_bici")
      })
         
      
      await test.step("And user select the Instagram Post Type", async () => {
         await pm.social().selectInstagramPostType()
      })
      
      await test.step("And user Add Image to post", async () => {
         await pm.social().clickAddMediaButton()  
         await pm.social().uploadMedia("Test_Image_01.jpg")
      })

      await test.step("Then the Instagram post preview is displayed correctly", async () => {
         await pm.social().verifyPostPreviewDisplayed("Instagram")
      })
      
      await test.step("When user add Post Content Title and Description", async () => {
         await pm.social().addTitlePostContent(testTitle)
         await pm.social().addDescriptionPostContent(testDescription)
      })

      await test.step("And user Post in Instagram", async () => {
         await pm.social().clickOnScheduleForLaterButton()
            await pm.social().clickOnPostNowButton()
      })   
   
      await test.step("Then the Instagram Post successfully scheduled", async () => {
         await page.waitForLoadState();
         await expect.soft(pm.social().successMessage).toHaveText("Post successfully scheduled")
      })

      await test.step("And the Instagram Post is scheduled on the list of posts page", async () => {
         await page.waitForLoadState();
         await expect.soft(page.getByText(testTitle)).toBeVisible();
         await expect.soft(page.getByText(testDescription)).toBeVisible();
      })
   })

   test(`Check the user able to Edit an Instagram Post successfully @engageregression @social`, async ({ page }) => {
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

      await test.step("And user save changes the edited social post", async () => {
         await pm.social().clickSaveChangesButton()
      }) 
      
      await test.step("Then check the Post edited successfully", async () => {
         await page.waitForLoadState();
         await expect.soft(pm.social().successMessage).toHaveText("Post successfully scheduled")
      })
   })

   test(`Check the user able to Remove an Instagram Post successfully @engageregression @social`, async ({ page }) => {
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

   test.skip(`Check the Instagram reels preview is displayed correctly @engageregression @social`, async ({ page }) => {
      /** 
      * Scenario: Create a Social Post Instagram Reel
	   *     Given user is on the social posts page
	   *     When user creates an Instagram reel post
	   *     Then the Instagram reel preview is displayed
	   *     And the Instagram reel is saved correctly
      **/

      const pm = new PageManager(page)

      const testTitle: string = "AUTO_IG_REEL_" + Date.now()
      const testDescription: string = "AutoTest_Description_" + Date.now()

      await test.step("When user creates an Instagram social post", async () => {
         await pm.social().openSocialPages()
         await pm.social().clickNewPostButton()
         await pm.social().clickInstagramButton()
      })
      
      await test.step("And user select the Instagram Handle(s)", async () => {
         await pm.social().selectInstagramHandles("salgo_en_bici")
      })
         
      
      await test.step("And user select the Instagram Type Reels", async () => {
         await pm.social().selectInstagramTypeReels()
      })
      
      await test.step("And user Add Video to post", async () => {
         await pm.social().clickAddMediaButton()  
         await pm.social().uploadMedia("Nature Blogs.mp4")
         await page.waitForTimeout(15000)
      })
      
      await test.step("Then the Instagram post preview is displayed correctly", async () => {
         await pm.social().addTitlePostContent(testTitle)
         await pm.social().addDescriptionPostContent(testDescription)
      })

      await test.step("When user Post in the Instagram", async () => {
         await pm.social().clickOnScheduleForLaterButton()
            await pm.social().clickOnPostNowButton()
      })   
   
      await test.step("Then the Instagram Post successfully scheduled", async () => {
         await expect.soft(page.getByText(testTitle)).toBeVisible();
         await expect.soft(page.getByText(testDescription)).toBeVisible();
         await expect.soft(pm.social().successMessage).toHaveText("Post successfully scheduled")
      })

      // await test.step("And the Instagram Post is scheduled on the list of posts page", async () => {
      //    await expect.soft(page.getByText(testTitle)).toBeVisible();
      //    await expect.soft(page.getByText(testDescription)).toBeVisible();
      // })
   })
})

