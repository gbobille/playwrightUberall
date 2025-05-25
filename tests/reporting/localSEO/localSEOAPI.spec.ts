import { expect } from '@playwright/test';
import { test } from '../../setup';
import schemaUtils from '../../../utils/schemaUtils';
import BaseCall from '../../../api/uberall/baseCall';

test.describe('Local SEO uberall API tests - SP 1671 admin @localseoAPI', async () => {
    const apiUtils = new BaseCall();

    let accessToken = ''
    const baseURL = process.env.BASE_URL
    test.beforeAll('Get admin login token', async () => {
        accessToken = await (apiUtils.getAccessToken("reportingadmin1671@uberall.com", process.env.LB_DEFAULT_PASSWORD))
    })

    test('Keyword Ranks - default request', async () => {
        await test.step('Request to /charts/keyword_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-12-31T00:00:00.493Z"                        
            });
            new schemaUtils().validateSchema('reporting/keyword-ranks.json', keywordRanksJson)
            keywordRanksJson.response.data.forEach(elem => {
                const value = elem.value
                const prior = elem.prior
                const diff = prior - value
                expect(diff).toEqual(elem.diff)
            })
        })
    })

    test('Keyword Ranks - Request for Same Day', async () => {
        await test.step('Request to /charts/keyword_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                startDate: "2022-06-01T00:00:00.493Z",
                endDate: "2022-06-01T23:59:59.493Z"
            });
            new schemaUtils().validateSchema('reporting/keyword-ranks.json', keywordRanksJson)
        })
    })

    test('Keyword Ranks - No End Date', async () => {
        await test.step('Request to /charts/keyword_ranks, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                startDate: "2022-06-01T00:00:00.493Z"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("'endDate' param is required for valid request")
        })
    })

    test('Keyword Ranks - No Start Date', async () => {
        await test.step('Request to /charts/keyword_ranks, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                endDate: "2022-06-01T00:00:00.493Z"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("'startDate' param is required for valid request")
        })
    })

    test('Keyword Ranks - incorrect account id format', async () => {
        await test.step('Request to /charts/keyword_ranks, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: [""],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("`The request content was malformed`: `Decoding Failures ['.accountIds[0] should be Long']`")
        })
    })

    test('Keyword Ranks - Multiple missing required fields', async () => {
        await test.step('Request to /charts/keyword_ranks, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("'startDate' param is required for valid request, 'endDate' param is required for valid request")
        })
    })

    test('Keyword Ranks - Date range larger than 1 year', async () => {
        await test.step('Request to /charts/keyword_ranks, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                startDate: "2020-06-01T00:00:00.493Z",
                endDate: "2023-06-02T00:00:00.493Z"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("date range is too long (startDate='2020-06-01T00:00:00.493Z', endDate='2023-06-30T23:59:59.999999999Z', maxRange='3 year')")
        })
    })

    test('Keyword Ranks - Start Date ahead of End Date', async () => {
        await test.step('Request to /charts/keyword_ranks, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                endDate: "2021-06-01T00:00:00.493Z",
                startDate: "2022-06-01T00:00:00.493Z"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("'endDate' param must come before 'startDate' param (startDate='2022-06-01T00:00:00.493Z', endDate='2021-06-30T23:59:59.999999999Z')")
        })
    })

    test('Keyword Ranks - Incorrect Date Format', async () => {
        await test.step('Request to /charts/keyword_ranks, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                startDate: "2022-01-01test",
                endDate: "2022-06-01T00:00:00.493Z"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("`The request content was malformed`: `Decoding Failures ['.startDate should be Text '2022-01-01test' could not be parsed at index 11']`")
        })
    })

    test('Keyword Ranks - Negative Offset', async () => {
        await test.step('Request to /charts/keyword_ranks, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                offset: -1,
                startDate: "2022-06-01T00:00:00.493Z",
                endDate: "2022-06-01T23:59:59.493Z"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("`The request content was malformed`: `Decoding Failures ['.offset does not hold (-1 < 0)']`")
        })
    })

    test('Keyword Ranks - Max larger than 1000', async () => {
        await test.step('Request to /charts/keyword_ranks, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                max: 1001,
                startDate: "2022-06-01T00:00:00.493Z",
                endDate: "2022-06-01T23:59:59.493Z"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("'max' param should be greater than 0 and less than or equal to 1000 (max: '1001')")
        })
    })

    test('Keyword Ranks - Negative Max Value', async () => {
        await test.step('Request to /keywords, validate error message', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/keyword_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                labels: [],
                page: 1,
                pageSize: 20,
                sortDir: "desc",
                max: -1,
                startDate: "2022-06-01T00:00:00.493Z",
                endDate: "2022-06-01T23:59:59.493Z"
            }, /* allowErrors */ true);
            expect(keywordRanksJson.message).toEqual("`The request content was malformed`: `Decoding Failures ['.max does not hold (-1 < 0)']`")
        })
    })

    test('Keywords - default request', async () => {
        await test.step('Request to /keywords, validate schema + keyword count', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordsJson = await apiUtils.postRequest(apiContext, '/api/local-seo/keywords', {
                accountIds: ["641766"],
                locationIds: []
            });
            new schemaUtils().validateSchema('reporting/keyword-ranks.json', keywordsJson)
            const keywordCount = (keywordsJson.response.keywords).length
            expect(keywordsJson.response.count).toEqual(keywordCount)
        })
    })

    test('Location Rank Export', async () => {
        await test.step('Request to /charts/location_ranks/export, validate csv headers', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const locationRankExportRequest = apiContext.post('/api/local-seo/charts/location_ranks/export', {
                data: {
                    accountIds: ["641766"],
                    locationIds: [],
                    startDate: "2022-06-01T00:00:00.493Z",
                    endDate: "2022-12-01T00:00:00.493Z"
                }
            });
            (await locationRankExportRequest).text().then(text => {
                expect(text).toContain('rank,location_id,location_name,location_address,location_locality,location_postal_code,location_country,views,clicks,ctr,direct_queries,indirect_queries,total_posts')
            })
        })
    })

    test('Competitor Ranks', async () => {
        await test.step('Request to /charts/competitor_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const competitorRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/competitor_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z"
            });
            new schemaUtils().validateSchema('reporting/competitor-ranks.json', competitorRanksJson)
        })
    })

    test('Location Ranks', async () => {
        await test.step('Request to /charts/location_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const locationRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/location_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z",
                keywords: ["pizza"]
            });
            new schemaUtils().validateSchema('reporting/location-ranks.json', locationRanksJson)
        })
    })

    test('Search Ranks', async () => {
        await test.step('Request to /charts/search_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const searchRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/search_ranks', {
                accountIds: ["641766"],
                locationIds: [],
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z"
            });
            new schemaUtils().validateSchema('reporting/search-ranks.json', searchRanksJson)
        });
    })

})

test.describe('Local SEO uberall API tests - SP 348 single-location user @localseoAPI', async () => {
    const apiUtils = new BaseCall();

    let accessToken = ''
    const baseURL = process.env.BASE_URL
    test.beforeAll('Get admin login token', async () => {
        accessToken = await (apiUtils.getAccessToken("sentiment348loc@uberall.com", process.env.API_PULLEDPORK_PASSWORD))
    })

    test('Competitor Ranks as a Location Manager with empty AccountID', async () => {
        await test.step('Request to /charts/competitor_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const competitorRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/competitor_ranks', {
                accountIds: [],
                locationIds: ["2971048"],
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z"
            });
            new schemaUtils().validateSchema('reporting/competitor-ranks.json', competitorRanksJson)
        })
    })

    test('Competitor Ranks as a Location Manager with AccountId Null', async () => {
        await test.step('Request to /charts/competitor_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const competitorRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/competitor_ranks', {
                accountIds: null,
                locationIds: ["2971048"],
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z"
            });
            new schemaUtils().validateSchema('reporting/competitor-ranks.json', competitorRanksJson)
        })    
    })

    test('Location Ranks as a Location Manager with empty AccountID', async () => {
        await test.step('Request to /charts/location_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const locationRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/location_ranks', {
                accountIds: [],
                locationIds: ["2971048"],
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z",
                max: 7,
                offset: 0,
                sort: "rank",
                sortDir: "desc",
                cities: [],
                countries: [],
                zipCodes: [],
                keywords: [],
                labels: []
            });
            new schemaUtils().validateSchema('reporting/location-ranks.json', locationRanksJson)
        })    
    })

    test('Location Ranks as a Location Manager with AccountId Null', async () => {
        await test.step('Request to /charts/location_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const locationRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/location_ranks', {
                accountIds: null,
                locationIds: ["2971048"],
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z",
                max: 7,
                offset: 0,
                sort: "rank",
                sortDir: "desc",
                cities: [],
                countries: [],
                zipCodes: [],
                keywords: [],
                labels: []
            });
            new schemaUtils().validateSchema('reporting/location-ranks.json', locationRanksJson)
        })    
    })

    test('Keywords as a Location Manager with empty AccountID', async () => {
        const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
        const keywordsJson = await apiUtils.postRequest(apiContext, '/api/local-seo/keywords', {
            accountIds: [],
            locationIds: ["2971048"],
            query: "",
            offset: 0,
            "max": 50,
            fieldMask: "name",
            queryFields: [
                "name",
                "identifier"
            ]
        });
        new schemaUtils().validateSchema('reporting/keywords.json', keywordsJson)
    })

    test('Keywords as a Location Manager with AccountId Null', async () => {
        const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
        const keywordsJson = await apiUtils.postRequest(apiContext, '/api/local-seo/keywords', {
            accountIds: null,
            locationIds: ["2971048"],
            query: "",
            offset: 0,
            "max": 50,
            fieldMask: "name",
            queryFields: [
                "name",
                "identifier"
            ]
        });
        new schemaUtils().validateSchema('reporting/keywords.json', keywordsJson)    
    })
    
    test('Search Ranks as a Location Manager with empty AccountID', async () => {
        await test.step('Request to /charts/search_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const searchRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/search_ranks', {
                accountIds: [],
                locationIds: ["2971048"],
                cities: [],
                countries: [],
                zipCodes: [],
                keywords: [],
                labels: [],
                groupIds: [],
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z"
            });
            new schemaUtils().validateSchema('reporting/search-ranks.json', searchRanksJson)
        });    
    })
    
    test('Search Ranks as a Location Manager with AccountId Null', async () => {
        await test.step('Request to /charts/search_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const searchRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/search_ranks', {
                accountIds: null,
                locationIds: ["2971048"],
                cities: [],
                countries: [],
                zipCodes: [],
                keywords: [],
                labels: [],
                groupIds: [],
                startDate: "2022-01-01T00:00:00.493Z",
                endDate: "2022-06-01T00:00:00.493Z"
            });
            new schemaUtils().validateSchema('reporting/search-ranks.json', searchRanksJson)
        });    
    })
})

test.describe('Local SEO uberall API tests - SP 348 multi-location user @localseoAPI', async () => {
    const apiUtils = new BaseCall();

    let accessToken = ''
    const baseURL = process.env.BASE_URL
    test.beforeAll('Get admin login token', async () => {
        accessToken = await (apiUtils.getAccessToken("reportingmulti348@uberall.com", process.env.API_PULLEDPORK_PASSWORD))
    })

    test('multi-location keywords', async () => {
        await test.step('Request to /keywords, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const keywordsJson = await apiUtils.postRequest(apiContext, '/api/local-seo/keywords', {
                locationIds: [],
                accountIds: [],
                fieldMask: ["name"],
                queryFields: ["name"],
                query: ""         
            });
            new schemaUtils().validateSchema('reporting/keywords.json', keywordsJson)
        })
    })
    
    test('multi-location competitor ranks', async () => {
        await test.step('Request to /charts/competitor_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const competitorRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/competitor_ranks', {
                accountIds: [],
                cities: [],
                countries: [],
                zipCodes: [],
                locationIds: [],
                groupIds: [],
                keywords: [],
                labels: [],
                startDate: "2023-07",
                endDate: "2023-12"
            });
            new schemaUtils().validateSchema('reporting/competitor-ranks.json', competitorRanksJson)
        })
    })

    test('multi-location search ranks', async () => {
        await test.step('Request to /charts/search_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const searchRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/search_ranks', {
                accountIds: [],
                cities: [],
                countries: [],
                zipCodes: [],
                locationIds: [],
                groupIds: [],
                keywords: [],
                labels: [],
                startDate: "2023-07",
                endDate: "2023-12"
            });
            new schemaUtils().validateSchema('reporting/search-ranks.json', searchRanksJson)
        })
    })

    test('multi-location location ranks', async () => {
        await test.step('Request to /charts/location_ranks, validate schema', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const locationRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/location_ranks', {
                accountIds: [],
                cities: [],
                countries: [],
                zipCodes: [],
                locationIds: [],
                groupIds: [],
                keywords: [],
                labels: [],
                startDate: "2023-07",
                endDate: "2023-12"
            });
            new schemaUtils().validateSchema('reporting/location-ranks.json', locationRanksJson)
        })
    })

})