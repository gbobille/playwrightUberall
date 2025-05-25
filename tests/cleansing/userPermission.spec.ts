import { expect, test } from "@playwright/test";
import { loginGeodesyAppAs } from "../../utils/login-util";
import { cleansingConfig } from "./cleansing.config";
import CleansingDashboard from "../../pages/cleansing/cln-dashboard";

test.describe("User Roles and Permissions", { tag: ['@cln_regression', '@user_permissions']}, () => {

    test(`Verify Admin user can can access all available features from the left panel`, async ({ page }) => {
        const dashboardPage = new CleansingDashboard (page);

        await test.step(`When user enters valid ADMIN credentials in the Geodesy login page`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_ADMIN_USERNAME, process.env.GEODESY_USERS_PASSWORD)
        });

        await test.step(`And user sees all available features`, async () => {
            //Data Management
            await dashboardPage.validateLinkPresent('data-management/pois') 
            await dashboardPage.validateLinkPresent('data-management/sales-partners') 
            await dashboardPage.validateLinkPresent('data-management/customers') 
            await dashboardPage.validateLinkPresent('data-management/cleansers') 
            await dashboardPage.validateLinkPresent('data-management/internal-users') 
            await dashboardPage.validateLinkPresent('data-management/language') 
            await dashboardPage.validateLinkPresent('data-management/countries') 
            await dashboardPage.validateLinkPresent('data-management/api-token') 

            //Task Management
            await dashboardPage.validateLinkPresent('task-management/executor/batches') 

            //Queue
            await dashboardPage.validateLinkPresent('queue/list') 
            await dashboardPage.validateLinkPresent('queue/filters') 

            //Case Collector
            await dashboardPage.validateLinkPresent('cases/dashboard')
            await dashboardPage.validateLinkPresent('cases/list')
            await dashboardPage.validateLinkPresent('cases/reviewing')
            await dashboardPage.validateLinkPresent('cases/quality-check-reviews')
            await dashboardPage.validateLinkPresent('cases/quality-check')
            await dashboardPage.validateLinkPresent('cases/reviewing/escalated')
            await dashboardPage.validateLinkPresent('cases/filters') 

            //Reports
            await dashboardPage.validateLinkPresent('reports/cleansers-stats')  
        });
    });

    test(`Verify Viewer user can can access all available features from the left panel`, async ({ page }) => {
        const dashboardPage = new CleansingDashboard (page);

        await test.step(`When user enters valid VIEWER credentials in the Geodesy login page`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_VIEWER_USERNAME, process.env.GEODESY_USERS_PASSWORD)
        });

        await test.step(`And user sees all available features`, async () => {
            //Data Management
            await dashboardPage.validateLinkPresent('data-management/pois') 
            await dashboardPage.validateLinkPresent('data-management/sales-partners') 
            await dashboardPage.validateLinkPresent('data-management/cleansers') 

            //Task Management
            await dashboardPage.validateLinkPresent('queue/filters') 

            //Case Collector
            await dashboardPage.validateLinkPresent('cases/filters') 
        });
    });

    test(`Verify Cleanser Start user can can access all available features from the left panel`, async ({ page }) => {
        const dashboardPage = new CleansingDashboard (page);

        await test.step(`When user enters valid CLEANSER START credentials in the Geodesy login page`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_CLEANSER_START, process.env.GEODESY_USERS_PASSWORD)
        });

        await test.step(`And user sees all available features`, async () => {
            //Data Management
            await dashboardPage.validateLinkPresent('data-management/cleansers') 

            //Cleansing Portal
            await dashboardPage.validateLinkPresent('cleansing-portal/events')
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list')

            //Reports
            await dashboardPage.validateLinkPresent('reports/cleansers-stats')  
        });
         
    });

    test(`Verify Cleanser General user can can access all available features from the left panel`, async ({ page }) => {
        const dashboardPage = new CleansingDashboard (page);

        await test.step(`When user enters valid CLEANSER GENERAL credentials in the Geodesy login page`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_CLEANSER_GENERAL, process.env.GEODESY_USERS_PASSWORD)
        });

        await test.step(`And user sees all available features`, async () => {
            //Data Management
            await dashboardPage.validateLinkPresent('data-management/cleansers') 

            //Cleansing Portal
            await dashboardPage.validateLinkPresent('cleansing-portal/events')
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list')

            //Reports
            await dashboardPage.validateLinkPresent('reports/cleansers-stats')  
        });
         
    });

    test(`Verify Cleanser High-Prio SPs user can can access all available features from the left panel`, async ({ page }) => {
        const dashboardPage = new CleansingDashboard (page);

        await test.step(`When user enters valid HIGH PRIOTIRTY SPS CLEANSER credentials in the Geodesy login page`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEDOESY_CLEANSER_HP_SP, process.env.GEODESY_USERS_PASSWORD)
        });

        await test.step(`And user sees all available features`, async () => {
            //Data Management
            await dashboardPage.validateLinkPresent('data-management/cleansers') 

            //Cleansing Portal
            await dashboardPage.validateLinkPresent('cleansing-portal/events')
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list')

            //Reports
            await dashboardPage.validateLinkPresent('reports/cleansers-stats')  
        });
    });

    test(`Verify Cleanser Complex Countries user can can access all available features from the left panel`, async ({ page }) => {
        const dashboardPage = new CleansingDashboard (page);

        await test.step(`When user enters valid CLEANSER COMPLEX COUNTRIES credentials in the Geodesy login page`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_CLEANSER_COMPLEX_COUNTRIES, process.env.GEODESY_USERS_PASSWORD)
        });

        await test.step(`And user sees all available features`, async () => {
            //Data Management
            await dashboardPage.validateLinkPresent('data-management/cleansers') 

            //Cleansing Portal
            await dashboardPage.validateLinkPresent('cleansing-portal/events')
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list')

            //Reports
            await dashboardPage.validateLinkPresent('reports/cleansers-stats')  
        });
    });

    test(`Verify Lead Cleanser user can can access all available features from the left panel`, async ({ page }) => {
        const dashboardPage = new CleansingDashboard (page);

        await test.step(`When user enters valid LEAD CLEANSER credentials in the Geodesy login page`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_LEAD_CLEANSER, process.env.GEODESY_USERS_PASSWORD)
        });

        await test.step(`And user sees all available features`, async () => {
            //Data Management
            await dashboardPage.validateLinkPresent('data-management/pois') 
            await dashboardPage.validateLinkPresent('data-management/sales-partners') 
            await dashboardPage.validateLinkPresent('data-management/cleansers') 

            //Cleansing Portal
            await dashboardPage.validateLinkPresent('cleansing-portal/management/instructions')
            await dashboardPage.validateLinkPresent('cleansing-portal/events')
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/list')
            await dashboardPage.validateLinkPresent('cleansing-portal/cleansing/check-quality-list')

            //Task Management
            await dashboardPage.validateLinkPresent('task-management/executor/batches') 

            //Queue
            await dashboardPage.validateLinkPresent('queue/list') 
            await dashboardPage.validateLinkPresent('queue/filters') 

            //Reports
            await dashboardPage.validateLinkPresent('reports/cleansers-stats')  
        });
    });

    test(`Verify Reviewer user can can access all available features from the left panel`, async ({ page }) => {
        const dashboardPage = new CleansingDashboard (page);

        await test.step(`When user enters valid CLEANSER REVIEWER credentials in the Geodesy login page`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_REVIEWER, process.env.GEODESY_USERS_PASSWORD)
        });

        await test.step(`And user sees all available features`, async () => {
            //Data Management
            await dashboardPage.validateLinkPresent('cases/dashboard') 
            await dashboardPage.validateLinkPresent('cases/list')
            await dashboardPage.validateLinkPresent('cases/reviewing')
            await dashboardPage.validateLinkPresent('cases/quality-check-reviews')
        });
    });

    test(`Verify Lead Reviewer user can can access all available features from the left panel`, async ({ page }) => {
        const dashboardPage = new CleansingDashboard (page);

        await test.step(`When user enters valid LEAD REVIEWER credentials in the Geodesy login page`, async () => {
            await loginGeodesyAppAs(page, cleansingConfig.GEODESY_LEAD_REVIEWER, process.env.GEODESY_USERS_PASSWORD)
        });

        await test.step(`And user sees all available features`, async () => {
            //Data Management
            await dashboardPage.validateLinkPresent('data-management/pois') 
            await dashboardPage.validateLinkPresent('data-management/sales-partners') 
            await dashboardPage.validateLinkPresent('data-management/customers') 
            await dashboardPage.validateLinkPresent('data-management/cleansers')

            //Task Management
            await dashboardPage.validateLinkPresent('task-management/executor/batches') 

            //Queue
            await dashboardPage.validateLinkPresent('queue/list') 

            //Case Collector
            await dashboardPage.validateLinkPresent('cases/dashboard')
            await dashboardPage.validateLinkPresent('cases/list')
            await dashboardPage.validateLinkPresent('cases/reviewing')
            await dashboardPage.validateLinkPresent('cases/quality-check-reviews')
            await dashboardPage.validateLinkPresent('cases/quality-check')
            await dashboardPage.validateLinkPresent('cases/reviewing/escalated')
            await dashboardPage.validateLinkPresent('cases/filters') 
        });

    });
})