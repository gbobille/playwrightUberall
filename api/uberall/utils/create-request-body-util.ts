export default class createRequestBodyUtil {
    static async createRequestBody(openingDate:string) {
        const requestBodyJSON = {
            "openingDate": `${openingDate}`
        }
        const requestBody = JSON.stringify(requestBodyJSON)
        return requestBody
    }

    static async createBody(body:Map<any,any>) {
        const mapToJson = (map:Map<any,any>) => {
            return JSON.stringify(Object.fromEntries(map));
        };
        const jsonString = mapToJson(body);
        return jsonString
    }
    
    static async createHoursObject(weekDay: any, hourFrom: any = "", hourTo: any = "", hourFrom2: any = "", hourTo2: any = "") {
        const openingHours: { dayOfWeek: any; from1: any; to1: any; from2: any; to2: any;}[] = []
        const payload = new Map<any,any>();
        weekDay.forEach((element: any) => {
            openingHours.push({"dayOfWeek":element, "from1":hourFrom, "to1": hourTo, "from2": hourFrom2, "to2": hourTo2})
        });
        payload.set("openingHours", openingHours)
        return payload
    }

    static async createSpecialOpeningHoursObject(date: any, hourFrom: any = "", hourTo: any = "", hourFrom2: any = "", hourTo2: any = "", closed: boolean) {
        const specialOpeningHours: { date: any; from1: any; to1: any; from2: any; to2: any, closed: boolean;}[] = []
        const payload = new Map<any,any>();
        specialOpeningHours.push({"date":date, "from1":hourFrom, "to1": hourTo, "from2": hourFrom2, "to2": hourTo2, "closed": closed})
        payload.set("specialOpeningHours", specialOpeningHours)
        return payload
    }
}