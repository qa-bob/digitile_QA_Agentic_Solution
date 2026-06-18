# Playwright Conventions

Rules that apply to all Playwright test and page object files.

---

## Locator Strategy Priority

Use locators in this order — prefer the most semantic:

1. `getByRole()` — semantic ARIA role (best for accessibility)
2. `getByLabel()` — form inputs with labels
3. `getByText()` — visible text
4. `getByTestId()` — `data-testid` attributes (when present)
5. CSS class selectors — use `[class*="partial-name"]` for resilience
6. Element + attribute combinations — e.g., `input[type="email"]`

Never use:
- XPath (brittle, hard to read)
- nth-child or positional selectors unless no alternative exists
- Auto-generated class names (e.g., `.css-1abc23x`)

## Auto-Waiting

- Never use `page.waitForTimeout()` — Playwright auto-waits for visibility and stability
- Use `page.waitForSelector()` only when an element appears after a dynamic action
- Use `page.waitForLoadState('networkidle')` only for pages with heavy async data loading
- Prefer `await expect(locator).toBeVisible()` over manual waits

## Assertions

- Always use Playwright's built-in `expect()` — it retries automatically
- Prefer `toBeVisible()` over `toHaveCount()` when checking a single element
- Use `toHaveText()` and `toContainText()` for text matching — they retry
- Set explicit timeout on slow assertions: `await expect(el).toBeVisible({ timeout: 10_000 })`

## Network Requests

- Use `page.goto(url, { waitUntil: 'domcontentloaded' })` for most navigations
- Use `'networkidle'` only when the page relies on async data before content appears
- Never use `'load'` for SPA navigations — it fires too early

## Screenshots

- Visual regression tests use `await expect(page).toHaveScreenshot(name, options)`
- Call `await visual.dismissCookieBanner(page)` before any screenshot
- Wait for animations: `await page.waitForLoadState('networkidle')` before snapshot
- Use `DEFAULT_SNAPSHOT_OPTIONS` from `src/utils/visual-helper.ts`
