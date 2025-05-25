import { test } from '../../setup'
import { expect } from "@playwright/test"
import Login from "../../../pages/components/login"
import UsersPage from "../../../pages/users/usersPage"
import { UserCreatePage } from "../../../pages/users/usersCreatePage"
import { SearchBar } from "../../../pages/components/search/searchBar"
import UserCall from "../../../api/uberall/platform/userCall"
import { User } from "../../testData/staticTestData"
import {
    administrator,
    businessManager,
    locationManager,
    multiBusinessManager
} from "../../testData/data/user/userCreateTemplate"
import UserRole from "../../../models/users/user/userRole";

let login: Login
let usersPage: UsersPage
let userCreatePage: UserCreatePage
let searchBar: SearchBar

const testData = [
    { ...administrator, role: 'Administrator', expectedRole: UserRole.ADMINISTRATOR },
    { ...locationManager, role: 'Location Manager', expectedRole: UserRole.LOCATION_MANAGER },
    { ...businessManager, role: 'Business Manager', expectedRole: UserRole.BUSINESS_MANAGER },
    { ...multiBusinessManager, role: 'Multi Business Manager', expectedRole: UserRole.MULTI_BUSINESS_MANAGER }
]

for (const data of testData) {
    test.describe(`Create a ${data.role} user and verify that the user has the correct roles`, { tag: '@Platform' }, () => {
        test.beforeEach(async ({ page }) => {
            login = new Login(page)
            usersPage = new UsersPage(page)
            userCreatePage = new UserCreatePage(page)
            searchBar = new SearchBar(page)
        })

        test(`Create a ${data.role} user and verify that the user has the correct roles`, async ({ step }) => {
            await step(`Given ${User.ADMIN_USER} Logs in`, async () => {
                await login.goto()
                await login.userLogin(User.ADMIN_USER)
            })

            await step(`When ${User.ADMIN_USER} creates a ${data.role} User`, async () => {
                await usersPage.goto()
                await usersPage.gotoUserCreatePage()
                await userCreatePage.addUser({
                    ...data,
                    userDetails: { ...data.userDetails, email: data.userDetails.email }
                })
            })

            await step(`Then ${data.userDetails.email} has the Role of ${data.expectedRole}`, async () => {
                await usersPage.userSearch(data.userDetails.email)

                const retrievedUserData = await usersPage.getAllUsers()
                const createdUser = retrievedUserData.find(user => user.email === data.userDetails.email) || { role: '' }
                console.log(createdUser)
                expect(createdUser.role).toBe(data.expectedRole)
            })
        })

        test.afterEach(async () => {
            await UserCall.deleteUser(data.userDetails.email)
        })
    })
}