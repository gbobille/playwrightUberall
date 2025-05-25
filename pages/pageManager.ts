import { Page, expect} from "@playwright/test";
import LoginPage from '../pages/components/login';
import SocialPage from './social/socialPostPage';
import LocationRichDataPage from './datamanagement/singleLocationProfile/richDataPage'

export class PageManager{

    private readonly page: Page
    private readonly loginPage: LoginPage
    private readonly socialPage: SocialPage
    private readonly locationRichDataPage: LocationRichDataPage
    
    constructor(page: Page){
        this.page = page
        this.loginPage = new LoginPage(this.page)
        this.socialPage = new SocialPage(this.page)  
        this.locationRichDataPage = new LocationRichDataPage(this.page)
    }

    login(){
        return this.loginPage
    }

    social(){
        return this.socialPage
    }

    locationRichData(){
        return this.locationRichDataPage
    }
}