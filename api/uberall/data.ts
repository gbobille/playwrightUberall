import {Location, LocationDetails, User, UserDetails} from "../../tests/testData/staticTestData";

class Data {

    private business = {
        streetAndNo: "Hussitenstraße 33",
        city: "Berlin",
        zip: "13355",
        country: "DE",
        phone: "+4930208479320",
        productPlan: Number(process.env.QA_PRODUCT_PLAN)
    }

    private location = {
        street: "Hussitenstraße 33",
        city: "Berlin",
        zip: "13355",
        country: "DE",
        phone: "+4930208479320",
        categories: [382],
        website: "https://uberall.com/en/LocationAddTest",
        email: "helloTest@uberall.com",
        createListings: false,
        openingHours: [
            {
                dayOfWeek: 1,
                closed: false,
                from1: "09:00",
                to1: "11:30"
            },
            {
                dayOfWeek: 4,
                closed: false,
                from1: "09:30",
                to1: "11:45",
                from2: "13:00",
                to2: "21:00"
            }
        ],
        socialProfiles: [
            {type: "FACEBOOK", url: "https://www.facebook.com/getuberall"},
            {type: "LINKEDIN", url: "https://linkedin.com/company/get-uberall/"},
            {type: "YOUTUBE", url: "https://www.youtube.com/channel/UC8-Th83bH_thdKZDJCrn88g"},
            {type: "INSTAGRAM", url: "https://www.instagram.com/getuberall/"},
            {type: "VIMEO", url: "https://vimeo.com/getuberall"},
            {type: "TWITTER", url: "https://twitter.com/getuberall"},
            {type: "XING", url: "https://www.xing.com/companies/uberall"},
            {type: "FOURSQUARE", url: "https://foursquare.com/v/uberall-hq/515c4010fe701fcb8267a454"},
            {type: "PINTEREST", url: "https://pinterest.com/getuberall/"}
        ],
        attributes: [
            {
                externalId: "has_delivery",
                displayName: "Lieferdienst",
                valueType: "BOOL",
                value: "true"
            }
        ],
        paymentOptions: ["AMAZON", "PAYPAL", "AMEX"],
        brands: ["Mc Donalds", "Coca Cola", "Sony-Tendo", "Sports"],
        languages: ["Persian", "English", "German"],
        photos: [],
        videos: [
            {
                description: "Advanced Analytics",
                type: "YOUTUBE",
                url: "https://www.youtube.com/watch?v=MmUN3ObGN68"
            }
        ]
    }

    private user = {
        firstname: "QA_API_USER",
        lastname: "Uberall",
        preferredLanguage: "en",
        whitelabelInformationIdentifier: "qatestpartner",
        status: "VERIFIED",
        features: [
            "LOCATION_WRITE",
            "LOCATION_READ",
            "LISTINGS",
            "LOCATION_STATUS_CHANGE",
            "INBOX_READ",
            "INBOX_WRITE",
            "INBOX_APPROVAL",
            "POSTING_READ",
            "POSTING_WRITE",
            "SUPPRESSION",
            "TRACKING",
            "UPGRADE",
            "USER_SELF_EDIT",
            "USER_OTHERS_EDIT",
            "RESPONSE_LIBRARY_READ",
            "RESPONSE_LIBRARY_WRITE",
            "CAN_PAY_INVOICE"
        ],
        featuresDetailed: {
            LOCATION_WRITE: [
                "name",
                "street",
                "streetNo",
                "addressExtra",
                "city",
                "zip",
                "addressDisplay",
                "phone",
                "fax",
                "cellphone",
                "website",
                "email",
                "descriptionShort",
                "descriptionLong",
                "imprint",
                "openingHours",
                "specialOpeningHours",
                "openingHoursNotes",
                "keywords",
                "categories",
                "attributes",
                "photos",
                "legalIdent",
                "taxNumber",
                "province",
                "country",
                "contentLists",
                "videos",
                "socialProfiles",
                "brands",
                "languages",
                "paymentOptions",
                "services",
                "serviceAreas",
                "lat",
                "lng",
                "labels",
                "identifier",
                "moreHours",
                "openingDate",
                "utms",
                "callTrackingNumbers",
                "lodgingFields",
                "transactionLinks",
                "sublocality"
            ]
        }
    }

    private statusCheck = {
        country: "DE",
        name: "Santorini",
        street: "Cauerstraße 28",
        zip: "10587"
    }

    private nearMeCheck = {
        country: "DE",
        name: "Edeka",
        streetAndNo: "Baumschulenstraße 31",
        zip: "12437",
        categoryId: 373
    }

    private locationGroup = {
        name: "Location Group Created via the API",
        locations: [
            LocationDetails[Location.SMART_NFT_LOCATION].id
        ],
        users: [
            UserDetails[User.LOCATION_MANAGER_TWO_LOCATIONS].id
        ]
    }

    private webhook = {
        pushUrl: "https://qa-api.uberall.com/webhooks",
        type: "LISTING_DATAPOINT_CHECK",
        status: "Active"
    }

    newBusiness() {
        return this.business
    }

    newLocation() {
        return this.location
    }

    newUser() {
        return this.user
    }

    newStatusCheck() {
        return this.statusCheck
    }

    newNearMeCheck() {
        return this.nearMeCheck
    }

    newLocationGroup() {
        return this.locationGroup
    }

    newWebhook() {
        return this.webhook
    }
}

export default Data