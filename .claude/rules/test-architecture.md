# Test Architecture Rules

Architectural rules for maintaining the Page Object Model structure across this codebase.

---

## Page Object Model (POM)

### Structure

Every publicly accessible page or major section has exactly one class in `src/pages/`:

```
BasePage (abstract base)
  └── extends → HomePage, NavigationPage, ContactFormPage, PricingPage, DamPage, AiListingPage
```

### Page Object Rules

1. **Class naming**: `<PageName>Page` — e.g., `PricingPage`, `DamPage`
2. **File naming**: `<page-name>.page.ts` — e.g., `pricing.page.ts`
3. **Must extend `BasePage`** from `@pages/base.page`
4. **Locators**: declared as `readonly Locator` properties in the constructor
5. **Methods**: verbs describing user actions — `clickPlan()`, `getNavLinks()`, `openMobileMenu()`
6. **No assertions**: never call `expect()` inside a page object
7. **No navigation inside methods** unless the method's express purpose is navigation
8. **Exported interfaces**: export any data-shape interfaces from the same file

### Fixture Registration

Every new page object must be registered in `src/fixtures/site.fixture.ts`:
- Add the fixture type to the `Fixtures` interface
- Add the fixture factory to the `test.extend<Fixtures>({})` call
- Re-export `expect` from the same file

---

## Test Files

### One spec file per feature area

- `tests/functional/pricing.spec.ts` — all pricing-related tests
- `tests/functional/dam-features.spec.ts` — all DAM page tests
- Do not mix unrelated features in one spec file

### Import Rule

```typescript
// Always import from fixture — never from @playwright/test directly
import { test, expect } from '@fixtures/site.fixture';  // ✅
import { test, expect } from '@playwright/test';         // ❌
```

### Tagging

Tag every `test()` call with the suite it belongs to:
- `@smoke` — availability checks
- `@navigation` — link and menu tests
- `@forms` — form validation tests
- `@functional` — feature and business logic tests
- `@visual` — screenshot regression
- `@responsive` — viewport and layout tests

A test may have multiple tags: `test('pricing card visible @functional @responsive', ...)`

### Test Isolation

- Each test is independent — never rely on state from a previous test
- Use fixture setup (`beforeEach`-equivalent in fixtures) for shared navigation
- Do not share variables across tests in a `describe` block unless using `test.use()`

---

## Configuration

- `site.config.json` is the single source of truth for the site URL and feature flags
- Read it via `loadSiteConfig()` from `@types/site-config.types` — never `require()` it directly
- All tests receive `siteConfig` from the fixture — never instantiate `loadSiteConfig()` in test files
- Never hardcode `https://digitile.io` — use `siteConfig.url`

---

## Safety Rules

| Rule | Enforcement |
|------|-------------|
| Never submit a form | Test validation, not submission |
| Never enter real credentials | Auth tests use fake data only |
| Never call external APIs | Use `page.route()` to mock if needed |
| Never depend on test execution order | Tests run in parallel |
