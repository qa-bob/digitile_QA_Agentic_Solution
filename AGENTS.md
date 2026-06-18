# AGENTS.md — AI Agent Instructions

> This file provides instructions for AI coding agents (GitHub Copilot, Cursor, Devin, Codex, etc.).
> Claude Code reads `CLAUDE.md` instead. That file imports this one for shared rules.
> See [CLAUDE.md](./CLAUDE.md) for Claude Code-specific instructions.

---

## Repository Purpose

This is a **Playwright + TypeScript regression test suite** for [digitile.io](https://digitile.io), a B2B SaaS digital asset management and eCommerce product discovery platform.

The suite tests all publicly accessible features of the website **without creating accounts, logging in, or submitting forms**.

---

## Architecture

### Design Patterns
- **Page Object Model (POM)**: every page/section has a class in `src/pages/`
- **OOP Inheritance**: all page classes extend `BasePage` from `src/pages/base.page.ts`
- **Custom Fixtures**: tests access page objects through `src/fixtures/site.fixture.ts`, never through direct instantiation in test bodies

### Directory Layout

```
src/pages/          One class per page or major section
src/fixtures/       Playwright fixture extending base test
src/utils/          Shared helpers (link checker, visual helper)
src/types/          TypeScript interfaces and config loader
tests/smoke/        @smoke tag — availability and load checks
tests/navigation/   @navigation tag — nav links, menus
tests/forms/        @forms tag — field validation (no submission)
tests/functional/   @functional tag — business features per page
tests/visual/       @visual tag — screenshot regression
tests/responsive/   @responsive tag — layout at each viewport
```

---

## Coding Rules

### Page Objects

```typescript
// CORRECT — typed locators, methods as actions, no assertions
export class PricingPage extends BasePage {
  readonly planCards: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.planCards = page.locator('.pricing-card, [class*="plan"]');
  }

  async getPlanNames(): Promise<string[]> {
    const all = await this.planCards.all();
    return Promise.all(all.map(c => c.textContent().then(t => t?.trim() ?? '')));
  }
}

// WRONG — assertions inside page objects
async verifyPlansExist() {
  expect(await this.planCards.count()).toBeGreaterThan(0); // ❌
}
```

### Tests

```typescript
// CORRECT — uses fixture, tagged, no hardcoded URLs
import { test, expect } from '@fixtures/site.fixture';

test('pricing page has plan cards @functional', async ({ page, siteConfig }) => {
  await page.goto(`${siteConfig.url}/pricing/`);
  const cards = page.locator('.pricing-card');
  await expect(cards).toHaveCount({ min: 1 });
});

// WRONG — raw page.locator in test body, hardcoded URL
test('pricing', async ({ page }) => {
  await page.goto('https://digitile.io/pricing/'); // ❌
  expect(await page.locator('.pricing-card').count()).toBeGreaterThan(0); // ❌ raw locator
});
```

### TypeScript

- Strict mode is on — no implicit `any`
- All page object properties must be typed (`readonly Locator`)
- Run `npx tsc --noEmit` before finishing any change
- Path aliases are configured: `@pages/*`, `@utils/*`, `@types/*`, `@fixtures/*`

---

## Non-Negotiable Constraints

| Rule | Reason |
|------|--------|
| Never submit any form | Prevents spam to the real site |
| Never create accounts or enter real credentials | No live account creation |
| Never hardcode URLs in tests | `siteConfig.url` or Playwright `baseURL` only |
| Never put `expect()` in page object methods | POM separation of concerns |
| Never use `page.waitForTimeout()` | Use Playwright auto-waiting or `waitForSelector` |
| Never use `any` type without comment | TypeScript strict mode enforcement |

---

## Configuration

All test behaviour is driven by `site.config.json`. Read it with `loadSiteConfig()` from `src/types/site-config.types.ts`. Do not read the file directly — use the loader so defaults are applied.

Key flags:
- `hasContactForm` — enables/disables form test suite
- `skipVisual` — skips screenshot regression
- `skipForms` — skips form tests
- `auth.required` — enables authenticated test flows (currently `false`)

---

## Available npm Scripts

```bash
npm test                  # All tests
npm run test:smoke        # @smoke only
npm run test:navigation   # @navigation only
npm run test:forms        # @forms only
npm run test:visual       # @visual only
npm run test:responsive   # @responsive only
npm run baseline          # Update visual snapshots
npm run typecheck         # TypeScript check
npm run lint              # ESLint
```

---

## Adding New Tests

1. Check `site.config.json` for the target URL and flags
2. Fetch the live page HTML before writing selectors
3. Create or update the page object in `src/pages/`
4. Write tests that use the page object via the fixture
5. Tag every `test()` with at least one category tag
6. Run `npx tsc --noEmit` to confirm TypeScript compiles

## Adding New Page Objects

1. Create `src/pages/<name>.page.ts`
2. `export class XxxPage extends BasePage`
3. Declare all locators as `readonly Locator` in the constructor
4. Methods are verbs representing user actions: `clickPlan()`, `getPlanNames()`
5. Register the page object in `src/fixtures/site.fixture.ts`
