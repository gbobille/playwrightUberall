import {test} from '../../setup'
import {expect} from "@playwright/test"
import Login from "../../../pages/components/login"
import {Business, Location, User} from "../../testData/staticTestData"
import LocationGroupsPage from "../../../pages/locationgroup/locationGroupsPage"
import LocationGroupsCreatePage from "../../../pages/locationgroup/locationGroupsCreatePage"
import LocationGroupCall from "../../../api/uberall/platform/locationGroupCall"
import UserCall from "../../../api/uberall/platform/userCall"

let login: Login
let locationGroupsPage: LocationGroupsPage
let locationGroupsCreatePage: LocationGroupsCreatePage
let locationGroupCall: LocationGroupCall
let locationGroupElements: Array<{ name: string, locations: number, users: number }> | null = null

const USER = User.ADMIN_USER
const SEARCH_USER = "admin_search@uber-all.com"

const locationGroups: {
    name: string
    businesses: Business[]
    locations: Location[]
    users: string[]
} = {
    name: "Automation created location group",
    businesses: [Business.BUS_CONNECTED_DIRECTORIES],
    locations: [Location.FACEBOOK_LOCATION],
    users: [SEARCH_USER],
}

test.beforeEach(async ({page}) => {
    await UserCall.deleteUser(SEARCH_USER)
    locationGroupCall = new LocationGroupCall()
    await locationGroupCall.deleteLocationGroup(locationGroups.name)
    login = new Login(page)
    locationGroupsPage = new LocationGroupsPage(page)
    locationGroupsCreatePage = new LocationGroupsCreatePage(page)
    locationGroupElements = null
    await UserCall.ensureAdminUser(SEARCH_USER)

})

test.describe("Location Groups: Add a Location Group", {tag: '@Platform'}, () => {
    test(`Check A Location Group can be created`, async ({step}) => {
        await step(`Given ${USER} Logs in and is on the Location Groups Page`, async () => {
            await login.goto()
            await login.userLogin(USER)
        })

        await step(`When ${USER} clicks on the 'New Group' button and adds a new Group`, async () => {
            await locationGroupsPage.goTo()
        })

        await step(`Then the Location Group has been created and all values are correct`, async () => {
            await locationGroupsPage.clickNewGroupButton()
            await locationGroupsCreatePage.addGroupName(locationGroups.name)
            await locationGroupsCreatePage.searchUsers(SEARCH_USER)
            await locationGroupsCreatePage.selectUsers(locationGroups.users)
            await locationGroupsCreatePage.addLocationsAndBusinesses(locationGroups)
            await locationGroupsCreatePage.successfullySaveLocationGroup()
        })

        await step(`and the option to add new locations is shown and the import option is available`, async () => {
            await locationGroupsPage.isAt()
            locationGroupElements = await locationGroupsPage.getLocationGroupInTableInformation()
            const createdGroup = locationGroupElements.find((group) => group.name === locationGroups.name)!

            expect(createdGroup.name).toBe(locationGroups.name)
            expect(createdGroup.locations).toBe(locationGroups.locations.length)
            expect(createdGroup.users).toBe(locationGroups.users.length)
        })
    })
})

test.afterAll(async () => {
    await locationGroupCall.deleteLocationGroup(locationGroups.name)
    await UserCall.deleteUser(SEARCH_USER)

})
