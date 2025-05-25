import { expect } from '@playwright/test';
import { test } from '../../setup';
import BaseCall from '../../../api/uberall/baseCall';
import schemaUtils from '../../../utils/schemaUtils';

test.describe('local-seo-api-service tests admin @localSEOMicros', async () => {
    const apiUtils = new BaseCall();
    const baseURL = process.env.LOCAL_SEO_API_SERVICE_URL

    test('Export Location Keywords', async () => {
        await test.step('send export request, validate csv headers', async () => {
            let accessToken = await (apiUtils.getAccessToken("admin+1072@uberall.com", process.env.LB_DEFAULT_PASSWORD))
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywords = ["Baufinanzierung", "Lbs"]
            const exportRequest = apiContext.post('/charts/location_ranks/keywords/export', {
                data: {
                    "max": 30,
                    "offset": 0,
                    "sortDir": "desc",
                    "locationIds": [1257325, 1257328],
                    "accountIds": [],
                    "keywords": keywords,
                    "labels": [],
                    "startDate": "2021-05-03T10:15:30+01:00",
                    "endDate": "2023-06-03T10:15:30+01:00",
                    "groupIds": []
                }
            });
            (await exportRequest).text().then(text => {
                expect(text).toContain('location_id,location_name,location_address,location_postal_code,location_locality,location_country,views,clicks,ctr,' + keywords.join(','))
            })
        })
    })

    test('Top Ranks endpoint Admin', async () => {
        await test.step('Request to /charts/top_ranks, validate schema', async () => {
            //let accessToken = await (apiUtils.getAccessToken('reportingadmin3038@uberall.com', process.env.API_PULLEDPORK_PASSWORD))
            let accessToken = await (apiUtils.getAccessToken('reportingadmin1671@uberall.com', "Asdf1231!"))
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken, 'contentType':'application/json'})
            const topRanksJson = await apiUtils.postRequest(apiContext, '/charts/top_ranks', {
                "accountIds": ["641766"],
                "groupIds": [],
                "locationIds": ["2969135", "2969136"],
                "cities": [],
                "countries": [],
                "zipCodes": [],
                "keywords": ["Möbel", "Sofa:Esstisch", "Sofas"],
                "startDate":"2022-11-01T00:00:00.493Z",
                "endDate": "2023-01-01T00:00:00.493Z"
            });

            expect((topRanksJson.response.overTime).length).toBe(3)
            new schemaUtils().validateSchema('reporting/top-ranks.json', topRanksJson)
        })
    })

    test('Location Keyword Ranks endpoint Admin', async () => {
        await test.step('Request to /charts/location_ranks/keywords, validate schema', async () => {
            let accessToken = await (apiUtils.getAccessToken('reportingadmin3038@uberall.com', process.env.API_PULLEDPORK_PASSWORD))
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/charts/location_ranks/keywords', {
                "accountIds": ["1104147"],
                "groupIds": [],
                "locationIds": ["2642705", "2642707", "2642711"],
                "cities": [],
                "countries": [],
                "zipCodes": [],
                "keywords": ["Sorbet", "Dessert"],
                "startDate":"2023-01-01T00:00:00.493Z",
                "endDate": "2024-01-01T00:00:00.493Z",
                "max": 30,
                "offset": 0,
                "sortDir": "desc"
            })
            new schemaUtils().validateSchema('reporting/location-ranks-keywords.json', keywordRanksJson)
        })
    })

    test('Biggest Movers endpoint Admin', async () => {
        await test.step('Request to /charts/biggest_movers, validate schema', async () => {
            let accessToken = await (apiUtils.getAccessToken('reportingadmin3038@uberall.com', process.env.API_PULLEDPORK_PASSWORD))
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const biggestMoversJson = await apiUtils.postRequest(apiContext, '/charts/biggest_movers', {
                "accountIds": ["1104147"],
                "groupIds": [],
                "locationIds": ["2642705", "2642707", "2642711"],
                "cities": [],
                "countries": [],
                "zipCodes": [],
                "keywords": [],
                "startDate":"2023-01-01T00:00:00.493Z",
                "endDate": "2024-01-01T00:00:00.493Z"
            });
            new schemaUtils().validateSchema('reporting/biggest-movers.json', biggestMoversJson)
        })
    })
    
    test('Export top 10 by keyword over time SP 1671', async () => {
        await test.step('Request to /charts/location_ranks_top_10/keywords, validate csv headers', async () => {
            let accessToken = await (apiUtils.getAccessToken("reportingadmin1671@uberall.com", process.env.LB_DEFAULT_PASSWORD))
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordsCsvExport = await apiContext.post('/charts/location_ranks_top_10/keywords/export', {
                data: {
                    accountIds: ["641766"],
                    groupIds: [],
                    locationIds: [1785997,2969135,2969136,2969137,2969138,2969139,2969140,2969141,2969143],
                    cities: [],
                    countries: [],
                    zipCodes: [],
                    keywords: ["Möbel", "Sofa:Esstisch", "Sofas"],
                    startDate:"2022-11-01T00:00:00.493Z",
                    endDate: "2023-01-01T00:00:00.493Z"
                }
            });
            (await keywordsCsvExport).text().then(text => {
                expect(text).toContain('month,location_id,search_term,rank,location_address');
            });
        })    
    })

    test('Competitor filters endpoint SP 1072', async () => {
        await test.step('Request to /charts/competitors, results', async () => {
            let accessToken = await (apiUtils.getAccessToken('admin+1072@uberall.com', process.env.LB_DEFAULT_PASSWORD))
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const competitorsJson = await apiUtils.postRequest(apiContext, '/charts/competitors', {
                "locationIds": [1257356, 1257360],
                "startDate": "2023-01-01T00:00:00.493Z",
                "endDate": "2024-12-01T00:00:00.493Z",
                "keywords": ["Finanzierung"],
                "query": "finanzen",
                "max": 100,
                "offset": 0
            });
            expect(competitorsJson.response.competitors).toContain("KG Finanzen")
        })
    
    })
})

test.describe('local-seo-api-service tests location manager @localSEOMicros', async () => {
    const apiUtils = new BaseCall();
    const baseURL = process.env.LOCAL_SEO_API_SERVICE_URL

    test('Top Ranks endpoint Location Manager', async () => {
        await test.step('Request to /charts/top_ranks, validate schema', async () => {
            let accessToken = await (apiUtils.getAccessToken('reportinglocqa3038@uberall.com', process.env.LB_DEFAULT_PASSWORD))
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const topRanksJson = await apiUtils.postRequest(apiContext, '/charts/top_ranks', {
                "accountIds": ["1104147"],
                "groupIds": [],
                "locationIds": ["2642705"],
                "cities": [],
                "countries": [],
                "zipCodes": [],
                "keywords": [],
                "startDate":"2023-01-01T00:00:00.493Z",
                "endDate": "2024-01-01T00:00:00.493Z"
            });
            expect((topRanksJson.response.overTime).length).toBe(13)
            new schemaUtils().validateSchema('reporting/top-ranks.json', topRanksJson)
        })
    })

    test('Location Keyword Ranks endpoint Location Manager', async () => {
        await test.step('Request to /charts/location_ranks/keywords, validate schema', async () => {
            let accessToken = await (apiUtils.getAccessToken('reportinglocqa3038@uberall.com', process.env.LB_DEFAULT_PASSWORD))
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/charts/location_ranks/keywords', {
                "accountIds": ["1104147"],
                "groupIds": [],
                "locationIds": ["2642705"],
                "cities": [],
                "countries": [],
                "zipCodes": [],
                "keywords": ["Sorbet", "Dessert"],
                "startDate":"2023-01-01T00:00:00.493Z",
                "endDate": "2024-01-01T00:00:00.493Z",
                "max": 30,
                "offset": 0,
                "sortDir": "desc"
            })
            new schemaUtils().validateSchema('reporting/location-ranks-keywords.json', keywordRanksJson)
        })
    })

    test('Biggest Movers endpoint Location Manager', async () => {
        await test.step('Request to /charts/biggest_movers, validate schema', async () => {
            let accessToken = await (apiUtils.getAccessToken('reportinglocqa3038@uberall.com', process.env.LB_DEFAULT_PASSWORD))
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const biggestMoversJson = await apiUtils.postRequest(apiContext, '/charts/biggest_movers', {
                "accountIds": ["1104147"],
                "groupIds": [],
                "locationIds": ["2642705"],
                "cities": [],
                "countries": [],
                "zipCodes": [],
                "keywords": [],
                "startDate":"2023-01-01T00:00:00.493Z",
                "endDate": "2024-01-01T00:00:00.493Z"
            });
            new schemaUtils().validateSchema('reporting/biggest-movers.json', biggestMoversJson)
        })
    })

})