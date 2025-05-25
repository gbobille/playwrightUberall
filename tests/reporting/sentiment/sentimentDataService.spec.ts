import { expect } from '@playwright/test';
import { test } from '../../setup';
import BaseCall from '../../../api/uberall/baseCall';

test.describe('sentiment-data-service tests @sentimentMicros', async () => {
    const apiUtils = new BaseCall();

    let baseURL = ''
    const env = process.env.UBERALL_ENVIRONMENT
    if (env == 'dev' || env == 'develop' || env == 'development') {
        baseURL = 'http://sentiment-data-service.k8s.eu-central-1.development.uberall.com'
    }
    else if (env == 'sandbox') {
        baseURL = 'https://sentiment-data-service.k8s.eu-central-1.sandbox.uberall.com'
    }
    else if (env == 'prod' || env == 'production' || env == 'app') {
        baseURL = 'https://sentiment-data-service.k8s.eu-central-1.production.uberall.com'
    }


    test('Verify Version in Prod Matches Version in DEV Environment', async () => {
        const devBaseURL = 'http://sentiment-data-service.k8s.eu-central-1.development.uberall.com/';
        const prodBaseURL = 'https://sentiment-data-service.k8s.eu-central-1.production.uberall.com';

        const apiContextDev = await apiUtils.createApiContextURLOnly(devBaseURL);
        const apiContextProd = await apiUtils.createApiContextURLOnly(prodBaseURL);

        const devVersionResponse = await apiUtils.getRequest(apiContextDev, '', {});
        const prodVersionResponse = await apiUtils.getRequest(apiContextProd, '', {});

        const devVersion = devVersionResponse.version;
        const prodVersion = prodVersionResponse.version;

        expect(devVersion).toEqual(prodVersion);
    })



})
