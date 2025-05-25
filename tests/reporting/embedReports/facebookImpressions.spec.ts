import { expect } from '@playwright/test';
import { test } from '../../setup';
import schemaUtils from '../../../utils/schemaUtils';
import BaseCall from '../../../api/uberall/baseCall';

test.describe('Facebook Impressions - @reportingAPI @facebookImpressions', async () => {
    const apiUtils = new BaseCall();

    let accessToken = ''
    const baseURL = process.env.BASE_URL
    test.beforeAll('Get admin login token', async () => {
        accessToken = await (apiUtils.getAccessToken("3006monitoring@uberall.com", process.env.LB_DEFAULT_PASSWORD))
    })

    test('Facebook Impressions - Metadata', async () => {
        await test.step('Request to /advanced-analytics/embed-reports/1138748/metadata?v=20191203, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const metadata = await apiUtils.getRequest(apiContext, '/api/advanced-analytics/embed-reports/1138748/metadata?v=20191203');
            new schemaUtils().validateSchema('reporting/facebookImpressions-metadata.json', metadata)

            const expectedResponse = {
                "dashboard": "1138748",
                "title": "Facebook Impressions",
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
                    },
                    {
                        "name": "PageType",
                        "filterName": "pageLevel",
                        "possibleValues": [
                            "Brand",
                            "Location"
                        ],
                        "mandatory": true
                    }
                ]
            };
    
            expect(metadata).toEqual(expectedResponse);
        })
    })
})
