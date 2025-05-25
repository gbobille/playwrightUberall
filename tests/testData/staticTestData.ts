import {ApiEnvironmentHelper} from "../../api/uberall/apiEnvironmentHelper"

export enum User {
    API_ADMIN_USER = "backend+969430cb1f15b3ddd6f03af1f9f9958c@uberall.com", // userId 187183
    API_CHILD_ADMIN = "api.admin+sp3329@domain.fakeemail", // userId 734736
    ADMIN_USER = "admin_qa_test@uberall.com", // userId 334043
    ADMIN_CHILD_USER = "admin_qa_child_test@uberall.com", // userId 734739
    ADMIN_LIMITED_USER1 = "admin_qa_limited1@uberall.com", // userId 334044
    ADMIN_LIMITED_USER2 = "admin_qa_limited2@uberall.com", // userId 334045
    ADMIN_LIMITED_USER3 = "admin_qa_limited3@uberall.com", // userId 334046
    ADMIN_LIMITED_USER4 = "admin_qa_limited4@uberall.com", // userId 334047
    ACCOUNT_MANAGER_BUS1_BUS2_BUS3 = "account_manager_with_three_businesses@uberall.com", // userId 334048
    BUSINESS_MANAGER_BUS1 = "business_manager1@uberall.com", // userId 334054
    BUSINESS_MANAGER_BUS2 = "business_manager2@uberall.com", // userId 334055
    ACCOUNT_MANAGER_BUS7_BUS8 = "account_manager_with_two_businesses@uberall.com", // userId 345966
    LOCATION_MANAGER_TWO_LOCATIONS = "location_manager_with_two_locations_static@uberall.com", // userId 502999
    LOCATION_MANAGER_ONE_LOCATION = "location_manager_with_one_location@uberall.com", // userId 859370
    ADMIN_USER_NEW_NAVIGATION = "admin_qa_test_alt_config@uberall.com", // userId 984363
    ADMIN_USER_LIMITED1_NEW_NAVIGATION = "admin_qa_test_alt_config_limited1@uberall.com", // userId 984443
    ADMIN_USER_LIMITED2_NEW_NAVIGATION = "admin_qa_test_alt_config_limited2@uberall.com", // userId 984479
    ADMIN_USER_LIMITED3_NEW_NAVIGATION = "admin_qa_test_alt_config_limited3@uberall.com", // userId 984499
    ADMIN_USER_LIMITED4_NEW_NAVIGATION = "admin_qa_test_alt_config_limited4@uberall.com", // userId 984501
    ACCOUNT_MANAGER_1BUS_1LOC_NEW_NAVIGATION = "business_manager_with_one_business_one_location_alt_config@uberall.com", // userId 984559
    ACCOUNT_MANAGER_1BUS_2LOC_NEW_NAVIGATION = "business_manager_with_one_business_two_locations_alt_config@uberall.com", // userId 984558
    ACCOUNT_MANAGER_BUS7_BUS8_NEW_NAVIGATION = "business_manager_with_two businesses_alt_config@uberall.com", // userId 984557
    LOCATION_MANAGER_ONE_LOCATION_NEW_NAVIGATION = "location_manager_with_one_location_alt_config@uberall.com", // userId 984539
    BUSINESS_MANAGER_NEW_NAVIGATION = "multi_account_manager_alt_config@uberall.com", // userId 984553
    ADMIN_SEARCH_UBER_ALL = "admin_search_spec@uber-all.com", // userId 998829
    LOCATION_MANAGER_TWO_LOCATIONS_UBER_ALL = "location_manager_search_spec@uber-all.com", // userId 998831
    BUSINESS_MANAGER_SEARCH_UBER_ALL = "business_manager_search_spec@uber-all.com", // userId 998830
    LOCATION_GROUPS_LOCATION_MANAGER = "location_manager_groups@uber-all.com" // userId 1011372
}

export const UserDetails: Record<User, { id: number, privateKey: string }> = {
    [User.API_ADMIN_USER]: {id: 187183, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.API_CHILD_ADMIN]: {id: 734736, privateKey: ApiEnvironmentHelper.get1098ChildPrivateKey()},
    [User.ADMIN_USER]: {id: 334043, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ADMIN_CHILD_USER]: {id: 734739, privateKey: ApiEnvironmentHelper.get1098ChildPrivateKey()},
    [User.ADMIN_LIMITED_USER1]: {id: 334044, privateKey: process.env.ADMIN_LIMITED_USER1_API_PRIVATE_KEY || ''},
    [User.ADMIN_LIMITED_USER2]: {id: 334045, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ADMIN_LIMITED_USER3]: {id: 334046, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ADMIN_LIMITED_USER4]: {id: 334047, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ACCOUNT_MANAGER_BUS1_BUS2_BUS3]: {id: 334048, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.BUSINESS_MANAGER_BUS1]: {id: 334054, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.BUSINESS_MANAGER_BUS2]: {id: 334055, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ACCOUNT_MANAGER_BUS7_BUS8]: {id: 345966, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.LOCATION_MANAGER_TWO_LOCATIONS]: {id: 502999, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.LOCATION_MANAGER_ONE_LOCATION]: {id: 859370, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ADMIN_USER_NEW_NAVIGATION]: {id: 984363, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ADMIN_USER_LIMITED1_NEW_NAVIGATION]: {id: 984443, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ADMIN_USER_LIMITED2_NEW_NAVIGATION]: {id: 984479, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ADMIN_USER_LIMITED3_NEW_NAVIGATION]: {id: 984499, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ADMIN_USER_LIMITED4_NEW_NAVIGATION]: {id: 984501, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ACCOUNT_MANAGER_1BUS_1LOC_NEW_NAVIGATION]: {id: 984559, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ACCOUNT_MANAGER_1BUS_2LOC_NEW_NAVIGATION]: {id: 984558, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ACCOUNT_MANAGER_BUS7_BUS8_NEW_NAVIGATION]: {id: 984557, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.LOCATION_MANAGER_ONE_LOCATION_NEW_NAVIGATION]: {
        id: 984539,
        privateKey: ApiEnvironmentHelper.get1098PrivateKey()
    },
    [User.BUSINESS_MANAGER_NEW_NAVIGATION]: {id: 984553, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.ADMIN_SEARCH_UBER_ALL]: {id: 998829, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.LOCATION_MANAGER_TWO_LOCATIONS_UBER_ALL]: {id: 998831, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.BUSINESS_MANAGER_SEARCH_UBER_ALL]: {id: 998830, privateKey: ApiEnvironmentHelper.get1098PrivateKey()},
    [User.LOCATION_GROUPS_LOCATION_MANAGER]: {id: 1011372, privateKey: ApiEnvironmentHelper.get1098PrivateKey()}
}

export enum Location {
    LOC_UB24562 = "LOC_UB24562_static", // locationId 1561208
    LOC_UB25983A = "LOC_UB25983A_static", // locationId 1561211
    LOC_UB25983B = "LOC_UB25983B_static", // locationId 1561214
    LOC_UB24784 = "LOC_EditPostsA_static", // locationId 1837574
    LOC1_BUS_PP2547 = "LOC1_PostingPreviewFeaturePostA_static", // locationId 1837604
    LOC2_BUS_PP2547 = "LOC2_PostingPreviewFeaturePostA_static", // locationId 1837605
    LOC_Netherlands_DataPoints = "LOC_UB25984NL_static", // locationId 1561218
    LOC_Germany_DataPoints = "LOC_UB25984GER_static", // locationId 1561219
    LOC1_BUS9 = "LOC_LocationFilterA_static", // locationId 1837561
    LOC2_BUS9 = "LOC_LocationFilterB_static", // locationId 1837562
    LOC3_BUS9 = "LOC_LocationFilterC_static", // locationId 1837564
    LOC4_BUS9 = "LOC_LocationFilterD_static", // locationId 1837565
    LOC_BUS10 = "LOC_LocationFilterE_static", // locationId 1837566
    LOC1_FILTER = "LOC_UB23492G_static", // locationId 1754981
    LOC2_FILTER = "LOC_UB23492H_static", // locationId 1754982
    LOC1_SEARCH = "LOC_Location_Search_Static_A", // locationId 2931656
    LOC2_SEARCH = "LOC_Location_Search_Static_B", // locationId 2931657
    GOOGLE_LOCATION = "LOC_GoogleConnected_static", // locationId 1399230
    FACEBOOK_LOCATION = "LOC_FacebookConnected_static", // locationId 1395199
    SMART_NFT_LOCATION = "Smart NFT", // locationId 1312316
    UNITED_STATES_LOCATION = "LOC_United_States_Listings_Static", // locationId 3292213
    UBERALL_SMART_QA_LOCATION = "Smart NFT Cafe - ramp up", // locationId 3431035
    ALTERNATE_SOCIAL_POST_LOCATION = "LOC_Alternate_SocialPost" // locationId 3551821
}

export const LocationDetails: Record<Location, { id: number }> = {
    [Location.LOC_UB24562]: {id: 1561208},
    [Location.LOC_UB25983A]: {id: 1561211},
    [Location.LOC_UB25983B]: {id: 1561214},
    [Location.LOC_UB24784]: {id: 1837574},
    [Location.LOC1_BUS_PP2547]: {id: 1837604},
    [Location.LOC2_BUS_PP2547]: {id: 1837605},
    [Location.LOC_Netherlands_DataPoints]: {id: 1561218},
    [Location.LOC_Germany_DataPoints]: {id: 1561219},
    [Location.LOC1_BUS9]: {id: 1837561},
    [Location.LOC2_BUS9]: {id: 1837562},
    [Location.LOC3_BUS9]: {id: 1837564},
    [Location.LOC4_BUS9]: {id: 1837565},
    [Location.LOC_BUS10]: {id: 1837566},
    [Location.LOC1_FILTER]: {id: 1754981},
    [Location.LOC2_FILTER]: {id: 1754982},
    [Location.LOC1_SEARCH]: {id: 2931656},
    [Location.LOC2_SEARCH]: {id: 2931657},
    [Location.GOOGLE_LOCATION]: {id: 1399230},
    [Location.FACEBOOK_LOCATION]: {id: 1395199},
    [Location.SMART_NFT_LOCATION]: {id: 1312316},
    [Location.UNITED_STATES_LOCATION]: {id: 3292213},
    [Location.UBERALL_SMART_QA_LOCATION]: {id: 3431035},
    [Location.ALTERNATE_SOCIAL_POST_LOCATION]: {id: 3551821}
}

export enum Business {
    BUS_UB24562 = "BUS_UB24562_static", // businessId 566621
    BUS_UB25983 = "BUS_UB25983_static", // businessId 566624
    BUS_UB24784 = "BUS_EditPostsA_static", // businessId 654433
    BUS_PP2547 = "BUS1_PostingPreviewFeaturePostA_static", // businessId 654457
    BUS_FOR_IMPORT = "STATIC_BUS_For_Import_Location", // businessId 1000633
    BUS6 = "BUS_UserSearch_static", // businessId 654454
    BUS7 = "BUS_UB25984NL_static", // businessId 566628
    BUS8 = "BUS_UB25984GER_static", // businessId 566627
    BUS9 = "BUS_FOUR_LOC_LOCATIONFILTER_STATIC", // businessId 654425
    BUS10 = "BUS_TWO_LOC_LocationFilter_static", // businessId 654427
    BUS11 = "BUS_BusinessFilterA_static", // businessId 654418
    BUS12 = "BUS_BusinessFilterB_static", // businessId 654420
    BUS13 = "BUS_BusinessFilterC_static", // businessId 654421
    BUS_LOC_FILTER = "BUS_UB23492C_static", // businessId 628015
    BUS_LOC_SEARCH = "BUS_Location_Search_Static", // businessId 1194822
    BUS_CONNECTED_DIRECTORIES = "BUS_ConnectedDirectories_static", // businessId 458731
    BUS_CHILD_CONNECTED_DIRECTORIES_STATIC = "BUS_Child_Connected_Directories_static", // businessId 1471290
    ALTERNATE_QA_BUSINESS = "QA Account" // businessId 1557643
}

export const BusinessDetails: Record<Business, { id: number }> = {
    [Business.BUS_UB24562]: {id: 566621},
    [Business.BUS_UB25983]: {id: 566624},
    [Business.BUS_UB24784]: {id: 654433},
    [Business.BUS_PP2547]: {id: 654457},
    [Business.BUS_FOR_IMPORT]: {id: 1000633},
    [Business.BUS6]: {id: 654454},
    [Business.BUS7]: {id: 566628},
    [Business.BUS8]: {id: 566627},
    [Business.BUS9]: {id: 654425},
    [Business.BUS10]: {id: 654427},
    [Business.BUS11]: {id: 654418},
    [Business.BUS12]: {id: 654420},
    [Business.BUS13]: {id: 654421},
    [Business.BUS_LOC_FILTER]: {id: 628015},
    [Business.BUS_LOC_SEARCH]: {id: 1194822},
    [Business.BUS_CONNECTED_DIRECTORIES]: {id: 458731},
    [Business.BUS_CHILD_CONNECTED_DIRECTORIES_STATIC]: {id: 1471290},
    [Business.ALTERNATE_QA_BUSINESS]: {id: 1557643}
}

