# Playwright Page Object Tenet

## Table of Contents
- [Rules](#rules)
- [Page Object Directory Structure](#page-object-directory-structure)
- [Page Object Model Pattern](#page-object-model-pattern)
  - [Page Object Structure](#page-object-structure)
- [Component Pattern](#component-pattern)
  - [Component Structure](#component-structure)
- [Locator Strategies](#locator-strategies)
  - [Priority Order for Locators](#priority-order-for-locators)

## Rules
- Always use page object model pattern
- Include accessibility testing where appropriate
- Refrain from using waitForLoadState('networkidle'), rely on web assertions to assess readiness instead
- Do not create page-specific interaction methods that only contain one line of implementation code. At minimum, a page-specific interaction method should have at least two lines of implementation code
- Always validate that locators exist in the browser's context. NEVER create locators that do not exist
- Never expect() assertions in the page object models, expect() assertions should only be used in test specification files

## Page Object Directory Structure

```
uberallplaywrighttest/
├── pages/               # Page Object Models
│   └── feature/         # Feature-specific page objects
│       ├── components/  # Reusable UI components
│       ├── modals/      # Reusable UI modals      
│       └── feature-main-page.ts
```

## Page Object Model Pattern

Page Object Models (POMs) encapsulate the structure and behavior of specific pages within the application. This pattern is used to create an abstraction layer that separates test logic from page interaction details. Please reference: https://playwright.dev/docs/pom

### Page Object Structure

```typescript
export class FeatureMainPage {
    // URL constant for navigation
    static readonly url: string = '/en/app/uberall/feature-path'
    
    // Page instance reference
    readonly page: Page
    
    // Locators for page elements
    readonly actionButton: Locator
    
    // Component references
    readonly filterComponent: FilterComponent
    
    constructor(page: Page) {
        this.page = page
        this.actionButton = page.getByTestId('action-btn')
        this.filterComponent = new FilterComponent(page)
    }
    
    // Navigation method
    async goto() {
        await this.page.goto(FeatureMainPage.url, { waitUntil: 'domcontentloaded' })
    }
    
    // Page-specific methods
    // ...
}
```

## Component Pattern

Break down complex page objects into reusable components that represent distinct parts of the UI.

### Component Structure

```typescript
export class FilterComponent {
    readonly page: Page
    readonly filterButton: Locator
    
    constructor(page: Page) {
        this.page = page
        this.filtersButton = page.getByTestId('filter-btn')
    }
    
    // Component-specific methods
    async selectFilterOption(option: string) {
        // Implementation
    }
}
```

## Locator Strategies

Use meaningful, reliable locator strategies that won't break with minor UI changes.

### Priority order for locators:

1. `getByTestId` - Most reliable for testing (requires data-testid attributes in the DOM)
   ```typescript
   page.getByTestId('feature-btn')
   ```

2. `getByRole` - Good for accessibility and semantic elements
   ```typescript
   page.getByRole('button', { name: 'Confirm' })
   ```

3. Element + text combination - When test IDs aren't available
   ```typescript
   page.locator('mf-message').getByText('No results were found.')
   ```

4. CSS selectors - Use sparingly and only for stable elements
   ```typescript
   page.locator('.feature_btn')
   ```
