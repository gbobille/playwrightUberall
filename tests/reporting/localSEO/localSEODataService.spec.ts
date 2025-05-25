import { expect } from '@playwright/test';
import { test } from '../../setup';
import BaseCall from '../../../api/uberall/baseCall';
import schemaUtils from '../../../utils/schemaUtils';

test.describe('local-seo-data-service tests @localSEOMicros', async () => {
    const apiUtils = new BaseCall();
    let baseURL = process.env.LOCAL_SEO_DATA_SERVICE_URL


    test('Keywords Sorting Ascending', async () => {
        await test.step('Request to /keywords, validate response is sorted', async () => {
            const apiContext = await apiUtils.createApiContextURLOnly(baseURL)
            const keywordsJson = await apiUtils.getRequest(apiContext, '/keywords', {
                "accountIds": [],
                "locationIds": [2987587, 3029701, 3917974, 3917975, 3917976, 3917977],
                "groupIds": [],
                "offset": 0,
                "max": 20,
                "sortDir": "asc"
            });
            expect(keywordsJson.response.results).toEqual(keywordsJson.response.results.sort())
        })
    })

    test('Keywords Sorting Descending', async () => {
        await test.step('Request to /keywords, validate response is sorted', async () => {
            const apiContext = await apiUtils.createApiContextURLOnly(baseURL)
            const keywordsJson = await apiUtils.getRequest(apiContext, '/keywords', {
                "accountIds": [],
                "locationIds": [2987587, 3029701, 3917974, 3917975, 3917976, 3917977],
                "groupIds": [],
                "offset": 0,
                "max": 20,
                "sortDir": "desc"
            });
            expect(keywordsJson.response.results).toEqual(keywordsJson.response.results.sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ? -1 : 1))
        })
        
    })

    test('Export top 10 by keyword over time SP 1671', async () => {
        await test.step('Request to /charts/location_ranks_top_10/keywords, validate response schema', async () => {
            const apiContext = await apiUtils.createApiContextURLOnly(baseURL)
            const keywordsJson = await apiUtils.postRequest(apiContext, '/charts/location_ranks_top_10/keywords', {
                "locationIds": [1785997,2969135,2969136,2969137,2969138,2969139,2969140,2969141,2969143],
                "offset": 0,
                "max": 100,
                "startDate": "2022-11-01",
                "endDate": "2022-12-31",
                "keywords": ["Inneneinrichtung", "Möbel", "Sofa:Esstisch", "Sofas"]
            });
            new schemaUtils().validateSchema('reporting/keywords-top-10-export.json', keywordsJson)
        })
    })

    test('Competitor filters endpoint SP 1072', async () => {
        await test.step('Request to /charts/competitors, validate response contents', async () => {
            const apiContext = await apiUtils.createApiContextURLOnly(baseURL)
            const competitorsJson = await apiUtils.getRequest(apiContext, '/charts/competitors', {
                "locationIds": [1257356, 1257360],
                "startDate": "2023-01-01T00:00:00.493Z",
                "endDate": "2024-12-01T00:00:00.493Z",
                "keywords": ["Finanzierung"],
                "query": "finanzen",
                "max": 100,
                "offset": 0
            });
            expect(competitorsJson.response.results).toContain("KG Finanzen")
        })
    })

    test('Location Rank Keywords with apostrophes SP 2982', async () => {
        await test.step('Request to /charts/location_ranks/keywords, validate response contents', async () => {
            const apiContext = await apiUtils.createApiContextURLOnly(baseURL);
            const competitorsJson = await apiUtils.getRequest(apiContext, '/charts/location_ranks/keywords', {
                "locationIds": [2600274, 2600279],
                "startDate":"2024-09-01T00:00Z",
                "endDate":"2025-02-28T23:59:59.999999999Z",
                "keywords": [
                    "Groceries",
                    "Grocery Store Near Me",
                    "Produce",
                    "Raley'S Ad",
                    "Raley'S Grocery",
                    "Raley'S Grocery Store",
                    "Raley'S Hours",
                    "Raley'S Market",
                    "Raley'S Store",
                    "Raley'S ",
                    "Supermarket",
                    "Raley'S Weekly Ad"
                ],
                "sortDir": "asc",
                "max": 100,
                "offset": 0
            });
    
            const results = competitorsJson.response.results;
    
            for (const result of results) {
                for (const locationRank of result.locationRanks) {
                    expect(locationRank).toHaveProperty('ranking');
                }
            }
        });
    });
})