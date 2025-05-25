import {expect} from '@playwright/test'
import {OpeningHoursModel} from "../../../models/listings/locationOpeningHoursModel"
import {FormattedOpeningHours} from "../../openingHourFormatterUtils"
import LevenshteinUtils from "../../levenshteinDistanceUtils"

export class DirectoryCompareService {

    checkLocationData(directory: string, locationData: any, pageData: any, locationCategory: string, locationCountry: string, formattedHours: FormattedOpeningHours[], excludeChecks: string[]): void {
        this.checkCommonLocationData(locationData, pageData, locationCategory, locationCountry, excludeChecks)
        this.checkLocationOpeningHours(directory, locationData, formattedHours)
    }

    checkSimilarity(value1: string, value2: string): boolean {
        const similarity = LevenshteinUtils.checkSimilarity(value1, value2)
        const similarityPercentage = LevenshteinUtils.similarityPercentage(value1, value2);
        console.log(`Similarity: ${similarity ? 'Passed' : 'Failed'} ${value1} (${similarityPercentage.toFixed(2)}%) ${value2}`)
        return similarity;
    }

    normalizeCountry = (country: string): string => {
        const countryMap: Record<string, string> = {
            'Germany': 'DE',
            // Add other country mappings as needed
        }
        return countryMap[country] || country;
    }

    checkCommonLocationData(locationData: any, pageData: any, locationCategory: string, locationCountry: string, excludeChecks: string[] = []): Record<string, boolean> {
        const checks = {
            name: locationData.response.location.name === pageData.locationName,
            website: locationData.response.location.website === pageData.website,
            streetAndNumber: this.checkSimilarity(locationData.response.location.streetAndNumber, pageData.streetAndNumber),
            zip: locationData.response.location.zip === pageData.zip,
            city: locationData.response.location.city === pageData.city,
            category: locationCategory === pageData.category,
            country: this.normalizeCountry(locationCountry) === this.normalizeCountry(pageData.country)
        }

        const errors: string[] = []

        for (const [key, value] of Object.entries(checks)) {
            if (excludeChecks.includes(key)) {
                console.log(`${key} is not provided and therefore is excluded`)
                continue
            }
            if (!value) {
                console.error(`${key} is incorrect: expected ${locationData.response.location[key]} but got ${pageData[key]}`)
                errors.push(`${key} is incorrect: expected ${locationData.response.location[key]} but got ${pageData[key]}`)
            } else {
                console.log(`${key} is correct: ${pageData[key]}`)
            }
        }

        if (errors.length > 0) {
            throw new Error(`Location data comparison failed:\n${errors.join('\n')}`)
        }

        return checks
    }

    checkLocationOpeningHours(directory: string, locationData: any, formattedHours: FormattedOpeningHours[]): void {
        const locationOpeningHours: OpeningHoursModel = locationData.response.location.openingHours || []
        if (formattedHours.length > 0) {
            expect(locationOpeningHours).toEqual(formattedHours)
            console.log(`${directory} Opening hours are correct:`, formattedHours)
        } else {
            console.log(`${directory} Opening hours are not shown`)
        }
    }
}
