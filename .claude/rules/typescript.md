---
paths:
  - "src/**/*.ts"
  - "tests/**/*.ts"
---

# TypeScript Rules

Applies to all TypeScript files in `src/` and `tests/`.

---

## Strict Mode

TypeScript strict mode is enabled in `tsconfig.json`. This means:
- No implicit `any` — all variables must be typed
- Strict null checks — handle `null` and `undefined` explicitly
- No unused variables (ESLint rule)

When you see `(await locator.textContent())`, always handle the possible `null`:
```typescript
// Correct
const text = (await locator.textContent())?.trim() ?? '';

// Wrong — may throw at runtime
const text = await locator.textContent();
text.trim(); // ❌ textContent() can return null
```

## Type Imports

Use `import type` for type-only imports to improve tree-shaking and compile speed:
```typescript
import type { Page, Locator } from '@playwright/test';
import type { SiteConfig } from '@types/site-config.types';
```

Import runtime values normally:
```typescript
import { BasePage } from '@pages/base.page';
```

## Path Aliases

Always use path aliases — never relative `../../` imports:
```typescript
// Correct
import { BasePage } from '@pages/base.page';
import { loadSiteConfig } from '@types/site-config.types';

// Wrong
import { BasePage } from '../../src/pages/base.page'; // ❌
```

## Return Types

Always declare return types on public page object methods:
```typescript
// Correct
async getPlanNames(): Promise<string[]> { ... }
async clickPlan(name: string): Promise<void> { ... }

// Wrong — implicit return type
async getPlanNames() { ... } // ❌
```

## Async/Await

- Always `await` Playwright operations — they return Promises
- Use `Promise.all()` for parallel independent operations:
  ```typescript
  const [text, count] = await Promise.all([
    locator.textContent(),
    locator.count(),
  ]);
  ```

## Verify After Changes

Always run `npx tsc --noEmit` after making TypeScript changes to confirm zero errors.
