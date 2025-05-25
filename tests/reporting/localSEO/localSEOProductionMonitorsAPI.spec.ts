import { expect } from '@playwright/test';
import { test } from '../../setup';
import BaseCall from '../../../api/uberall/baseCall';

test.describe('Local SEO Production Monitors SP 3038 @localseoProductionMonitors', async () => {
    const apiUtils = new BaseCall();

    test('Search Ranks Prior Period', async () => {
        const yogurtlandAccessToken = await (apiUtils.getAccessToken("reportingQA3038@uberall.com", process.env.LB_DEFAULT_PASSWORD))
        const baseURL = process.env.BASE_URL

        await test.step('Get local SEO search ranks for Mar 2018, verify prior period data is 0', async () => {
            const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': yogurtlandAccessToken})
            const searchRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/search_ranks?v=20191203', {
                accountIds: ['1104147'],
                cities: [],
                countries: [],
                zipCodes: [],
                locationIds: [],
                groupIds: [],
                keywords: [],
                labels: [],
                startDate: '2018-03',
                endDate: '2018-03'
            });
            const rankChart = searchRanksJson.response.rankChart.prior
            const topMoversChart = searchRanksJson.response.topMoversChart
            const bottomMoversChart = searchRanksJson.response.bottomMoversChart
            expect(rankChart).toEqual(0)
            topMoversChart.forEach(keyword => {
                expect(keyword.prior).toEqual(0)
            })
            bottomMoversChart.forEach(keyword => {
                expect(keyword.prior).toEqual(0)
            })
        })
    })
});


test.describe('Local SEO monitors parameterized tests @localseoProductionMonitors', async () => {
    const apiUtils = new BaseCall();

    [
        { email:'reportingqa2834@uberall.com', accountId:'1107551' },
        { email:'reportingqa3038@uberall.com', accountId:'1104147' },
        { email:'reportingqa3030@uberall.com', accountId:'1107630' }
    ].forEach(({email, accountId}) => {
        
        test(`Check location ranks CSV export row count for account ${accountId}`, async () => {
            const accessToken = await (apiUtils.getAccessToken(email, process.env.LB_DEFAULT_PASSWORD))
            const baseURL = process.env.BASE_URL

            let apiLocationCount = null
            await test.step('Get API endpoint location count', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const locationRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/location_ranks?v=20191203', {
                    accountIds: [`${accountId}`],
                    cities: [],
                    countries: [],
                    zipCodes: [],
                    locationIds: [],
                    groupIds: [],
                    keywords: [],
                    labels: [],
                    startDate: '2023-06',
                    endDate: '2023-11'
                })
                apiLocationCount = locationRanksJson.response.count
            })
    
            let csvLocationCount = null
            await test.step('Get CSV export location count', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const csvExportRequest = apiContext.post('/api/local-seo/charts/location_ranks/export?v=20191203', {
                    data: {
                        accountIds: [`${accountId}`],
                        cities: [],
                        countries: [],
                        zipCodes: [],
                        locationIds: [],
                        groupIds: [],
                        keywords: [],
                        labels: [],
                        startDate: '2023-06',
                        endDate: '2023-11'
                    }
                });
                const csvText = await (await csvExportRequest).text()
                csvLocationCount = (csvText.trim().split("\n").length) - 1
            })
            await test.step('Compare counts', async () => {
                expect(apiLocationCount).not.toEqual(null)
                expect(csvLocationCount).not.toEqual(null)
                expect(csvLocationCount).toEqual(apiLocationCount)
            })
        })
    
        test(`Check competitor ranks endpoint returns complete data for ${accountId}`, async () => {
            const accessToken = await (apiUtils.getAccessToken(email, process.env.LB_DEFAULT_PASSWORD))
            const baseURL = process.env.BASE_URL

            await test.step('Get competitor ranks for 2013', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const compRanksJson = await apiUtils.postRequest(apiContext, '/api/local-seo/charts/competitor_ranks?v=20191203', {
                    accountIds: [`${accountId}`],
                    cities: [],
                    countries: [],
                    zipCodes: [],
                    locationIds: [],
                    groupIds: [],
                    keywords: [],
                    labels: [],
                    startDate: '2023-01',
                    endDate: '2023-12'
                });
                expect(compRanksJson.response.data[0].points.length).toEqual(12)
            })
        })
    
        test(`Check local SEO keyword endpoint doesn't return duplicates for ${accountId}`, async () => {
            const accessToken = await (apiUtils.getAccessToken(email, process.env.LB_DEFAULT_PASSWORD))
            const baseURL = process.env.BASE_URL
    
            await test.step('Get local SEO keywords', async () => {
                const apiContext = await apiUtils.createApiContextWithHeaders(baseURL, {'accessToken': accessToken})
                const keywordsJson = await apiUtils.postRequest(apiContext, '/api/local-seo/keywords?v=20191203', {
                    accountIds: [`${accountId}`],
                    locationIds: [],
                    fieldMask: "name",
                    queryFields: ["name", "identifier"],
                    offset: 0,
                    max:50,
                    query: ""
                });
                const keywordsList = keywordsJson.response.keywords
                const keywordsSet = new Set(keywordsList)
                expect(keywordsList.length).toEqual(keywordsSet.size)
            })
        })
    });
})
