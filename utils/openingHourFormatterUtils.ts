import {OpeningHoursModel} from "../models/listings/locationOpeningHoursModel"

// Model for Location Opening Hours
export type FormattedOpeningHours = {
    dayOfWeek: number,
    from1: string,
    to1: string
}

export class OpeningHoursFormatterUtils {
    private dayOfWeekMap: { [key: string]: number } = {
        'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7,
        'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 7,
        'Montag': 1, 'Dienstag': 2, 'Mittwoch': 3, 'Donnerstag': 4, 'Freitag': 5, 'Samstag': 6, 'Sonntag': 7
    }

    formatOpeningHours(openingHours: OpeningHoursModel[]): FormattedOpeningHours[] {
        return openingHours
            // Filter out days with empty hours or contains 'closed'
            .filter(({hours}) => hours && !['geschlossen', 'closed'].includes(hours.toLowerCase()))
            // Convert to formatted hours for each day of the week
            .flatMap(({day, hours}) => this.convertToFormattedHours(day, hours))
            // Sort by day of week - lowest to highest
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    }

    private convertToFormattedHours(day: string, hours: string): FormattedOpeningHours[] {
        // Split hours and days into arrays and map them to formatted hours
        const [from, to] = hours.split(/[-–]/).map(time => this.convertTo24HourFormat(time.trim()))
        const days = day.split(/[-–]/).map(d => d.trim())
        // handles cases were a range of days is provided, e.g 'Mon-Fri'
        const startDayIndex = this.dayOfWeekMap[days[0]]
        const endDayIndex = this.dayOfWeekMap[days[1]] || startDayIndex

        return Array.from({length: endDayIndex - startDayIndex + 1}, (_, i) => ({
            dayOfWeek: startDayIndex + i,
            from1: from,
            to1: to
        }))
    }

    private convertTo24HourFormat(time: string): string {
        // Replace non-breaking spaces with regular spaces
        time = time.replace(/\u202F/g, ' ')

        // Remove any extra spaces
        time = time.replace(/\s+/g, ' ').trim()

        // Use a regular expression to extract the time and the modifier regardless of position in the string
        const match = time.match(/(\d{1,2}:\d{2})\s*([APM]*)/i)
        if (!match) {
            throw new Error(`Invalid time format: ${time}`)
        }

        const timePart = match[1]
        const modifier = match[2]
        // TODO: resolve eslint-disable-next-line prefer-const
        // eslint-disable-next-line prefer-const
        let [hours, minutes] = timePart.split(':').map(Number)

        if (modifier?.toUpperCase() === 'PM' && hours !== 12) hours += 12
        if (modifier?.toUpperCase() === 'AM' && hours === 12) hours = 0

        // Pads hours and minutes into hh:mm format in case of single digit times
        return `${hours.toString().padStart(2, '0')}:${(minutes || 0).toString().padStart(2, '0')}`
    }
}