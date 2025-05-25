import {Locator, Page} from "@playwright/test"
import UserInTable from "../../models/users/userInTable"
import {UserCreatePage} from "./usersCreatePage";
import UserRole from "../../models/users/user/userRole";
import {SearchBar} from "../components/search/searchBar";

export default class UsersPage {
    page: Page
    static url = '/en/app/uberall/users/management'
    readonly firstUserLinkInTable: Locator
    readonly noUserSearchResult: Locator
    readonly searchResult: Promise<boolean>
    readonly createUserButton: Locator
    readonly userRow: Locator
    readonly userFirstName: (nav: Locator) => Locator
    readonly userLastName: (nav: Locator) => Locator
    readonly userEmail: (nav: Locator) => Locator
    readonly userRole: (nav: Locator) => Locator
    readonly businessProductPlan: (nav: Locator) => Locator
    readonly userEditButton: (nav: Locator) => Locator
    readonly userDeleteButton: (nav: Locator) => Locator
    readonly searchBar: SearchBar

    constructor(page: Page) {
        this.page = page
        this.firstUserLinkInTable = page.locator("//a[contains(@href, '/edit')]").first()
        this.noUserSearchResult = page.locator("//div[@class='users-row-no-result']")
        this.searchResult = this.noUserSearchResult.isVisible() || this.firstUserLinkInTable.isVisible()
        this.createUserButton = page.locator("//div[contains(@class, 'create-user')]")
        this.userRow = page.locator("table.users-management-list > tbody > tr.table-row")
        this.userFirstName = (nav: Locator) => nav.locator("td:nth-child(1) > span")
        this.userLastName = (nav: Locator) => nav.locator("td:nth-child(2)")
        this.userEmail = (nav: Locator) => nav.locator("td:nth-child(3) > a")
        this.userRole = (nav: Locator) => nav.locator("td:nth-child(4) > span")
        this.userEditButton = (nav: Locator) => nav.locator("td:nth-child(5) a[href*='/edit']")
        this.businessProductPlan = (nav: Locator) => nav.locator("td.plan-cell.plan-active > a")
        this.userDeleteButton = (nav: Locator) => nav.locator("td:nth-child(5) a.delete-user-btn:not(.hide-element)")
        this.searchBar = new SearchBar(page)
    }

    async goto() {
        const fullUrl = `${process.env.BASE_URL}${UsersPage.url}`
        console.log(`Navigating to URL: ${fullUrl}`)
        await this.page.goto(UsersPage.url, {waitUntil: "domcontentloaded"})
        await this.isAt()
    }

    async isAt(): Promise<boolean> {
        await this.page.waitForURL(url => url.toString().includes(`${process.env.BASE_URL}${UsersPage.url}`), {timeout: 30000})
        await this.page.waitForLoadState('domcontentloaded')

        await Promise.race([
            this.noUserSearchResult.waitFor({state: 'visible', timeout: 30000}),
            this.firstUserLinkInTable.waitFor({state: 'visible', timeout: 30000})
        ])

        return await this.searchResult
    }

    async userSearch(search: string) {
        await this.searchBar.searchFor(search)
         await this.firstUserLinkInTable.waitFor({state: 'visible', timeout: 30000})
    }

    async gotoUserCreatePage(): Promise<UserCreatePage> {
        await this.createUserButton.click()
        const userCreatePage = new UserCreatePage(this.page)
        await userCreatePage.isAt()
        return userCreatePage
    }

    async getAllUsers(): Promise<UserInTable[]> {
        await this.page.waitForLoadState('domcontentloaded')
        await this.searchResult
        const allUsers: UserInTable[] = []
        const userRows = this.userRow
        const rowCount = await userRows.count()

        for (let i = 0; i < rowCount; i++) {
            const row = userRows.nth(i)
            const firstName = await this.userFirstName(row).textContent() || ''
            const lastName = await this.userLastName(row).textContent() || ''
            const email = await this.userEmail(row).textContent() || ''
            const roleText = await this.userRole(row).textContent() || ''
            const role = roleText.replace(/ /g, '_').toUpperCase() as UserRole
            const editButton = this.userEditButton(row)
            const deleteButton = this.userDeleteButton(row)

            const user = new UserInTable(firstName, lastName, email, role, editButton, deleteButton)
            allUsers.push(user)
        }

        return allUsers
    }
}