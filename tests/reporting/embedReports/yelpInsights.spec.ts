import { expect } from '@playwright/test';
import { test } from '../../setup';
import schemaUtils from '../../../utils/schemaUtils';
import BaseCall from '../../../api/uberall/baseCall';

test.describe('Yelp Insights - @reportingAPI @yelpInsights', async () => {
    const apiUtils = new BaseCall();

    let accessToken = ''
    const baseURL = process.env.BASE_URL
    test.beforeAll('Get admin login token', async () => {
        accessToken = await (apiUtils.getAccessToken("3006monitoring@uberall.com", process.env.LB_DEFAULT_PASSWORD))
    })


    test('Yelp Insights - Metadata', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/metadata?v=20191203, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const metadata = await apiUtils.getRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727/metadata?v=20191203');
            new schemaUtils().validateSchema('reporting/yelp-metadata.json', metadata)
            const expectedResponse = {
                "dashboard": "1135727",
                "title": "Yelp Insights",
                "filters": [
                    {
                        "name": "Account",
                        "filterName": "accountIds",
                        "mandatory": true
                    },
                    {
                        "name": "Locations",
                        "filterName": "locationIds",
                        "mandatory": false
                    },
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
                        "filterName": "Aggregation",
                        "possibleValues": [
                            "Monthly",
                            "Weekly",
                            "Yearly"
                        ],
                        "mandatory": true
                    }
                ]
            };

            expect(metadata).toEqual(expectedResponse);
        })
    })

    test('Yelp Insights - Monthly Aggregation', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/data?v=20191203, validate Periscope URL', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [],
                startDate: "2024-08-18T13:02:17.367Z",
                endDate: "2024-11-15T13:02:17.367Z",
                aggregation: "Monthly"
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221135727%22%2C%22embed%22%3A%22v2%22%2C%22aggregation%22%3A%22Monthly%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222024-08-18%22%2C%22end%22%3A%222024-11-15%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22LocationsByFilter%22%2C%22value%22%3A%22UserId%22%7D%2C%7B%22name%22%3A%22UserId%22%2C%22value%22%3A%221094961%22%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22Aggregation%22%2C%22value%22%3A%22Monthly%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Yelp Insights - Weekly Aggregation', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/data?v=20191203, validate Periscope URL', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [],
                startDate: "2024-08-18T13:02:17.367Z",
                endDate: "2024-11-15T13:02:17.367Z",
                aggregation: "Weekly"
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221135727%22%2C%22embed%22%3A%22v2%22%2C%22aggregation%22%3A%22Weekly%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222024-08-18%22%2C%22end%22%3A%222024-11-15%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22LocationsByFilter%22%2C%22value%22%3A%22UserId%22%7D%2C%7B%22name%22%3A%22UserId%22%2C%22value%22%3A%221094961%22%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22Aggregation%22%2C%22value%22%3A%22Weekly%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Yelp Insights - Yearly Aggregation', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/data?v=20191203, validate Periscope URL', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [],
                startDate: "2023-11-17T13:02:17.367Z",
                endDate: "2024-11-15T13:02:17.367Z",
                aggregation: "Yearly"
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221135727%22%2C%22embed%22%3A%22v2%22%2C%22aggregation%22%3A%22Yearly%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222023-11-17%22%2C%22end%22%3A%222024-11-15%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22LocationsByFilter%22%2C%22value%22%3A%22UserId%22%7D%2C%7B%22name%22%3A%22UserId%22%2C%22value%22%3A%221094961%22%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22Aggregation%22%2C%22value%22%3A%22Yearly%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Yelp Insights - Monthly Aggregation - Multiple Locations', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/data?v=20191203, validate Periscope URL', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [2674883, 2674884, 2674885],
                startDate: "2024-08-18T13:02:17.367Z",
                endDate: "2024-11-15T13:02:17.367Z",
                aggregation: "Monthly"
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221135727%22%2C%22embed%22%3A%22v2%22%2C%22aggregation%22%3A%22Monthly%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222024-08-18%22%2C%22end%22%3A%222024-11-15%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22LocationsByFilter%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22Locations%22%2C%22value%22%3A%5B%222674883%22%2C%222674884%22%2C%222674885%22%5D%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22Aggregation%22%2C%22value%22%3A%22Monthly%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Yelp Insights - Monthly Aggregation - Single Location', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/data?v=20191203, validate Periscope URL', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [2686912],
                startDate: "2024-08-18T13:02:17.367Z",
                endDate: "2024-11-15T13:02:17.367Z",
                aggregation: "Monthly"
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221135727%22%2C%22embed%22%3A%22v2%22%2C%22aggregation%22%3A%22Monthly%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222024-08-18%22%2C%22end%22%3A%222024-11-15%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22LocationsByFilter%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22Locations%22%2C%22value%22%3A%5B%222686912%22%5D%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22Aggregation%22%2C%22value%22%3A%22Monthly%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Yelp Insights - Weekly Aggregation - Multiple Locations', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/data?v=20191203, validate Periscope URL', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [2674883, 2674884, 2674885],
                startDate: "2024-08-18T13:02:17.367Z",
                endDate: "2024-11-15T13:02:17.367Z",
                aggregation: "Weekly"
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221135727%22%2C%22embed%22%3A%22v2%22%2C%22aggregation%22%3A%22Weekly%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222024-08-18%22%2C%22end%22%3A%222024-11-15%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22LocationsByFilter%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22Locations%22%2C%22value%22%3A%5B%222674883%22%2C%222674884%22%2C%222674885%22%5D%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22Aggregation%22%2C%22value%22%3A%22Weekly%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";
            
            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Yelp Insights - Weekly Aggregation - Single Location', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/data?v=20191203, validate Periscope URL', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [2686912],
                startDate: "2024-08-18T13:02:17.367Z",
                endDate: "2024-11-15T13:02:17.367Z",
                aggregation: "Weekly"
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221135727%22%2C%22embed%22%3A%22v2%22%2C%22aggregation%22%3A%22Weekly%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222024-08-18%22%2C%22end%22%3A%222024-11-15%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22LocationsByFilter%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22Locations%22%2C%22value%22%3A%5B%222686912%22%5D%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22Aggregation%22%2C%22value%22%3A%22Weekly%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Yelp Insights - Yearly Aggregation - Multiple Locations', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/data?v=20191203, validate Periscope URL', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [2674883, 2674884, 2674885],
                startDate: "2023-11-17T13:02:17.367Z",
                endDate: "2024-11-15T13:02:17.367Z",
                aggregation: "Yearly"
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221135727%22%2C%22embed%22%3A%22v2%22%2C%22aggregation%22%3A%22Yearly%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222023-11-17%22%2C%22end%22%3A%222024-11-15%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22LocationsByFilter%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22Locations%22%2C%22value%22%3A%5B%222674883%22%2C%222674884%22%2C%222674885%22%5D%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22Aggregation%22%2C%22value%22%3A%22Yearly%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";
            
            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })

    test('Yelp Insights - Yearly Aggregation - Single Location', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1135727/data?v=20191203, validate Periscope URL', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const data = await apiUtils.postRequest(apiContext, '/api/advanced-analytics/embed-reports/1135727?v=20191203', {
                accountIds: [1107503],
                groupIds: [],
                locationIds: [2686912],
                startDate: "2023-11-17T13:02:17.367Z",
                endDate: "2024-11-15T13:02:17.367Z",
                aggregation: "Yearly"
            });

            const expectedUrl = "https://app.periscopedata.com/api/embedded_dashboard?data=%7B%22dashboard%22%3A%221135727%22%2C%22embed%22%3A%22v2%22%2C%22aggregation%22%3A%22Yearly%22%2C%22border%22%3A%22off%22%2C%22daterange%22%3A%7B%22start%22%3A%222023-11-17%22%2C%22end%22%3A%222024-11-15%22%7D%2C%22filters%22%3A%5B%7B%22name%22%3A%22ReportType%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22LocationsByFilter%22%2C%22value%22%3A%22Locations%22%7D%2C%7B%22name%22%3A%22Locations%22%2C%22value%22%3A%5B%222686912%22%5D%7D%2C%7B%22name%22%3A%22Account%22%2C%22value%22%3A%221107503%22%7D%2C%7B%22name%22%3A%22Directories%22%2C%22value%22%3A%5B%22Facebook%22%2C%22Google%22%2C%22Yelp%22%2C%22TripAdvisor%22%5D%7D%2C%7B%22name%22%3A%22SalesPartner%22%2C%22value%22%3A%223006%22%7D%2C%7B%22name%22%3A%22ListingType%22%2C%22value%22%3A%5B%22Organic%22%2C%22Paid%22%5D%7D%2C%7B%22name%22%3A%22Aggregation%22%2C%22value%22%3A%22Yearly%22%7D%5D%2C%22visible%22%3A%5B%5D%2C%22data_ts%22%3A";

            const actualUrl = data.url.split('%22data_ts%22%3A')[0] + '%22data_ts%22%3A';
            expect(actualUrl).toBe(expectedUrl);
        })
    })
})