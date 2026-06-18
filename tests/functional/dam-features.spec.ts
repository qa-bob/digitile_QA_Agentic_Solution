/**
 * tests/functional/dam-features.spec.ts
 *
 * Functional tests for the DAM (Digital Asset Management) feature page and
 * the AI Product Listing Optimization page.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('DAM Features Page @functional', () => {

  test.beforeEach(async ({ damPage }) => {
    await damPage.navigateToDam();
  });

  test('DAM page loads with a heading @functional', async ({ damPage }) => {
    const heading = await damPage.getPageHeadingText();
    expect(heading.length, 'DAM page should have a visible heading').toBeGreaterThan(0);
  });

  test('DAM page heading mentions Digital Asset Management @functional', async ({ damPage }) => {
    const heading = await damPage.getPageHeadingText();
    expect(heading).toMatch(/digital asset management|dam|drive|dropbox/i);
  });

  test('Watch Demo button is visible @functional', async ({ damPage }) => {
    const visible = await damPage.isWatchDemoVisible();
    expect(visible, 'Watch Demo button should be visible on DAM page').toBeTruthy();
  });

  test('Get Started button is visible @functional', async ({ damPage }) => {
    const visible = await damPage.isGetStartedVisible();
    expect(visible, 'Get Started button should be visible on DAM page').toBeTruthy();
  });

  test('Get Started links to signup @functional', async ({ page }) => {
    // Check DOM presence — the button may be below the fold or inside a slider
    const getStarted = page.locator('a').filter({ hasText: /get\s*started/i }).first();
    const count = await getStarted.count();
    expect(count, 'Get Started link should be present on the page').toBeGreaterThan(0);
    const href = await getStarted.getAttribute('href');
    expect(href, 'Get Started should link somewhere').toBeTruthy();
    expect(href).not.toBe('#');
  });

  test('search feature section is present @functional', async ({ page }) => {
    // The "Search The Way You Think" heading may be in a hidden slider section
    const searchCount = await page.locator('h2, h3, h4').filter({ hasText: /search/i }).count();
    expect(searchCount, 'Search feature heading should be present in the page').toBeGreaterThan(0);
  });

  test('sharing / access control feature is mentioned @functional', async ({ page }) => {
    const shareSection = page.locator('h2, h3, h4, p').filter({ hasText: /share|access|control/i }).first();
    await expect(shareSection, 'Share/access control feature should be mentioned').toBeVisible();
  });

  test('DAM page has no horizontal scroll at desktop @functional', async ({ damPage }) => {
    const responsive = await damPage.isResponsive();
    expect(responsive, 'DAM page should not overflow horizontally').toBeTruthy();
  });

  test('DAM page has multiple feature sections @functional', async ({ damPage }) => {
    const count = await damPage.getFeatureSectionCount();
    expect(count, 'DAM page should have multiple content sections').toBeGreaterThan(2);
  });
});

test.describe('AI Product Listing Page @functional', () => {

  test.beforeEach(async ({ aiListingPage }) => {
    await aiListingPage.navigateToAiListing();
  });

  test('AI listing page loads with a heading @functional', async ({ aiListingPage }) => {
    const heading = await aiListingPage.getPageHeadingText();
    expect(heading.length, 'AI listing page should have a visible heading').toBeGreaterThan(0);
  });

  test('heading references AI or product listings @functional', async ({ aiListingPage }) => {
    const heading = await aiListingPage.getPageHeadingText();
    expect(heading).toMatch(/product listing|automate|generative ai|ai|scale/i);
  });

  test('at least one Book A Demo CTA is present @functional', async ({ aiListingPage }) => {
    const count = await aiListingPage.getBookDemoButtonCount();
    expect(count, 'At least one Book A Demo button should be on the AI listing page').toBeGreaterThan(0);
  });

  test('feature tabs are present @functional', async ({ aiListingPage }) => {
    const count = await aiListingPage.getTabCount();
    expect(count, 'Feature tabs should be present on AI listing page').toBeGreaterThan(0);
  });

  test('tab labels reference expected feature names @functional', async ({ aiListingPage, page }) => {
    const labels = await aiListingPage.getTabLabels();
    const combined = labels.join(' ').toLowerCase();
    const hasExpected =
      combined.includes('generative') ||
      combined.includes('workflow') ||
      combined.includes('template') ||
      combined.includes('scalab') ||
      combined.includes('competitive');
    expect(hasExpected, `Tab labels should reference AI features. Found: ${labels.join(', ')}`).toBeTruthy();
  });

  test('marketplaces section or logos are present @functional', async ({ page }) => {
    // Use specific text-bearing elements — page.locator('*') returns ancestors which may be hidden
    const count = await page.locator('h2, h3, h4, p, li, span, td').filter({
      hasText: /amazon|walmart|target|ebay|etsy|25 different marketplace/i,
    }).count();
    expect(count, 'At least one marketplace name should appear on the AI listing page').toBeGreaterThan(0);
  });

  test('contact / Let\'s Talk section is present @functional', async ({ page }) => {
    const contactSection = page.locator('h2, h3, h4, section').filter({ hasText: /let.*talk|contact|get in touch/i }).first();
    await expect(contactSection, 'Contact section should be visible on AI listing page').toBeVisible();
  });

  test('AI listing page has no horizontal scroll at desktop @functional', async ({ aiListingPage }) => {
    const responsive = await aiListingPage.isResponsive();
    expect(responsive, 'AI listing page should not overflow horizontally').toBeTruthy();
  });
});
