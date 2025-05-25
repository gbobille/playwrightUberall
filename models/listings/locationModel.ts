class LocationModel {
    locationName: string
    category: string
    streetAndNumber: string
    city: string
    country: string
    zip: string
    phone: string
    website: string

    constructor(
        locationName: string,
        category: string,
        streetAndNumber: string,
        city: string,
        country: string,
        zip: string,
        phone: string,
        website: string
    ) {
        this.locationName = locationName
        this.category = category
        this.streetAndNumber = streetAndNumber
        this.city = city
        this.country = country
        this.zip = zip
        this.phone = phone
        this.website = website
    }
}

export {LocationModel}
