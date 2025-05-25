import {test} from '../../setup'
import {expect} from "@playwright/test"
import Login from "../../../pages/components/login"
import {User} from "../../testData/staticTestData"
import LocationGroupsPage from "../../../pages/locationgroup/locationGroupsPage"
import LocationGroupCall from "../../../api/uberall/platform/locationGroupCall"

let login: Login
let locationGroupsPage: LocationGroupsPage
let locationGroupId: number | Map<string, unknown> | undefined
let locationGroupCall: LocationGroupCall
let locationGroupElements: Array<{ name: string, locations: number, users: number }> | null = null

const USER = User.ADMIN_USER
const LOCATION_GROUP_NAME = "Location Group Created via the API"

test.beforeEach(async ({page}) => {
    locationGroupCall = new LocationGroupCall()
    await locationGroupCall.deleteLocationGroup(LOCATION_GROUP_NAME)
    login = new Login(page)
    locationGroupsPage = new LocationGroupsPage(page)
    locationGroupElements = null
    locationGroupId = await locationGroupCall.ensureLocationGroup()
})

test.describe("Location Groups: Delete a Location Group", {tag: '@Platform'}, () => {
    test(`Check A Location Group can be deleted`, async ({step}) => {
        await step(`Given ${USER} Logs in and is on the Location Groups Page`, async () => {
            await login.goto()
            await login.userLogin(USER)
            await locationGroupsPage.goTo()
        })

        await step(`And there is an existing location Group`, async () => {
            locationGroupElements = await locationGroupsPage.getLocationGroupInTableInformation()
            const existingGroup = locationGroupElements.find((group) => group.name === LOCATION_GROUP_NAME)!
            expect(existingGroup.name).toBe(LOCATION_GROUP_NAME)
        })

        await step(`When ${USER} deletes the existing Location Group`, async () => {
            await locationGroupsPage.deleteLocationGroup(locationGroupId)
        })

        await step(`Then the Location Group has been successfully deleted and no Group with that name is present`, async () => {
            await locationGroupsPage.isAt()
            locationGroupElements = await locationGroupsPage.getLocationGroupInTableInformation()
            const groupExists = locationGroupElements.some((group) => group.name === LOCATION_GROUP_NAME)
            expect(groupExists).toBe(false)
        })
    })
})

test.afterAll(async () => {
    await locationGroupCall.deleteLocationGroup(LOCATION_GROUP_NAME)
})
