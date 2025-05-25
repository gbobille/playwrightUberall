import { expect } from '@playwright/test';
import { test } from '../../setup';
import schemaUtils from '../../../utils/schemaUtils';
import BaseCall from '../../../api/uberall/baseCall';

test.describe('Facebook Reach - @reportingAPI @facebookReach', async () => {
    const apiUtils = new BaseCall();

    let accessToken = ''
    const baseURL = process.env.BASE_URL
    test.beforeAll('Get admin login token', async () => {
        accessToken = await (apiUtils.getAccessToken("3006monitoring@uberall.com", process.env.LB_DEFAULT_PASSWORD))
    })

    test('Facebook Reach - Metadata', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1147391/metadata?v=20191203, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const metadata = await apiUtils.getRequest(apiContext, '/api/advanced-analytics/embed-reports/1147391/metadata?v=20191203');
            new schemaUtils().validateSchema('reporting/facebookReach-metadata.json', metadata)

            const expectedResponse = {
                "dashboard": "1147391",
                "title": "Facebook Reach",
                "filters": [
                    {
                        "name": "Groups",
                        "filterName": "groupIds",
                        "mandatory": false
                    },
                    {
                        "name": "StartDate",
                        "filterName": "StartDate",
                        "mandatory": true
                    },
                    {
                        "name": "EndDate",
                        "filterName": "EndDate",
                        "mandatory": true
                    },
                    {
                        "name": "Aggregation",
                        "filterName": "aggregation",
                        "possibleValues": [
                            "Day",
                            "TwentyEightDays",
                            "Week"
                        ],
                        "mandatory": true
                    },
                    {
                        "name": "Location",
                        "filterName": "locationIds",
                        "mandatory": false
                    },
                    {
                        "name": "PageType",
                        "filterName": "pageLevel",
                        "possibleValues": [
                            "Brand",
                            "Location"
                        ],
                        "mandatory": true
                    },
                    {
                        "name": "Account",
                        "filterName": "accountIds",
                        "mandatory": true
                    }
                ]
            };
    
            expect(metadata).toEqual(expectedResponse);
        })
    })

    test('Facebook Reach - Brand - Aggregation: 28 days', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1147391/data?v=20191203, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1147391?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [],
                aggregation: "TwentyEightDays",
                startDate: "2024-02-12T18:04:45.620Z",
                endDate: "2025-02-10T18:04:45.620Z",
                pageLevel: ["Brand"]
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221147391%22%2C%22embed%22%3A%22v2%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222024-02-12%22%2C%22end%22%3A%222025-02-10%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22UserId%22%2C%22value%22%3A%22505864%22%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22AccountOnlyOne%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22UniqueMetricsAggregation%22%2C%22value%22%3A%22days_twenty_eight%22%7D%2C%7B%22name%22%3A%22PageTypeOnlyOne%22%2C%22value%22%3A%22brand%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = expectedUrl.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Facebook Reach - Brand data - Aggregation: Day', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1147391/data?v=20191203, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1147391?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [],
                aggregation: "Day",
                startDate: "2024-02-12T18:04:45.620Z",
                endDate: "2025-02-10T18:04:45.620Z",
                pageLevel: ["Brand"]
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221147391%22%2C%22embed%22%3A%22v2%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222024-02-12%22%2C%22end%22%3A%222025-02-10%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22UserId%22%2C%22value%22%3A%221094961%22%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22AccountOnlyOne%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22UniqueMetricsAggregation%22%2C%22value%22%3A%22day%22%7D%2C%7B%22name%22%3A%22PageTypeOnlyOne%22%2C%22value%22%3A%22brand%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Facebook Reach - Brand data - Aggregation Week', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1147391/data?v=20191203, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1147391?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [],
                aggregation: "Week",
                startDate: "2024-11-14T14:38:47.563Z",
                endDate: "2025-02-11T14:38:47.563Z",
                pageLevel: ["Brand"]
            });
    
            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221147391%22%2C%22embed%22%3A%22v2%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222024-11-14%22%2C%22end%22%3A%222025-02-11%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22UserId%22%2C%22value%22%3A%221094961%22%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22AccountOnlyOne%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22UniqueMetricsAggregation%22%2C%22value%22%3A%22week%22%7D%2C%7B%22name%22%3A%22PageTypeOnlyOne%22%2C%22value%22%3A%22brand%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

})
