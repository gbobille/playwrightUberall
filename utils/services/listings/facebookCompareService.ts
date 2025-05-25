import {FormattedOpeningHours} from "../../openingHourFormatterUtils"
import {DirectoryCompareService} from "./directoryCompareService"

export class FacebookCompareService extends DirectoryCompareService {

    constructor(directoryService: DirectoryCompareService) {
        super()
    }

    checkFacebookLocationData(directory: string, locationData: any, pageData: any, locationCategory: string, locationCountry: string, formattedHours: FormattedOpeningHours[]): void {
        const excludeChecks = ['name']
        this.checkLocationData(directory, locationData, pageData, locationCategory, locationCountry, formattedHours, excludeChecks)
    }
}