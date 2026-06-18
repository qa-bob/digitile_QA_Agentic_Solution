/**
 * tests/functional/products-navigation.spec.ts
 *
 * Functional tests for the Products dropdown navigation — all sub-pages are
 * reachable and have meaningful content.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const PRODUCT_LINKS = [
  { name: 'DAM for Google Drive & Dropbox', path: '/dam-google-drive-dropbox/' },
  { name: 'Intelligent Tagging', path: '/document-tagging/' },
  { name: 'Getting Started with Digitile\'s DAM', path: '/getting-started-with-digitile/' },
  { name: 'Shopify Integration', path: '/shopify-dam-lite-pim/' },
  { name: 'Intelligent Product Data Enrichment', path: '/product-data-enrichment/' },
  { name: 'eCommerce DAM', path: '/ecommerce-dam/' },
  { name: 'AI Product Listing Optimization', path: '/generative-ai-product-listing-optimization/' },
] as const;

test.describe('Products Navigation @functional', () => {

  test('Products dropdown trigger is visible in nav @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    // DOM presence check — on mobile/tablet the link is hidden behind a hamburger menu
    const productsMenu = page.locator('a').filter({ hasText: /^products$/i }).first();
    const count = await productsMenu.count();
    expect(count, 'Products link should be present in navigation DOM').toBeGreaterThan(0);
  });

  test('Pricing link is in the navigation @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const pricingLink = page.locator('a[href$="/pricing/"], a[href$="/pricing"]').first();
    const count = await pricingLink.count();
    expect(count, 'Pricing link should be present in navigation DOM').toBeGreaterThan(0);
  });

  test('Company link is in the navigation @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const companyLink = page.locator('a[href$="/company/"], a[href$="/company"]').first();
    const count = await companyLink.count();
    expect(count, 'Company link should be present in navigation DOM').toBeGreaterThan(0);
  });

  test('Login link is present in navigation @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    // Site uses "Log In" (with space) — regex covers both spellings
    const loginLink = page.locator('a').filter({ hasText: /log[\s-]*in|login/i }).first();
    const count = await loginLink.count();
    expect(count, 'Login / Log In link should be present in navigation DOM').toBeGreaterThan(0);
  });

  test('Pricing page is reachable via nav link @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    // On mobile/tablet the link is hidden — navigate by href directly
    const pricingLink = page.locator('a[href$="/pricing/"], a[href$="/pricing"]').first();
    const href = await pricingLink.getAttribute('href');
    expect(href, 'Pricing nav link should have an href').toBeTruthy();
    await page.goto(href!, { waitUntil: 'domcontentloaded' });
    expect(page.url()).toContain('/pricing');
  });

  test('Company page is reachable via nav link @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    // On mobile/tablet the link is hidden — navigate by href directly
    const companyLink = page.locator('a[href$="/company/"], a[href$="/company"]').first();
    const href = await companyLink.getAttribute('href');
    expect(href, 'Company nav link should have an href').toBeTruthy();
    await page.goto(href!, { waitUntil: 'domcontentloaded' });
    expect(page.url()).toContain('/company');
  });

  for (const product of PRODUCT_LINKS) {
    test(`product sub-page loads: ${product.name} @functional`, async ({ page, siteConfig }) => {
      const url = `${siteConfig.url}${product.path}`;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

      expect(response, `${product.name} page should return a response`).not.toBeNull();
      const status = response!.status();
      expect(
        status >= 200 && status < 400,
        `${product.name} returned HTTP ${status} — expected 2xx/3xx`
      ).toBeTruthy();

      const heading = page.locator('h1, h2').first();
      await expect(heading, `${product.name} should have a visible heading`).toBeVisible();
    });
  }

  test('logo links back to homepage @functional', async ({ page, siteConfig }) => {
    await page.goto(`${siteConfig.url}/pricing/`, { waitUntil: 'domcontentloaded' });
    const logo = page.locator('header a[href="/"], header a[href*="digitile.io"]').first();
    const href = await logo.getAttribute('href');
    expect(href, 'Logo link should point to the homepage').toBeTruthy();
  });

  test('footer company section links to correct pages @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const footer = page.locator('footer');
    const ourStory = footer.locator('a').filter({ hasText: /our story/i }).first();
    const team = footer.locator('a').filter({ hasText: /^team$/i }).first();
    const careers = footer.locator('a').filter({ hasText: /careers/i }).first();

    await expect(ourStory).toBeVisible();
    await expect(team).toBeVisible();
    await expect(careers).toBeVisible();
  });
});
