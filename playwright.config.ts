import { devices, type PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

const envPath =
  (process.env.ENVIRONMENT === "production" || process.env.ENVIRONMENT === "prod" || process.env.ENVIRONMENT === "app")
    ? ".env.production"
    : process.env.ENVIRONMENT === "sandbox"
      ? ".env.sandbox"
      : (process.env.ENVIRONMENT === "development" || process.env.ENVIRONMENT === "develop" || process.env.ENVIRONMENT === "dev")
        ? ".env.dev"
        : "env-variables.env"; // Default to .env.local

dotenv.config({ path: envPath });

// // Alternatively, read from "../my.env" file.
// dotenv.config({ path: './.env.dev' });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  snapshotPathTemplate: "./screenshots/{testFilePath}/{arg}{ext}",
  //outputDir: './screenshots',
  /* Maximum time one test can run for. */
  timeout: 10 * 10000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 20000,
    toHaveScreenshot: {
      threshold: 0.3,
      maxDiffPixels: 1700,
      maxDiffPixelRatio: 0.3,
    },
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html"],
    ["junit", { outputFile: "playwright-report/results.xml" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  //globalSetup: require.resolve('./utils/auth/global-setup.ts'),
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 20000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL, // Set your base URL here
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "on",
    launchOptions: {
      slowMo: 500,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {

        browserName: "chromium",
        permissions: ["geolocation"],
        bypassCSP: true,
        viewport: {
          width: 1280,
          height: 720,
        },
        launchOptions: {
          args: ["--disable-web-security"],
        },
      },
    },
    {
      name: "local",
      use: {
        ...devices ["Desktop Chrome"],
        channel: 'chrome',
        permissions: ["geolocation"],
        bypassCSP: true,
        viewport: {
          width: 1280,
          height: 720,
        },
        launchOptions: {
          args: ["--disable-web-security"],
        },
      },
    },
    {
      name: "Firefox",
      use: {
        browserName: "firefox",
        viewport: {
          width: 1280,
          height: 720,
        },
      },
    },

    {
      name: "WebKit",
      use: {
        browserName: "webkit",
        viewport: {
          width: 1280,
          height: 720,
        },
      },
    },
    {
      name: "MobileChromeiPhone",
      use: {
        browserName: "chromium",
        permissions: ["geolocation"],
        geolocation: { latitude: 52.52, longitude: 13.405 },
        viewport: {
          width: 390,
          height: 844,
        },
      },
    },
    {
      name: 'Google_Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    },
    {
      name: 'reputation-setup',
      use: {
        headless: true,
      },
      testMatch: /.*feed\/.*\.setup\.ts/,
    },
    {
      name: 'reputation-test',
      use: {
        browserName: "chromium",
        permissions: ["geolocation"],
        bypassCSP: true,
        viewport: {
          width: 1280,
          height: 720,
        },
        launchOptions: {
          args: ["--disable-web-security"],
        },
      },
      dependencies: ['reputation-setup']
    },
  ],
};

export default config;
