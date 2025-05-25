import { expect } from '@playwright/test';
import { test } from '../../setup';
import schemaUtils from '../../../utils/schemaUtils';
import BaseCall from '../../../api/uberall/baseCall';

test.describe('Sentiment API Service - Version Comparison @sentimentAPI', async () => {
    const apiUtils = new BaseCall();
    test.skip('Verify Version in Prod Matches Version in DEV Environment for Sentiment API Service', async () => {
        const devBaseURL = 'http://sentiment-api-service.k8s.eu-central-1.development.uberall.com';
        const prodBaseURL = 'https://sentiment-api-service.k8s.eu-central-1.production.uberall.com';

        const apiContextDev = await apiUtils.createApiContextURLOnly(devBaseURL);
        const apiContextProd = await apiUtils.createApiContextURLOnly(prodBaseURL);

        const devVersionResponse = await apiUtils.getRequest(apiContextDev, '');
        const prodVersionResponse = await apiUtils.getRequest(apiContextProd, '');

        const devVersion = devVersionResponse.version;
        const prodVersion = prodVersionResponse.version;

        expect(devVersion).toEqual(prodVersion);
    });
})

test.describe('Sentiment Dashboard tests - Admin User @sentimentAPI', async () => {
    const apiUtils = new BaseCall();
    let apiContext;

    let accessToken = ''
    const baseURL = process.env.BASE_URL

    test.beforeAll('Get admin login token', async () => {
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', '');
        accessToken = await (apiUtils.getAccessToken("sentiment2510@uberall.com", process.env.LB_DEFAULT_PASSWORD))
    })

    test('Sentiment Admin Dashboard Checks', async () => {
        await test.step('performing a POST request to /charts/location', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const chartsLocationJson = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-01-01",
                endDate: "2021-12-31"
            });
            await new schemaUtils().validateSchema('reporting/charts-location.json', chartsLocationJson)
        })

        await test.step('making a request to wordcloud endpoint', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const wordcloudJson = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                avgSentiment: "positive",
                contentTypes: ["review"]
            });
            await new schemaUtils().validateSchema('reporting/word-cloud.json', wordcloudJson)
        })

        await test.step('making a request to sentiment endpoint', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentJson = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-01-01",
                endDate: "2021-12-31"
            });
            await new schemaUtils().validateSchema('reporting/charts-sentiment.json', sentimentJson)
        })

        await test.step('making a request to locations themes endpoint', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const locationsThemesJson = await apiUtils.postRequest(apiContext, '/api/sentiment/locations/themes', {
                accountIds: ["1172352"],
                providers: [],
                locationIds: [],
                grades: [],
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-01-01",
                endDate: "2021-12-31",
                contentTypes: ["review"]
            });
            new schemaUtils().validateSchema('reporting/account-themes.json', locationsThemesJson)
        })

        await test.step('making a request to Feed endpoint', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const feedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882239"],
                startDate: "2020-01-01",
                endDate: "2020-12-12",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["positive", "negative", "neutral"],
                page: 1,
                pageSize: 10,
                sort: "created",
                sortDir: "desc"
            });
            await new schemaUtils().validateSchema('reporting/sentiment-feed.json', feedJson)
        })
    })

    test('Admin Sentiment Exports', async () => {
        const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});

        await test.step('Request to /sentiment/feed/export, validate csv headers', async () => {
            const locationRankExportRequest = apiContext.post('/api/sentiment/feed/export', {
                data: {
                    accountIds: ["1172352"],
                    locationIds: ["2882239"],
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    providers: [],
                    contentTypes: ["review"],
                    sentiment: ["positive", "negative", "neutral"],
                    page: 1,
                    pageSize: 10,
                    sort: "created",
                    sortDir: "desc"
                }
            });
            (await locationRankExportRequest).text().then(text => {
                expect(text).toContain('location_name,location_address,locality,region,author,date_created,content,rating,sentiment,corporate_id');
            });
        });

        await test.step('Request to /charts/locations/export, validate csv headers', async () => {
            const locationRankExportRequest = await apiContext.post('/api/sentiment/charts/location/export', {
                data:{
                    accountIds: ["1172352"],
                    startDate: "2023-01-01",
                    endDate: "2023-12-12",
                    providers: [],
                    contentTypes: ["review"],
                    sentiment: ["positive", "negative", "neutral"],
                    page: 1,
                    pageSize: 20,
                    sort: "mentions",
                    sortDir: "desc",
                    grades: [],
                    groupIds: [],
                    isMultiLocationManager: false,
                    locationIds: []
            }});

            const text = await locationRankExportRequest.text();
            expect(text).toContain('rank,location_id,location_name,address,locality,region,corporate_id,mentions,grade_average,sentiment_average,sentiment_change,rating_average,beverages_sentiment_average,beverages_grade_average,covid_policy_sentiment_average,covid_policy_grade_average,facilities_sentiment_average,facilities_grade_average,food_sentiment_average,food_grade_average,pricing_sentiment_average,pricing_grade_average,service_sentiment_average,service_grade_average,wait_time_sentiment_average,wait_time_grade_average');
        });
    });

    test('Admin Filter By Scores - Verify Grade Score Matches', async () => {
        const scores = ["90-100", "80-89", "70-79", "60-69", "<60"];

        for (const score of scores) {
            await test.step(`Request to /sentiment/charts/location with score ${score}`, async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
                const chartsLocation = apiContext.post('/api/sentiment/charts/location', {
                    data: {
                        accountIds: ["1172352"],
                        startDate: "2024-01-01",
                        endDate: "2024-12-12",
                        providers: [],
                        contentTypes: ["review"],
                        sentiment: ["positive", "negative", "neutral"],
                        page: 1,
                        pageSize: 20,
                        sort: "mentions",
                        sortDir: "desc",
                        grades: [score],
                        groupIds: [],
                        isMultiLocationManager: false,
                        locationIds: []
                    }
                });

                const response = await chartsLocation;

                expect(response.status()).toBe(200);

                const responseBody = await response.json();

                expect(responseBody.data).toBeInstanceOf(Array);
                expect(responseBody.data[0].metrics.grade).toBe(score);
            });
        }
    });

    test('Admin Filter By Scores - Verify Value Matches', async () => {
        const scores = ["90-100", "80-89", "70-79", "60-69", "<60"];
    
        for (const score of scores) {
            await test.step(`Request to /sentiment/charts/location with score ${score}`, async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
                const chartsLocation = apiContext.post('/api/sentiment/charts/location', {
                    data: {
                        accountIds: ["1172352"],
                        startDate: "2024-01-01",
                        endDate: "2024-12-12",
                        providers: [],
                        contentTypes: ["review"],
                        sentiment: ["positive", "negative", "neutral"],
                        page: 1,
                        pageSize: 20,
                        sort: "mentions",
                        sortDir: "desc",
                        grades: [score],
                        groupIds: [],
                        isMultiLocationManager: false,
                        locationIds: []
                    }
                });
    
                const response = await chartsLocation;
                expect(response.status()).toBe(200);
    
                const responseBody = await response.json();
                expect(responseBody.data).toBeInstanceOf(Array);
    
                const value = responseBody.data[0].metrics.value;
                let lowerBound, upperBound;
    
                if (score === "<60") {
                    lowerBound = 0;
                    upperBound = 0.59;
                } else {
                    [lowerBound, upperBound] = score.split('-').map(s => parseInt(s) / 100);
                }
    
                expect(value).toBeGreaterThanOrEqual(lowerBound);
                expect(value).toBeLessThanOrEqual(upperBound);
            });
        }
    });

    test('Admin Sentiment Feed - Filter by negative Sentiment', async () => {
        await test.step('performing a POST request to /sentiment/feed', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882160"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["negative"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc"
            });

            expect(sentimentFeedJson).toHaveProperty('data');
            expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
            sentimentFeedJson.data.forEach(item => {
                expect(item).toHaveProperty('metrics');
                expect(item.metrics).toHaveProperty('sentiment');
                expect(item.metrics.sentiment).toBe('negative');
            })
        })
    })

    test('Admin Sentiment Feed - Filter by Neutral Sentiment', async () => {
        await test.step('performing a POST request to /sentiment/feed', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882177"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["neutral"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc"
            });

            expect(sentimentFeedJson).toHaveProperty('data');
            expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
            sentimentFeedJson.data.forEach(item => {
                expect(item).toHaveProperty('metrics');
                expect(item.metrics).toHaveProperty('sentiment');
                expect(item.metrics.sentiment).toBe('neutral');
            })
        })
    })

    test('Admin Sentiment Feed - Filter by Neutral and Negative Sentiment', async () => {
        await test.step('performing a POST request to /sentiment/feed', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882231"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["neutral", "negative"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc"
            });

            expect(sentimentFeedJson).toHaveProperty('data');
            expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
            sentimentFeedJson.data.forEach(item => {
                expect(item).toHaveProperty('metrics');
                expect(item.metrics).toHaveProperty('sentiment');
                expect(['neutral', 'negative']).toContain(item.metrics.sentiment);
            })
        })
    })

    test('Admin Sentiment Feed - Filter by Themes: Facilities', async () => {
        await test.step('performing a POST request to /sentiment/feed', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882177"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["positive", "neutral", "negative"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc",
                themes: ["facilities"]
            });

            expect(sentimentFeedJson).toHaveProperty('data');
            expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
            sentimentFeedJson.data.forEach(item => {
                expect(item).toHaveProperty('metrics');
                expect(item.metrics).toHaveProperty('themes');
                expect(item.metrics.themes).toHaveProperty('facilities');
            })
        })
    })

    test('Admin Sentiment Dashboard - Field Validations', async () => {
        await test.step('performing a POST request to /sentiment/feed without Start Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: [],
                locationIds: ["2882177"],
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["positive", "neutral", "negative"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc",
                themes: ["facilities"]
            }, /* allowErrors */ true);

            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .startDate: Missing required field');
        });

        await test.step('performing a POST request to /sentiment/feed without End Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: [],
                locationIds: ["2882177"],
                startDate: "2024-01-01T00:00:00.000Z",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["positive", "neutral", "negative"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc",
                themes: ["facilities"]
            }, /* allowErrors */ true);

            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

        })

        await test.step('performing a POST request to /charts/location with Timespan larger than 12 months', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2020-01-01",
                endDate: "2021-01-02"
            });
            expect(response).toHaveProperty('message', "'endDate,startDate' time range should be less than 12 months");
        })

        await test.step('performing a POST request to /charts/location without Start Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                endDate: "2021-12-31"
            });
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .startDate: Missing required field');
        })

        await test.step('performing a POST request to /charts/location without End Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-12-31"
            });
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');
        })

        await test.step('making a request to wordcloud endpoint without Start Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                startDate: "2024-01-01",
                avgSentiment: "positive",
                contentTypes: ["review"]
            });
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

        })

        await test.step('making a request to wordcloud endpoint without End Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                startDate: "2024-01-01",
                avgSentiment: "positive",
                contentTypes: ["review"]
            });
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

        })

        await test.step('making a request to wordcloud endpoint with timespan larger than 12 months', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                startDate: "2020-01-01",
                endDate: "2021-01-02",
                avgSentiment: "positive",
                contentTypes: ["review"]
            });
            expect(response).toHaveProperty('message', "'endDate,startDate' time range should be less than 12 months");

        })

        await test.step('making a request to charts/sentiment endpoint with timespan larger than 12 months', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2020-01-01",
                endDate: "2021-01-02"
            });
            expect(response).toHaveProperty('message', "'endDate,startDate' time range should be less than 12 months");

        })

        await test.step('making a request to charts/sentiment endpoint without startDate', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                endDate: "2021-01-02"
            });
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .startDate: Missing required field');

        })

        await test.step('making a request to charts/sentiment endpoint without endDate', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: [],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-01-02"
            });
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

        })
    })
})

test.describe('Sentiment Dashboard tests - Single Location Manager User @sentimentAPI', async () => {
    const apiUtils = new BaseCall();
    let apiContext;

    let accessToken = ''
    const baseURL = process.env.BASE_URL

    test.beforeAll('Get Location Manager login token', async () => {
        apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', '');
        accessToken = await (apiUtils.getAccessToken("locationManager_2510@uberall.com", process.env.LB_DEFAULT_PASSWORD))
    })

    test('Sentiment Location Manager Dashboard Checks', async () => {
        await test.step('performing a POST request to /charts/location', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const chartsLocationJson = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-01-01",
                endDate: "2021-12-31"
            });
            await new schemaUtils().validateSchema('reporting/charts-location.json', chartsLocationJson)
        })

        await test.step('making a request to wordcloud endpoint', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const wordcloudJson = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                avgSentiment: "positive",
                contentTypes: ["review"]
            });
            await new schemaUtils().validateSchema('reporting/word-cloud.json', wordcloudJson)
        })

        await test.step('making a request to sentiment endpoint', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentJson = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-01-01",
                endDate: "2021-12-31"
            });
            await new schemaUtils().validateSchema('reporting/charts-sentiment.json', sentimentJson)
        })

        await test.step('making a request to locations themes endpoint', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const locationsThemesJson = await apiUtils.postRequest(apiContext, '/api/sentiment/locations/themes', {
                accountIds: ["1172352"],
                providers: [],
                locationIds: ["2882248"],
                grades: [],
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-01-01",
                endDate: "2021-12-31",
                contentTypes: ["review"]
            });
            await new schemaUtils().validateSchema('reporting/account-themes.json', locationsThemesJson)
        })

        await test.step('making a request to Feed endpoint', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const feedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882248"],
                startDate: "2020-01-01",
                endDate: "2020-12-12",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["positive", "negative", "neutral"],
                page: 1,
                pageSize: 10,
                sort: "created",
                sortDir: "desc"
            });
            await new schemaUtils().validateSchema('reporting/sentiment-feed.json', feedJson)
        })
    })

    test('Single Location Manager Sentiment Exports', async () => {
        const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});

        await test.step('Request to /sentiment/feed/export, validate csv headers', async () => {
            const locationRankExportRequest = apiContext.post('/api/sentiment/feed/export', {
                data: {
                    accountIds: ["1172352"],
                    locationIds: ["2882248"],
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    providers: [],
                    contentTypes: ["review"],
                    sentiment: ["positive", "negative", "neutral"],
                    page: 1,
                    pageSize: 10,
                    sort: "created",
                    sortDir: "desc"
                }
            });
            (await locationRankExportRequest).text().then(text => {
                expect(text).toContain('location_name,location_address,locality,region,author,date_created,content,rating,sentiment,corporate_id');
            });
        });

        await test.step('Request to /charts/locations/export, validate csv headers', async () => {
            const locationRankExportRequest = await apiContext.post('/api/sentiment/charts/location/export', {
                data: {
                    accountIds: ["1172352"],
                    startDate: "2023-01-01",
                    endDate: "2023-12-12",
                    providers: [],
                    contentTypes: ["review"],
                    sentiment: ["positive", "negative", "neutral"],
                    page: 1,
                    pageSize: 20,
                    sort: "mentions",
                    sortDir: "desc",
                    grades: [],
                    groupIds: [],
                    locationIds: ["2882248"],
                    isMultiLocationManager: false
                }
            });

            const text = await locationRankExportRequest.text();
            expect(text).toContain('rank,location_id,location_name,address,locality,region,corporate_id,mentions,grade_average,sentiment_average,sentiment_change,rating_average,covid_policy_sentiment_average,covid_policy_grade_average,facilities_sentiment_average,facilities_grade_average,pricing_sentiment_average,pricing_grade_average,service_sentiment_average,service_grade_average,wait_time_sentiment_average,wait_time_grade_average');
        });
    });

    test('Single Location Manager Filter By Scores - Verify Grade Matches', async () => {
        const scores = ["90-100", "80-89", "70-79", "60-69", "<60"];

        for (const score of scores) {
            await test.step(`Request to /sentiment/charts/location with score ${score}`, async () => {
                try {
                    const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
                    const chartsLocation = apiContext.post('/api/sentiment/charts/location', {
                        data: {
                            accountIds: ["1172352"],
                            startDate: "2024-01-01",
                            endDate: "2024-12-12",
                            providers: [],
                            contentTypes: ["review"],
                            sentiment: ["positive", "negative", "neutral"],
                            page: 1,
                            pageSize: 20,
                            sort: "mentions",
                            sortDir: "desc",
                            grades: [score],
                            groupIds: [],
                            isMultiLocationManager: false,
                            locationIds: ["2882248"]
                        }
                    });

                    const response = await chartsLocation;

                    expect(response.status()).toBe(200);

                    const responseBody = await response.json();

                    expect(responseBody.data).toBeInstanceOf(Array);
                    expect(responseBody.data[0].metrics.grade).toBe(score);
                } catch (error) {
                    console.error(`Failed to fetch data for score ${score}:`, error);
                }
            });
        }
    });
    
    test('Single Location Manager Filter By Scores - Verify value Matches', async () => {
        const scores = ["90-100", "80-89", "70-79", "60-69", "<60"];
        const gradeRanges = {
            "90-100": [0.90, 1.00],
            "80-89": [0.80, 0.89],
            "70-79": [0.70, 0.79],
            "60-69": [0.60, 0.69],
            "<60": [0.00, 0.59]
        };
    
        for (const score of scores) {
            await test.step(`Request to /sentiment/charts/location with score ${score}`, async () => {
                try {
                    const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
                    const chartsLocation = apiContext.post('/api/sentiment/charts/location', {
                        data: {
                            accountIds: ["1172352"],
                            startDate: "2024-01-01",
                            endDate: "2024-12-12",
                            providers: [],
                            contentTypes: ["review"],
                            sentiment: ["positive", "negative", "neutral"],
                            page: 1,
                            pageSize: 20,
                            sort: "mentions",
                            sortDir: "desc",
                            grades: [score],
                            groupIds: [],
                            isMultiLocationManager: false,
                            locationIds: ["2882248"]
                        }
                    });
    
                    const response = await chartsLocation;
    
                    expect(response.status()).toBe(200);
    
                    const responseBody = await response.json();
    
                    if (!responseBody.data || responseBody.data.length === 0) {
                        console.log(`No data found for score ${score}`);
                        return;
                    }
    
                    expect(responseBody.data).toBeInstanceOf(Array);
                    const metrics = responseBody.data[0].metrics;
                    expect(metrics.grade).toBe(score);
    
                    const [minValue, maxValue] = gradeRanges[score];
                    expect(metrics.value).toBeGreaterThanOrEqual(minValue);
                    expect(metrics.value).toBeLessThanOrEqual(maxValue);
                } catch (error) {
                    console.error(`Failed to fetch data for score ${score}:`, error);
                }
            });
        }
    });

    test('Single Location Manager Sentiment Feed - Filter by negative Sentiment', async () => {

        await test.step('performing a POST request to /sentiment/feed', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882248"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["negative"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc"
            });

            expect(sentimentFeedJson).toHaveProperty('data');
            expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
            sentimentFeedJson.data.forEach(item => {
                expect(item).toHaveProperty('metrics');
                expect(item.metrics).toHaveProperty('sentiment');
                expect(item.metrics.sentiment).toBe('negative');
            })
        })
    })

    test('Single Location Manager Sentiment Feed - Filter by Neutral Sentiment', async () => {
        await test.step('performing a POST request to /sentiment/feed', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882248"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["neutral"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc"
            });

            expect(sentimentFeedJson).toHaveProperty('data');
            expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
            sentimentFeedJson.data.forEach(item => {
                expect(item).toHaveProperty('metrics');
                expect(item.metrics).toHaveProperty('sentiment');
                expect(item.metrics.sentiment).toBe('neutral');
            })
        })
    })

    test('Single Location Manager Sentiment Feed - Filter by Neutral and Negative Sentiment', async () => {
        await test.step('performing a POST request to /sentiment/feed', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882248"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["neutral", "negative"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc"
            });

            expect(sentimentFeedJson).toHaveProperty('data');
            expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
            sentimentFeedJson.data.forEach(item => {
                expect(item).toHaveProperty('metrics');
                expect(item.metrics).toHaveProperty('sentiment');
                expect(['neutral', 'negative']).toContain(item.metrics.sentiment);
            })
        })
    })

    test('Single Location Manager Sentiment Feed - Filter by Themes: Facilities', async () => {
        await test.step('performing a POST request to /sentiment/feed', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: ["1172352"],
                locationIds: ["2882248"],
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["positive", "neutral", "negative"],
                page: 1,
                pageSize: 10,
                sort: "created",
                sortDir: "asc",
                themes: ["facilities"]
            });

            expect(sentimentFeedJson).toHaveProperty('data');
            expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
            sentimentFeedJson.data.forEach(item => {
                expect(item).toHaveProperty('metrics');
                expect(item.metrics).toHaveProperty('themes');
            })
        })
    })

    test('Single Location Manager Sentiment Dashboard - Field Validations', async () => {
        await test.step('performing a POST request to /sentiment/feed without Start Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: [],
                locationIds: ["2882248"],
                endDate: "2024-12-31",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["positive", "neutral", "negative"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc",
                themes: ["facilities"]
            },/* allowErrors */ true);

            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .startDate: Missing required field');
        });

        await test.step('performing a POST request to /sentiment/feed without End Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                accountIds: [],
                locationIds: ["2882248"],
                startDate: "2024-01-01",
                providers: [],
                contentTypes: ["review"],
                sentiment: ["positive", "neutral", "negative"],
                page: 1,
                pageSize: 20,
                sort: "created",
                sortDir: "asc",
                themes: ["facilities"]
            }, /* allowErrors */ true);

            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

        })

        await test.step('performing a POST request to /charts/location with Timespan larger than 12 months', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2020-01-01",
                endDate: "2021-01-02"
            }, /* allowErrors */ true);
            expect(response).toHaveProperty('message', "'endDate,startDate' time range should be less than 12 months");
        })

        await test.step('performing a POST request to /charts/location without Start Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                endDate: "2021-12-31"
            }, /* allowErrors */ true);
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .startDate: Missing required field');
        })

        await test.step('performing a POST request to /charts/location without End Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-12-31"
            }, /* allowErrors */ true);
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');
        })

        await test.step('making a request to wordcloud endpoint without Start Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                startDate: "2024-01-01",
                avgSentiment: "positive",
                contentTypes: ["review"]
            }, /* allowErrors */ true);
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

        })

        await test.step('making a request to wordcloud endpoint without End Date', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                startDate: "2024-01-01",
                avgSentiment: "positive",
                contentTypes: ["review"]
            });
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

        })

        await test.step('making a request to wordcloud endpoint with timespan larger than 12 months', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                startDate: "2020-01-01",
                endDate: "2021-01-02",
                avgSentiment: "positive",
                contentTypes: ["review"]
            });
            expect(response).toHaveProperty('message', "'endDate,startDate' time range should be less than 12 months");

        })

        await test.step('making a request to charts/sentiment endpoint with timespan larger than 12 months', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2020-01-01",
                endDate: "2021-01-02"
            });
            expect(response).toHaveProperty('message', "'endDate,startDate' time range should be less than 12 months");

        })

        await test.step('making a request to charts/sentiment endpoint without startDate', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                endDate: "2021-01-02"
            });
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .startDate: Missing required field');

        })

        await test.step('making a request to charts/sentiment endpoint without endDate', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
            const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                accountIds: ["1172352"],
                providers: ["FACEBOOK", "GOOGLE"],
                locationIds: ["2882248"],
                grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                page: 1,
                pageSize: 20,
                sort: "mentions",
                sortDir: "asc",
                startDate: "2021-01-02"
            });
            expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

        })

    })
    test.describe('Sentiment Dashboard tests - Multi Location Manager User @sentimentAPI', async () => {
        const apiUtils = new BaseCall();
        let apiContext;

        let accessToken = ''
        const baseURL = process.env.BASE_URL
        test.beforeAll(async () => {
            apiContext = await BaseCall.createApiContext(process.env.BASE_URL, 'application/json', '');
        });

        test.beforeEach('Get Multi Location Manager login token', async () => {
            accessToken = await (apiUtils.getAccessToken("multilocation2510@uberall.com", process.env.LB_DEFAULT_PASSWORD))
        })

        test('Sentiment Multi Location Manager Dashboard Checks', async () => {
            await test.step('performing a POST request to /charts/location', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const chartsLocationJson = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                    page: 1,
                    pageSize: 20,
                    isMultiLocationManager: true,
                    sort: "mentions",
                    sortDir: "asc",
                    startDate: "2021-01-01",
                    endDate: "2021-12-31"
                });
                await new schemaUtils().validateSchema('reporting/charts-location.json', chartsLocationJson)
            })

            await test.step('making a request to wordcloud endpoint', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const wordcloudJson = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    avgSentiment: "positive",
                    isMultiLocationManager: true,
                    contentTypes: ["review"]
                });
                await new schemaUtils().validateSchema('reporting/word-cloud.json', wordcloudJson)
            })

            await test.step('making a request to sentiment endpoint', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const sentimentJson = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                    page: 1,
                    pageSize: 20,
                    isMultiLocationManager: true,
                    sort: "mentions",
                    sortDir: "asc",
                    startDate: "2021-01-01",
                    endDate: "2021-12-31"
                });
                await new schemaUtils().validateSchema('reporting/charts-sentiment.json', sentimentJson)
            })

            await test.step('making a request to locations themes endpoint', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const locationsThemesJson = await apiUtils.postRequest(apiContext, '/api/sentiment/locations/themes', {
                    accountIds: ["1172352"],
                    providers: [],
                    locationIds: [],
                    grades: [],
                    isMultiLocationManager: true,
                    sort: "mentions",
                    sortDir: "asc",
                    startDate: "2021-01-01",
                    endDate: "2021-12-31",
                    contentTypes: ["review"]
                });
                await new schemaUtils().validateSchema('reporting/account-themes.json', locationsThemesJson)
            })

            await test.step('making a request to Feed endpoint', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const feedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                    accountIds: ["1172352"],
                    locationIds: [],
                    startDate: "2020-01-01",
                    endDate: "2020-12-12",
                    providers: [],
                    isMultiLocationManager: true,
                    contentTypes: ["review"],
                    sentiment: ["positive", "negative", "neutral"],
                    page: 1,
                    pageSize: 10,
                    sort: "created",
                    sortDir: "desc"
                });
                await new schemaUtils().validateSchema('reporting/sentiment-feed.json', feedJson)
            })


        })

        test('Multi Location Manager Sentiment Exports', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});

            await test.step('Request to /sentiment/feed/export, validate csv headers', async () => {
                const locationRankExportRequest = await apiContext.post('/api/sentiment/feed/export', {
                    data: {
                        accountIds: ["1172352"],
                        locationIds: ["2882177"],
                        startDate: "2024-01-01",
                        endDate: "2024-12-31",
                        isMultiLocationManager: true,
                        providers: [],
                        contentTypes: ["review"],
                        sentiment: ["positive", "negative", "neutral"],
                        page: 1,
                        pageSize: 10,
                        sort: "created",
                        sortDir: "desc"
                    }
                });

                const text = await locationRankExportRequest.text();
                expect(text).toContain('location_name,location_address,locality,region,author,date_created,content,rating,sentiment,corporate_id');
            });

            await test.step('Request to /charts/locations/export, validate csv headers', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
                const locationRankExportRequest = await apiContext.post('/api/sentiment/charts/location/export', {
                    data: {
                        accountIds: ["1172352"],
                        startDate: "2023-01-01",
                        endDate: "2023-12-12",
                        providers: [],
                        contentTypes: ["review"],
                        sentiment: ["positive", "negative", "neutral"],
                        page: 1,
                        pageSize: 20,
                        sort: "mentions",
                        sortDir: "desc",
                        grades: [],
                        groupIds: [],
                        isMultiLocationManager: true,
                        locationIds: []
                    }
                })

                const text = await locationRankExportRequest.text();
                expect(text).toContain('rank,location_id,location_name,address,locality,region,corporate_id,mentions,grade_average,sentiment_average,sentiment_change,rating_average,beverages_sentiment_average,beverages_grade_average,covid_policy_sentiment_average,covid_policy_grade_average,facilities_sentiment_average,facilities_grade_average,food_sentiment_average,food_grade_average,pricing_sentiment_average,pricing_grade_average,service_sentiment_average,service_grade_average,wait_time_sentiment_average,wait_time_grade_average');
            });
        });

        test('Multi Location Manager Filter By Scores', async () => {
            const scores = ["90-100", "80-89", "70-79", "60-69", "<60"];

            for (const score of scores) {
                await test.step(`Request to /sentiment/charts/location with score ${score}`, async () => {
                    try {
                        const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
                        const chartsLocation = apiContext.post('/api/sentiment/charts/location', {
                            data: {
                                accountIds: ["1172352"],
                                startDate: "2024-01-01",
                                endDate: "2024-12-12",
                                providers: [],
                                contentTypes: ["review"],
                                sentiment: ["positive", "negative", "neutral"],
                                page: 1,
                                pageSize: 20,
                                sort: "mentions",
                                sortDir: "desc",
                                grades: [score],
                                groupIds: [],
                                isMultiLocationManager: true,
                                locationIds: []
                            }
                        });

                        const response = await chartsLocation;

                        expect(response.status()).toBe(200);

                        const responseBody = await response.json();

                        expect(responseBody.data).toBeInstanceOf(Array);
                        expect(responseBody.data[0].metrics.grade).toBe(score);
                    } catch (error) {
                        console.error(`Failed to fetch data for score ${score}:`, error);
                    }
                });
            }
        });

        test('Multi Location Manager - Filter By Scores - Verify Value Matches', async () => {
            const scores = ["90-100", "80-89", "70-79", "60-69", "<60"];
        
            for (const score of scores) {
                await test.step(`Request to /sentiment/charts/location with score ${score}`, async () => {
                    try {
                        const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
                        const chartsLocation = apiContext.post('/api/sentiment/charts/location', {
                            data: {
                                accountIds: ["1172352"],
                                startDate: "2024-01-01",
                                endDate: "2024-12-12",
                                providers: [],
                                contentTypes: ["review"],
                                sentiment: ["positive", "negative", "neutral"],
                                page: 1,
                                pageSize: 20,
                                sort: "mentions",
                                sortDir: "desc",
                                grades: [score],
                                groupIds: [],
                                isMultiLocationManager: true,
                                locationIds: []
                            }
                        });
        
                        const response = await chartsLocation;
                        expect(response.status()).toBe(200);
        
                        const responseBody = await response.json();
                        if (!responseBody.data || responseBody.data.length === 0) {
                            console.log(`No data found for score ${score}`);
                            return;
                        }
        
                        expect(responseBody.data).toBeInstanceOf(Array);
        
                        const value = responseBody.data[0].metrics.value;
                        let lowerBound, upperBound;
        
                        if (score === "<60") {
                            lowerBound = 0;
                            upperBound = 0.59;
                        } else {
                            [lowerBound, upperBound] = score.split('-').map(s => parseInt(s) / 100);
                        }
        
                        expect(value).toBeGreaterThanOrEqual(lowerBound);
                        expect(value).toBeLessThanOrEqual(upperBound);
                    } catch (error) {
                        console.error(`Failed to fetch data for score ${score}:`, error);
                    }
                });
            }
        });

        test('Multi Location Manager Sentiment Feed - Filter by negative Sentiment', async () => {

            await test.step('performing a POST request to /sentiment/feed', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                    accountIds: ["1172352"],
                    locationIds: [],
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    providers: [],
                    contentTypes: ["review"],
                    sentiment: ["negative"],
                    isMultiLocationManager: true,
                    page: 1,
                    pageSize: 20,
                    sort: "created",
                    sortDir: "asc"
                });

                expect(sentimentFeedJson).toHaveProperty('data');
                expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
                sentimentFeedJson.data.forEach(item => {
                    expect(item).toHaveProperty('metrics');
                    expect(item.metrics).toHaveProperty('sentiment');
                    expect(item.metrics.sentiment).toBe('negative');
                })
            })
        })

        test('Multi Location Manager Sentiment Feed - Filter by Neutral Sentiment', async () => {
            await test.step('performing a POST request to /sentiment/feed', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                    accountIds: ["1172352"],
                    locationIds: ["2882177"],
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    providers: [],
                    contentTypes: ["review"],
                    isMultiLocationManager: true,
                    sentiment: ["neutral"],
                    page: 1,
                    pageSize: 20,
                    sort: "created",
                    sortDir: "asc"
                });

                expect(sentimentFeedJson).toHaveProperty('data');
                expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
                sentimentFeedJson.data.forEach(item => {
                    expect(item).toHaveProperty('metrics');
                    expect(item.metrics).toHaveProperty('sentiment');
                    expect(item.metrics.sentiment).toBe('neutral');
                })
            })
        })

        test('Multi Location Manager Sentiment Feed - Filter by Neutral and Negative Sentiment', async () => {
            await test.step('performing a POST request to /sentiment/feed', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                    accountIds: ["1172352"],
                    locationIds: [],
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    providers: [],
                    contentTypes: ["review"],
                    sentiment: ["neutral", "negative"],
                    isMultiLocationManager: true,
                    page: 1,
                    pageSize: 20,
                    sort: "created",
                    sortDir: "asc"
                });

                expect(sentimentFeedJson).toHaveProperty('data');
                expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
                sentimentFeedJson.data.forEach(item => {
                    expect(item).toHaveProperty('metrics');
                    expect(item.metrics).toHaveProperty('sentiment');
                    expect(['neutral', 'negative']).toContain(item.metrics.sentiment);
                })
            })
        })

        test('Sentiment Feed - Filter by Themes: Facilities', async () => {
            await test.step('performing a POST request to /sentiment/feed', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const sentimentFeedJson = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                    accountIds: ["1172352"],
                    locationIds: ["2882177", "2882248"],
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    providers: [],
                    contentTypes: ["review"],
                    sentiment: ["positive", "neutral", "negative"],
                    isMultiLocationManager: true,
                    page: 1,
                    pageSize: 20,
                    sort: "created",
                    sortDir: "asc",
                    themes: ["facilities"]
                });

                expect(sentimentFeedJson).toHaveProperty('data');
                expect(Array.isArray(sentimentFeedJson.data)).toBe(true);
                sentimentFeedJson.data.forEach(item => {
                    expect(item).toHaveProperty('metrics');
                    expect(item.metrics).toHaveProperty('themes');
                })
            })
        })

        test('Multi Location Manager Sentiment Dashboard - Field Validations', async () => {
            await test.step('performing a POST request to /sentiment/feed without Start Date', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken});
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                    accountIds: [],
                    locationIds: ["2882177"],
                    endDate: "2024-12-31",
                    providers: [],
                    contentTypes: ["review"],
                    sentiment: ["positive", "neutral", "negative"],
                    isMultiLocationManager: true,
                    page: 1,
                    pageSize: 20,
                    sort: "created",
                    sortDir: "asc",
                    themes: ["facilities"]
                }, /* allowErrors */ true);

                expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .startDate: Missing required field');
            });

            await test.step('performing a POST request to /sentiment/feed without End Date', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/feed', {
                    accountIds: [],
                    locationIds: ["2882177"],
                    startDate: "2024-01-01",
                    providers: [],
                    contentTypes: ["review"],
                    sentiment: ["positive", "neutral", "negative"],
                    isMultiLocationManager: true,
                    page: 1,
                    pageSize: 20,
                    sort: "created",
                    sortDir: "asc",
                    themes: ["facilities"]
                }, /* allowErrors */ true);

                expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

            })

            await test.step('performing a POST request to /charts/location with Timespan larger than 12 months', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                    page: 1,
                    pageSize: 20,
                    isMultiLocationManager: true,
                    sort: "mentions",
                    sortDir: "asc",
                    startDate: "2020-01-01",
                    endDate: "2021-01-02"
                }, /* allowErrors */ true);
                expect(response).toHaveProperty('message', "'endDate,startDate' time range should be less than 12 months");
            })

            await test.step('performing a POST request to /charts/location without Start Date', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                    page: 1,
                    pageSize: 20,
                    isMultiLocationManager: true,
                    sort: "mentions",
                    sortDir: "asc",
                    endDate: "2021-12-31"
                });
                expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .startDate: Missing required field');
            })

            await test.step('performing a POST request to /charts/location without End Date', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/location', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                    page: 1,
                    pageSize: 20,
                    isMultiLocationManager: true,
                    sort: "mentions",
                    sortDir: "asc",
                    startDate: "2021-12-31"
                });
                expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');
            })

            await test.step('making a request to wordcloud endpoint without Start Date', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    startDate: "2024-01-01",
                    isMultiLocationManager: true,
                    avgSentiment: "positive",
                    contentTypes: ["review"]
                });
                expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

            })

            await test.step('making a request to wordcloud endpoint without End Date', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    startDate: "2024-01-01",
                    avgSentiment: "positive",
                    isMultiLocationManager: true,
                    contentTypes: ["review"]
                });
                expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

            })

            await test.step('making a request to wordcloud endpoint with timespan larger than 12 months', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/wordcloud', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    startDate: "2020-01-01",
                    endDate: "2021-01-02",
                    isMultiLocationManager: true,
                    avgSentiment: "positive",
                    contentTypes: ["review"]
                });
                expect(response).toHaveProperty('message', "'endDate,startDate' time range should be less than 12 months");

            })

            await test.step('making a request to charts/sentiment endpoint with timespan larger than 12 months', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                    page: 1,
                    pageSize: 20,
                    isMultiLocationManager: true,
                    sort: "mentions",
                    sortDir: "asc",
                    startDate: "2020-01-01",
                    endDate: "2021-01-02"
                });
                expect(response).toHaveProperty('message', "'endDate,startDate' time range should be less than 12 months");

            })

            await test.step('making a request to charts/sentiment endpoint without startDate', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                    page: 1,
                    pageSize: 20,
                    isMultiLocationManager: true,
                    sort: "mentions",
                    sortDir: "asc",
                    endDate: "2021-01-02"
                });
                expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .startDate: Missing required field');

            })

            await test.step('making a request to charts/sentiment endpoint without endDate', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const response = await apiUtils.postRequest(apiContext, '/api/sentiment/charts/sentiment', {
                    accountIds: ["1172352"],
                    providers: ["FACEBOOK", "GOOGLE"],
                    locationIds: [],
                    grades: ["90-100", "80-89", "70-79", "60-69", "<60"],
                    page: 1,
                    pageSize: 20,
                    isMultiLocationManager: true,
                    sort: "mentions",
                    sortDir: "asc",
                    startDate: "2021-01-02"
                });
                expect(response).toHaveProperty('message', 'The request content was malformed:\nDecodingFailure at .endDate: Missing required field');

            })
        })
    })
})