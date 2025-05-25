# Playwright Test Specification

This document outlines the design patterns and best practices for creating Playwright test scripts in TypeScript. Use this as a reference when creating new test specifications for any feature in the project.

## Table of Contents
- [Rules](#rules)
- [Fixture Requirements](#fixture-requirements)
- [Test Specification Directory Structure](#test-specification-directory-structure)
- [Test Organization](#test-organization)
  - [Test File Structure](#test-file-structure)
- [Using Playwright Fixtures](#using-playwright-fixtures)
  - [Understanding Fixtures](#understanding-fixtures)

## Rules

When creating a new test specification file in the tests directory:

- ⚠️ REQUIRED: Create a base test file with fixtures BEFORE writing any tests, if one does not exist
- ⚠️ REQUIRED: Use fixtures in test() and test.step() blocks to interact with page objects - NEVER instantiate page objects directly in tests
- ⚠️ REQUIRED: Use loginSkipLandingValidation(username,password) from [Login](../pages/components/login.ts) page object whenever performing a log in step. This should also be a fixture
- Test specification files should NEVER use page.goto(). All navigation must use the goto() method from the page object model classes.
- Tests should be written in GHERKIN BDD format
- The title string for test.step() should always be in GHERKIN BDD format
- Add appropriate tagging for test filtering (e.g., `{ tag: '@tagName' }`).
- Save the generated test file in the `tests` directory.

## Test Specification Directory Structure

```
uberallplaywrighttest/
├── tests/               
│   └── feature/         
│       ├── feature-base.ts        # Fixtures definition file
│       └── feature-test.spec.ts   # Test implementation
```

## Test File Structure

```typescript
import { expect, test } from './feature-base'  // Always import from base file with fixtures

// Group tests logically with test.describe()
test.describe('Feature Main Page loads for Admin user', { tag: '@featureName'}, () => {
    
    // Individual test cases with test() - Use fixtures as parameters
    test('Feature page loads upon navigation', async ({ loginPage, featureMainPage }) => {
        await test.step(`Given logged in as an Admin user`, async () => {
            await loginPage.loginSkipLandingValidation("username", "password")
        })

        await test.step(`When navigating to the feature page`, async () => {
            await featureMainPage.goto()
        })

        await test.step(`And submitting text`, async () => {
            await features.MainPage.inbutBox.fill('text')
            await features.MainPage.confirmButton.click()
        })

        await test.step(`Then page loads successfully with key elements`, async () => {
            await expect(featureMainPage.mainHeader).toBeVisible()
            await expect(featureMainPage.componentA.elementB).toBeVisible()
        })

        await test.step(`When interacting with a key feature`, async () => {
            await featureMainPage.componentA.actionC()
        })

        await test.step(`Then expected results are displayed`, async () => {
            await expect(featureMainPage.resultPanel).toContainText('Success')
        })
    })
})
```

## Fixture Requirements

For every new feature test:

1. Create a base test file (feature-base.ts) FIRST that defines your fixtures:
```typescript
// feature-base.ts
import { test as base } from '@playwright/test'
import { FeatureMainPage } from '../../../pages/feature/feature-page'

export const test = base.extend<{
  featureMainPage: FeatureMainPage
  loginPage: Login
}>({
    loginPage: async ({ page }, use) => {
        await use(new Login(page))
    },
    featureMainPage: async ({ page }, use) => {
        await use(new FeatureMainPage(page))
    },

})

export { expect } from '@playwright/test'
```

2. Import and use fixtures in your test files:
```typescript 
// CORRECT:
import { test, expect } from './feature-base'

test('Feature test', async ({ loginPage, featureMainPage }) => {
    test.step('Given logging in as a user', async () => {
        await loginPage.loginSkipLandingValidation("username","password")
    })

    test.step('When doing something', async () => {
        await featureMainPage.doSomething()
    })
    //additional test.step()
})

// INCORRECT - DO NOT DO THIS:
import { test } from '@playwright/test'
import { FeatureMainPage } from '../pages/feature-page'

test('Feature test', async ({ loginPage, featureMainPage }) => {
    test.step('Feature test', async ({ page }) => {
        const loginPage = new Login(page) // ❌ Wrong! Use fixtures 
        loginPage.loginSkipLandingValidation("username","password")
        const featureMainPage = new FeatureMainPage(page) // ❌ Wrong! Use fixtures instead
    })
})
```