/**
 * tests/functional/pricing.spec.ts
 *
 * Functional tests for the Digitile pricing page — plan cards, pricing tiers,
 * CTA buttons, and FAQ section.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Pricing Page @functional', () => {

  test.beforeEach(async ({ pricingPage }) => {
    await pricingPage.navigateToPricing();
  });

  test('pricing page loads and has a heading @functional', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading, 'Pricing page should have a visible heading').toBeVisible();
  });

  test('pricing page URL is correct @functional', async ({ page, siteConfig }) => {
    expect(page.url()).toContain(`${siteConfig.url}/pricing`);
  });

  test('at least two pricing plan sections are visible @functional', async ({ page }) => {
    const planHeadings = page.locator('h2, h3').filter({
      hasText: /early.stage|growth|high.growth|discovery|pro|tagging/i,
    });
    const count = await planHeadings.count();
    expect(count, 'At least two pricing plan headings should be visible').toBeGreaterThanOrEqual(2);
  });

  test('at least one price ($) is displayed @functional', async ({ page }) => {
    const prices = page.locator('*').filter({ hasText: /^\$\d+/ });
    const count = await prices.count();
    expect(count, 'At least one price should appear on the pricing page').toBeGreaterThan(0);
  });

  test('DAM pricing section is present @functional', async ({ page }) => {
    // Tab labels may be in <li> or <a> elements rather than headings on desktop
    const count = await page.locator('h2, h3, h4, li, a, button').filter({
      hasText: /digital asset management/i,
    }).count();
    expect(count, 'Digital Asset Management pricing section should be present on the page').toBeGreaterThan(0);
  });

  test('eCommerce product discovery pricing section is present @functional', async ({ page }) => {
    // Tab label is "Commerce Search Enrichment" on this site
    const count = await page.locator('h2, h3, h4, li, a, button').filter({
      hasText: /commerce search|product discovery|enrichment/i,
    }).count();
    expect(count, 'Commerce Search / eCommerce pricing section should be present on the page').toBeGreaterThan(0);
  });

  test('at least one Get Started / CTA button is present @functional', async ({ pricingPage }) => {
    const count = await pricingPage.getCtaButtonCount();
    expect(count, 'At least one CTA button should be on the pricing page').toBeGreaterThan(0);
  });

  test('Get Started CTA links away from the pricing page @functional', async ({ page, siteConfig }) => {
    const getStartedLinks = page.locator('a').filter({ hasText: /get started/i });
    const count = await getStartedLinks.count();
    if (count > 0) {
      const href = await getStartedLinks.first().getAttribute('href');
      expect(href, 'Get Started link should have an href').toBeTruthy();
      // Should link to signup or another page — not just "#"
      expect(href).not.toBe('#');
    }
  });

  test('Tagging as a Service / Contact Sales option is listed @functional', async ({ page }) => {
    const contactSales = page.locator('*').filter({ hasText: /contact.*sales|tagging as a service/i }).first();
    await expect(contactSales, 'Contact sales option should be visible on pricing page').toBeVisible();
  });

  test('pricing page has no horizontal scroll on desktop @functional', async ({ pricingPage }) => {
    const responsive = await pricingPage.isResponsive();
    expect(responsive, 'Pricing page should not overflow horizontally').toBeTruthy();
  });

  test('pricing page title is descriptive @functional', async ({ pricingPage, siteConfig }) => {
    const title = await pricingPage.getTitle();
    expect(title.trim().length, 'Pricing page should have a page title').toBeGreaterThan(0);
  });
});
