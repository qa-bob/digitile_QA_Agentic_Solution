# GitHub Copilot / Codespaces Agent Instructions

> This file is read by GitHub Copilot, GitHub Codespaces, and other GitHub-integrated AI tools.
> For Claude Code, see [CLAUDE.md](../CLAUDE.md). For other AI agents, see [AGENTS.md](../AGENTS.md).

---

## Project Context

This repository is a **Playwright + TypeScript end-to-end test suite** for [digitile.io](https://digitile.io) — a B2B SaaS digital asset management and eCommerce product discovery platform.

**Tech stack:** Playwright 1.44, TypeScript 5.4, Node 18+, ESLint

**Design patterns:** Page Object Model (POM), OOP inheritance, custom Playwright fixtures

---

## Architecture Summary

### File Roles

| Path | Role |
|------|------|
| `site.config.json` | Single source of truth — site URL, feature flags |
| `src/pages/base.page.ts` | BasePage — all page objects extend this |
| `src/pages/*.page.ts` | One class per page or major section |
| `src/fixtures/site.fixture.ts` | Custom `test` with pre-built page objects |
| `tests/**/*.spec.ts` | Test files — import from fixture, not playwright directly |

### POM Rules

1. Page object classes live in `src/pages/` and extend `BasePage`
2. Locators are `readonly Locator` properties on the class
3. Methods are user actions — verbs like `clickPlan()`, `getNavLinks()`
4. **No `expect()` inside page objects** — assertions belong in `tests/`

### Test Rules

1. Import `{ test, expect }` from `@fixtures/site.fixture` — not `@playwright/test`
2. Tag every `test()`: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
3. Use `siteConfig.url` — never hardcode `https://digitile.io`
4. Never submit forms, never create accounts

---

## TypeScript Path Aliases

```typescript
@pages/*       →  src/pages/*
@utils/*       →  src/utils/*
@site-types/*  →  src/types/*   ← NOT @types/* (reserved by TypeScript)
@fixtures/*    →  src/fixtures/*
```

> **Important:** The alias for `src/types/` is `@site-types/*`, not `@types/*`. TypeScript reserves `@types` for DefinitelyTyped packages; using it as a path alias causes `TS6137` errors. Always import as `import type { SiteConfig } from '@site-types/site-config.types'`.

---

## Coding Patterns

### Adding a new page object

```typescript
// src/pages/example.page.ts
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@types/site-config.types';
import type { Page } from '@playwright/test';

export class ExamplePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /get started/i }).first();
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent())?.trim() ?? '';
  }

  async clickCta(): Promise<void> {
    await this.ctaButton.click();
  }
}
```

### Adding a new test file

```typescript
// tests/functional/example.spec.ts
import { test, expect } from '@fixtures/site.fixture';

test.describe('Example Feature @functional', () => {
  test('heading is visible @functional', async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url}/example/`);
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
```

---

## What NOT to Do

- Do not submit forms — test field interactions only
- Do not hardcode URLs — use `siteConfig.url`
- Do not put assertions in page objects
- Do not use `page.waitForTimeout()` — use Playwright auto-waiting
- Do not use `any` type without an explicit `// eslint-disable` comment
- Do not import directly from `@playwright/test` in test files
