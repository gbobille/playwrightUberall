import {FormattedOpeningHours} from "../../openingHourFormatterUtils"
import {DirectoryCompareService} from "./directoryCompareService"

export class AppleCompareService extends DirectoryCompareService {

    constructor(directoryService: DirectoryCompareService) {
        super()
    }

    checkAppleLocationData(directory: string, locationData: any, pageData: any, locationCategory: string, locationCountry: string, formattedHours: FormattedOpeningHours[]): void {
        const excludeChecks = ['category']
        this.checkLocationData(directory, locationData, pageData, locationCategory, locationCountry, formattedHours, excludeChecks)
    }
}