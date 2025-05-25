//Is this necessary? I was able to code some api tests without this class

import { PlaywrightTestConfig } from '@playwright/test';

// Default configuration (e.g., development)
const defaultConfig = {
    baseURL: 'https://dev.example.com',
    cookie: 'devCookieValue',
};

// Sandbox environment configuration
const sandboxConfig = {
    baseURL: 'https://sandbox.example.com',
    cookie: 'sandboxCookieValue',
};

// Production environment configuration
const prodConfig = {
    baseURL: 'https://prod.example.com',
    cookie: 'prodCookieValue',
};

// Determine the current environment
const currentEnv = process.env.TEST_ENV || 'dev';

// Select the appropriate configuration based on the environment
const envConfig = {
    dev: defaultConfig,
    sandbox: sandboxConfig,
    prod: prodConfig,
}[currentEnv] || defaultConfig;

const config: PlaywrightTestConfig = {
    use: {
        baseURL: envConfig.baseURL,
        extraHTTPHeaders: {
            cookie: envConfig.cookie,
        },
    },
};

export default config;
