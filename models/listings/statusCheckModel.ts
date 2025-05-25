class StatusCheck {
    country: string
    name: string
    street: string
    zip: string

    constructor(
        country: string,
        name: string,
        street: string,
        zip: string
    ) {
        this.country = country
        this.name = name
        this.street = street
        this.zip = zip
    }
}

export { StatusCheck }