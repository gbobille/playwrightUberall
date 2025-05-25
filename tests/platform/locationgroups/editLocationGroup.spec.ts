import {test} from '../../setup'
import {expect} from "@playwright/test"
import Login from "../../../pages/components/login"
import {Business, Location, User} from "../../testData/staticTestData"
import LocationGroupsPage from "../../../pages/locationgroup/locationGroupsPage"
import LocationGroupCall from "../../../api/uberall/platform/locationGroupCall"
import LocationGroupsCreatePage from "../../../pages/locationgroup/locationGroupsCreatePage"
import UserCall from "../../../api/uberall/platform/userCall"

let login: Login
let locationGroupsPage: LocationGroupsPage
let locationGroupsCreatePage: LocationGroupsCreatePage
let locationGroupId: number | Map<string, unknown> | undefined
let locationGroupCall: LocationGroupCall
let locationGroupElements: Array<{ name: string, locations: number, users: number }> | null = null

const USER = User.ADMIN_USER
const LOCATION_GROUP_NAME = "Location Group Created via the API"
const LOCATION_GROUP_EDITED_NAME = "Location Group Edited via the UI"
const SEARCH_USER_1 = "admin_searc1h@uber-all.com"
const SEARCH_USER_2 = "admin_search2@uber-all.com"
const SEARCH_TERM = "@uber-all.com"

const editedLocationGroup: {
    name: string
    businesses: Business[]
    locations: Location[]
    users: string[]
} = {
    name: LOCATION_GROUP_EDITED_NAME,
    businesses: [Business.BUS_CONNECTED_DIRECTORIES],
    locations: [Location.FACEBOOK_LOCATION, Location.GOOGLE_LOCATION],
    users: [SEARCH_USER_1, SEARCH_USER_2],
}

test.beforeEach(async ({page}) => {
    locationGroupCall = new LocationGroupCall()
    await locationGroupCall.deleteLocationGroup(LOCATION_GROUP_NAME)
    await locationGroupCall.deleteLocationGroup(LOCATION_GROUP_EDITED_NAME)
    await UserCall.deleteUser(SEARCH_USER_1)
    await UserCall.deleteUser(SEARCH_USER_2)
    login = new Login(page)
    locationGroupsPage = new LocationGroupsPage(page)
    locationGroupsCreatePage = new LocationGroupsCreatePage(page)
    locationGroupElements = null
    await UserCall.ensureAdminUser(SEARCH_USER_1)
    await UserCall.ensureAdminUser(SEARCH_USER_2)
    locationGroupId = await locationGroupCall.ensureLocationGroup()
})

test.describe("Location Groups: Edit a Location Group", {tag: '@Platform'}, () => {
    test(`Check A Location Group can be edited`, async ({step}) => {
        await step(`Given ${USER} Logs in and is on the Location Groups Page`, async () => {
            await login.goto()
            await login.userLogin(USER)
            await locationGroupsPage.goTo()
        })

        await step(`And there is an existing location Group that can be edited`, async () => {
            locationGroupElements = await locationGroupsPage.getLocationGroupInTableInformation()
            const existingGroup = locationGroupElements.find((group) => group.name === LOCATION_GROUP_NAME)!
            expect(existingGroup.name).toBe(LOCATION_GROUP_NAME)
        })

        await step(`When ${USER} edits the existing Location Group`, async () => {
            await locationGroupsPage.locationGroupsEditButton(locationGroupId).click()
            await locationGroupsCreatePage.isAt()

            await locationGroupsCreatePage.addGroupName(editedLocationGroup.name)
            await locationGroupsCreatePage.searchUsers(SEARCH_TERM)
            await locationGroupsCreatePage.selectUsers(editedLocationGroup.users)
            await locationGroupsCreatePage.editLocationsAndBusinesses(editedLocationGroup)
            await locationGroupsCreatePage.successfullySaveLocationGroup()
        })

        await step(`Then the Location Group has been successfully edited`, async () => {
            locationGroupElements = await locationGroupsPage.getLocationGroupInTableInformation()
            const createdGroup = locationGroupElements.find((group) => group.name === editedLocationGroup.name)!
            expect(createdGroup.name).toBe(editedLocationGroup.name)
            expect(createdGroup.locations).toBe(editedLocationGroup.locations.length)
            expect(createdGroup.users).toBe(editedLocationGroup.users.length)
        })
    })
})

test.afterAll(async () => {
    await UserCall.deleteUser(SEARCH_USER_1)
    await UserCall.deleteUser(SEARCH_USER_2)
    await locationGroupCall.deleteLocationGroup(LOCATION_GROUP_NAME)
    await locationGroupCall.deleteLocationGroup(LOCATION_GROUP_EDITED_NAME)
})
