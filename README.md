# Digitile QA Agentic Solution

Automated end-to-end regression test suite for [digitile.io](https://digitile.io), built with **Playwright + TypeScript** using the **Page Object Model (POM)** design pattern and **Object-Oriented Programming (OOP)** principles.

This repository is designed to run autonomously with **Claude Code** — tests can be generated, executed, and analyzed entirely through agentic slash commands.

---

## Table of Contents

- [What This Tests](#what-this-tests)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Slash Commands (Claude Code)](#slash-commands-claude-code)
- [Agents](#agents)
- [Skills](#skills)
- [Contributing](#contributing)
- [Repo Rules](#repo-rules)

---

## What This Tests

The suite covers all major features of the Digitile website without creating accounts or submitting forms:

| Area | What's Covered |
|------|----------------|
| **Smoke** | Site reachability, HTTPS, page title, load time, console errors |
| **Navigation** | Products dropdown, nav links, mobile menu, logo, footer links |
| **Forms** | Contact form fields, validation, accessibility (no submission) |
| **Functional** | Homepage hero/CTAs, pricing tiers, DAM features, AI listing page, partner section |
| **Visual** | Screenshot regression at desktop / tablet / mobile viewports |
| **Responsive** | No horizontal overflow, readable fonts, alt text, viewport meta tag |

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | >= 18 LTS | [nodejs.org](https://nodejs.org) |
| npm | >= 9 | Bundled with Node |
| Git | any | [git-scm.com](https://git-scm.com) |
| Claude Code | latest | `irm https://claude.ai/install.ps1 \| iex` (Windows) |

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/<org>/digitile_QA_Agentic_Solution.git
cd digitile_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps

# 4. (Optional) Copy environment file
cp .env.example .env
```

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SITE_URL` | _(from site.config.json)_ | Override the site URL for staging/preview environments |
| `CI` | `false` | Enables retries and parallel workers when set to `true` |

### Site Configuration

All test behaviour is driven by `site.config.json`. Edit this file to target a different environment or toggle optional test modules:

```jsonc
{
  "name": "Digitile",
  "url": "https://digitile.io",
  "hasContactForm": true,
  "skipVisual": false,
  "skipForms": false,
  "viewports": ["desktop", "mobile", "tablet"]
}
```

---

## Running Tests

```bash
# All tests
npm test

# By category
npm run test:smoke
npm run test:navigation
npm run test:forms
npm run test:visual
npm run test:responsive

# Update visual baselines (run after intentional UI changes)
npm run baseline

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Filtering by tag

```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@functional"
npx playwright test --grep "@visual"
```

### Viewing the HTML report

```bash
npx playwright show-report
```

---

## Project Structure

```
digitile_QA_Agentic_Solution/
├── site.config.json          # Single source of truth for the site under test
├── playwright.config.ts      # Playwright projects: desktop, mobile, tablet
├── global-setup.ts           # Pre-suite site reachability check
├── CLAUDE.md                 # Claude Code instructions (agentic rules)
├── AGENTS.md                 # Instructions for other AI coding agents
├── Skills.md                 # Reference for all available slash-command skills
│
├── src/
│   ├── pages/                # Page Object Model classes (one per page/section)
│   │   ├── base.page.ts      # BasePage — shared helpers for all pages
│   │   ├── home.page.ts      # HomePage — hero, CTAs, headings
│   │   ├── navigation.page.ts# NavigationPage — nav links, mobile menu
│   │   ├── contact.page.ts   # ContactFormPage — form fields, validation
│   │   ├── pricing.page.ts   # PricingPage — plan cards, tiers, FAQs
│   │   ├── dam.page.ts       # DamPage — DAM feature sections
│   │   └── ai-listing.page.ts# AiListingPage — AI product listing features
│   ├── fixtures/
│   │   └── site.fixture.ts   # Custom Playwright fixtures (exposes page objects)
│   ├── utils/
│   │   ├── link-checker.ts   # HTTP link reachability helpers
│   │   └── visual-helper.ts  # Screenshot and viewport utilities
│   └── types/
│       └── site-config.types.ts # TypeScript interfaces + config loader
│
├── tests/
│   ├── smoke/                # @smoke — load, HTTPS, title, console errors
│   ├── navigation/           # @navigation — nav links, menus, routing
│   ├── forms/                # @forms — field validation, accessibility
│   ├── functional/           # @functional — business features per page
│   ├── visual/               # @visual — screenshot regression
│   └── responsive/           # @responsive — layout at each viewport
│
├── .claude/
│   ├── settings.json         # Claude Code project permissions and hooks
│   ├── agents/               # Autonomous Claude Code sub-agents
│   ├── commands/             # Slash command definitions
│   ├── hooks/                # Pre/post lifecycle shell hooks
│   └── rules/                # Path-scoped rules for Claude Code
│
└── .github/
    ├── AGENTS.md             # GitHub Copilot / Codespaces agent instructions
    ├── workflows/
    │   ├── ci.yml            # Pull request test run (smoke + functional)
    │   └── visual-baseline.yml # Manual visual baseline capture workflow
    └── pull_request_template.md
```

---

## Architecture

### Page Object Model (POM)

Every page or major section of the site has a corresponding class in `src/pages/`. Following strict POM rules:

- All classes **extend `BasePage`**
- Locators are **`readonly Locator`** properties declared on the class
- Methods represent **user actions**, not assertions
- **No `expect()` calls inside page objects** — assertions belong in test files
- Tests import page objects via the **custom fixture** (`src/fixtures/site.fixture.ts`)

### OOP Inheritance Chain

```
BasePage
  ├── HomePage
  ├── NavigationPage
  ├── ContactFormPage
  ├── PricingPage
  ├── DamPage
  └── AiListingPage
```

`BasePage` provides: navigation, `getTitle()`, `isResponsive()`, `takeScreenshot()`, `getLinkElements()`, `getFormElements()`.

### Test Structure

Each test file:
1. Imports `{ test, expect }` from `@fixtures/site.fixture`
2. Uses destructured fixtures: `{ homePage, siteConfig, page }`
3. Tags every `test()` call with at least one category tag
4. Calls page-object methods; asserts with `expect()`

### Configuration-Driven

`site.config.json` is loaded once via `loadSiteConfig()` and injected into every test through the `siteConfig` fixture. Tests never hardcode URLs — they always use `siteConfig.url` or Playwright's `baseURL`.

---

## Slash Commands (Claude Code)

Run these commands from within a Claude Code session (`claude` in your terminal):

| Command | Description |
|---------|-------------|
| `/generate-full-suite` | Analyze the live site and generate complete POM + test suite |
| `/analyze-site` | Inspect site structure: pages, forms, nav items, elements |
| `/run-smoke` | Run smoke tests and show a formatted pass/fail report |
| `/update-baseline` | Capture new visual regression baselines |
| `/generate-report` | Parse test results and generate a human-readable summary |

---

## Agents

This repo ships two autonomous Claude Code sub-agents for complex tasks. See [AGENTS.md](./AGENTS.md) for full documentation.

| Agent | Trigger | Purpose |
|-------|---------|---------|
| `site-analyzer` | `/analyze-site` | Crawl the live site and produce a populated `site.config.json` |
| `test-generator` | `/generate-full-suite` | Generate site-specific page objects and Playwright test files |

---

## Skills

See [Skills.md](./Skills.md) for the complete reference on all available Claude Code skills including invocation syntax, inputs, outputs, and examples.

---

## Contributing

### Branch Naming

```
feat/  — new test coverage or page objects
fix/   — broken test or selector repair
chore/ — config, deps, tooling
docs/  — README, CLAUDE.md, comments
```

### Before Opening a PR

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] New page objects follow POM rules (no assertions, typed locators, extends BasePage)
- [ ] New tests import from `@fixtures/site.fixture`, not `@playwright/test`
- [ ] All new `test()` calls are tagged with at least one category tag
- [ ] Visual baselines updated if UI changed: `npm run baseline`
- [ ] No hardcoded URLs — use `siteConfig.url` or Playwright `baseURL`
- [ ] No form submissions — test validation only

### Repo Rules

See [CLAUDE.md](./CLAUDE.md) for the full architecture rules enforced by Claude Code in every session.

**Critical constraints:**
- Never submit any form
- Never create accounts or enter real credentials
- Never use `page.waitForTimeout()` — use Playwright auto-waiting
- Never put assertions inside page object methods
- Never use the `any` type without explicit justification

---

## CI/CD

GitHub Actions runs on every pull request:
- **`ci.yml`** — Smoke + functional tests on Chromium desktop; uploads HTML report as artifact
- **`visual-baseline.yml`** — Manual workflow to regenerate visual snapshots after approved UI changes

See [`.github/workflows/`](./.github/workflows/) for workflow definitions.
