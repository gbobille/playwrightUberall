class OpeningHoursModel {
    day: string
    hours: string

    constructor(day: string | null, hours: string | null) {
        this.day = day
        this.hours = hours
    }
}

export { OpeningHoursModel }
