import {FormattedOpeningHours} from "../../openingHourFormatterUtils"
import {DirectoryCompareService} from "./directoryCompareService"

export class GoogleCompareService extends DirectoryCompareService {

    constructor(directoryService: DirectoryCompareService) {
        super()
    }

    checkGoogleLocationData(directory: string, locationData: any, pageData: any, locationCategory: string, locationCountry: string, formattedHours: FormattedOpeningHours[]): void {
        const excludeChecks = ['country', 'name'] // Specify the checks to exclude for Google
        this.checkLocationData(directory, locationData, pageData, locationCategory, locationCountry, formattedHours, excludeChecks)
    }
}