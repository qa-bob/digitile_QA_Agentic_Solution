---
name: project-digitile-qa
description: Digitile QA Agentic Solution — project context, architecture decisions, and known pitfalls
metadata:
  type: project
---

This repo is a Playwright + TypeScript POM test suite for digitile.io (B2B SaaS DAM + eCommerce product discovery platform).

## Architecture

- Page objects in `src/pages/`, all extend `BasePage`
- Custom fixture in `src/fixtures/site.fixture.ts` — tests import from here, not `@playwright/test`
- Site config driven by `site.config.json`
- Tests tagged: @smoke, @navigation, @forms, @functional, @visual, @responsive

## Critical: TypeScript Path Alias

The `@types/*` alias was renamed to `@site-types/*` to avoid colliding with TypeScript's reserved `@types` namespace (TS6137 error). Always use:
- `import type { SiteConfig } from '@site-types/site-config.types'`

**Why:** Using `@types/*` as a path alias in tsconfig paths causes TypeScript to emit TS6137 on all imports because it interprets them as type declaration file imports. This was a pre-existing bug in the initial commit.

**How to apply:** When adding any new page object or fixture, always use `@site-types/` not `@types/`.

## Page Objects Available

- `HomePage` — hero, CTAs, headings
- `NavigationPage` — nav links, mobile menu, link reachability
- `ContactFormPage` — form discovery, field inspection (no submission)
- `PricingPage` — plan cards, prices, FAQ
- `DamPage` — DAM feature page
- `AiListingPage` — AI product listing page

## Test Files

- `tests/smoke/site-availability.spec.ts`
- `tests/navigation/nav-links.spec.ts`
- `tests/forms/contact-form.spec.ts`
- `tests/functional/homepage.spec.ts`
- `tests/functional/pricing.spec.ts`
- `tests/functional/products-navigation.spec.ts`
- `tests/functional/dam-features.spec.ts`
- `tests/visual/visual-regression.spec.ts`
- `tests/responsive/layout.spec.ts`

## Site Structure (digitile.io)

- Homepage: hero "Supercharge Digital Asset & Product Discovery", CTA "Book A Demo" → /book-demo/
- Products dropdown: 8 sub-pages (DAM, tagging, AI listing, enrichment, ecommerce DAM, Shopify, getting started)
- Pricing: /pricing/ — DAM plans ($29/$149/$399/mo) + eCommerce plans ($499/$975/mo)
- Company: /company/ — team, contact, address (1 North 1st Street STE. 693, Phoenix AZ), live chat only
- No traditional contact form — uses live chat widget (Intercom)
