import {test} from '../../../setup'
import Login from "../../../../pages/components/login"
import {Location, LocationDetails, User, UserDetails} from "../../../testData/staticTestData"
import UserCall from "../../../../api/uberall/platform/userCall"
import {expect} from "@playwright/test"
import {APIResponse} from "playwright"
import LocationListRevamp from "../../../../pages/datamanagement/locationListRevamp"

let login: Login
let locationListRevamp: LocationListRevamp
let userInfo: APIResponse
let assignedGroupLocationIds: number[]
let assignedNormalLocationIds: number[]
let totalAssignedLocations: number

const USER = User.LOCATION_GROUPS_LOCATION_MANAGER

const ASSIGNED_LOCATION_1 = Location.LOC_Netherlands_DataPoints
const ASSIGNED_LOCATION_2 = Location.LOC_Germany_DataPoints
const ASSIGNED_LOCATION_1_ID = LocationDetails[ASSIGNED_LOCATION_1].id
const ASSIGNED_LOCATION_2_ID = LocationDetails[ASSIGNED_LOCATION_2].id

const LOCATION_GROUP_LOCATION_1 = Location.SMART_NFT_LOCATION
const LOCATION_GROUP_LOCATION_2 = Location.FACEBOOK_LOCATION
const LOCATION_GROUP_LOCATION_1_ID = LocationDetails[LOCATION_GROUP_LOCATION_1].id
const LOCATION_GROUP_LOCATION_2_ID = LocationDetails[LOCATION_GROUP_LOCATION_2].id

test.beforeEach(async ({page}) => {
    userInfo = await UserCall.getUserModel(UserDetails[USER].id)
    assignedGroupLocationIds = JSON.parse(JSON.stringify(userInfo)).response.user.managedLocationsViaGroups as number[]
    assignedNormalLocationIds = JSON.parse(JSON.stringify(userInfo)).response.user.managedLocations as number[]
    totalAssignedLocations = assignedGroupLocationIds.length + assignedNormalLocationIds.length

    login = new Login(page)
    locationListRevamp = new LocationListRevamp(page)
})

test.describe("Location Groups: Location Access", {tag: '@Platform'}, () => {

    test(`Check that A User with Location groups can only access its manages Locations`, async ({step}) => {
        await step(`Given ${USER} Logs in`, async () => {
            await login.goto()
            await login.userLogin(USER)
        })

        await step(`When ${USER} navigates to the Locations Page`, async () => {
            await locationListRevamp.goTo()
        })

        await step(`Then The Assigned Locations and Group locations are exactly 2 each`, async () => {
            expect(assignedGroupLocationIds).toHaveLength(2)
            expect(assignedNormalLocationIds).toHaveLength(2)
        })
        await step(`And The Assigned and Group Locations are assigned to the user`, async () => {
            expect(assignedGroupLocationIds).toContain(LOCATION_GROUP_LOCATION_1_ID)
            expect(assignedGroupLocationIds).toContain(LOCATION_GROUP_LOCATION_2_ID)

            expect(assignedNormalLocationIds).toContain(ASSIGNED_LOCATION_1_ID)
            expect(assignedNormalLocationIds).toContain(ASSIGNED_LOCATION_2_ID)
        })
        await step(`And Only the Assigned and Group Assigned Locations are shown`, async () => {
            await expect(locationListRevamp.locationDirectLink).toHaveCount(totalAssignedLocations)
            await expect(locationListRevamp.locationByText(LOCATION_GROUP_LOCATION_1)).toBeVisible()
            await expect(locationListRevamp.locationByText(LOCATION_GROUP_LOCATION_2)).toBeVisible()

            await expect(locationListRevamp.locationByText(ASSIGNED_LOCATION_1)).toBeVisible()
            await expect(locationListRevamp.locationByText(ASSIGNED_LOCATION_2)).toBeVisible()
        })
    })
})
