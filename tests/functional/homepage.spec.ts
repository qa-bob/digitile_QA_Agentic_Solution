/**
 * tests/functional/homepage.spec.ts
 *
 * Functional tests for the Digitile homepage — hero section, CTAs, feature
 * sections, partner section, and footer presence.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Functional Tests @functional', () => {

  test('hero section has a primary heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length, 'Homepage should have a visible h1 or h2').toBeGreaterThan(0);
  });

  test('hero heading contains meaningful content @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading, 'Main heading should not be a generic placeholder').toMatch(
      /discover|digital asset|product|supercharge|unify|organiz|search/i
    );
  });

  test('homepage has at least one CTA button @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(ctaButtons.length, 'Homepage should have at least one CTA link or button').toBeGreaterThan(0);
  });

  test('Book A Demo CTA is present and links to /book-demo/ @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    // Use URL-based selector — avoids false negatives on hidden mobile-menu duplicates
    const bookDemo = page.locator('a[href*="book-demo"]');
    const count = await bookDemo.count();
    expect(count, 'Book A Demo link should be present in page HTML').toBeGreaterThan(0);
    const href = await bookDemo.first().getAttribute('href');
    expect(href, 'Book A Demo should link to /book-demo/').toMatch(/book.demo/i);
  });

  test('Get Started CTA is present @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    // Count-based check avoids timeout when the button is in an animated slider section
    const getStarted = page.locator('a, button').filter({ hasText: /get\s*started/i });
    const count = await getStarted.count();
    expect(count, 'Get Started link or button should be present on the homepage').toBeGreaterThan(0);
  });

  test('homepage renders feature sections @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const sections = page.locator('section, [class*="section"], [class*="feature"]');
    const count = await sections.count();
    expect(count, 'Homepage should have multiple feature sections').toBeGreaterThan(2);
  });

  test('DAM feature section is present @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const damSection = page.locator('h2, h3, h4').filter({ hasText: /dam|digital asset management/i }).first();
    await expect(damSection, 'DAM feature section heading should be visible').toBeVisible();
  });

  test('eCommerce / product enrichment feature is mentioned @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const ecomSection = page.locator('h2, h3, h4, p').filter({
      hasText: /product.*enrichment|ecommerce|site search|discovery/i,
    }).first();
    await expect(ecomSection, 'eCommerce / enrichment feature should appear on homepage').toBeVisible();
  });

  test('Become a Partner section is present @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const partnerSection = page.locator('h2, h3, h4, section').filter({ hasText: /partner/i }).first();
    await expect(partnerSection, 'Partner section should be visible on homepage').toBeVisible();
  });

  test('footer is present and contains navigation links @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const footer = page.locator('footer').first();
    await expect(footer, 'Footer should be present on homepage').toBeVisible();
    const footerLinks = footer.locator('a');
    const linkCount = await footerLinks.count();
    expect(linkCount, 'Footer should contain multiple navigation links').toBeGreaterThan(5);
  });

  test('footer contains Privacy Policy and Terms of Service links @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const footer = page.locator('footer').first();
    const privacyLink = footer.locator('a').filter({ hasText: /privacy/i }).first();
    const termsLink = footer.locator('a').filter({ hasText: /terms/i }).first();
    await expect(privacyLink, 'Privacy Policy link should be in footer').toBeVisible();
    await expect(termsLink, 'Terms of Service link should be in footer').toBeVisible();
  });

  test('social media links are present in footer @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const footer = page.locator('footer').first();
    const socialLinks = footer.locator('a[href*="linkedin"], a[href*="twitter"], a[href*="facebook"]');
    const count = await socialLinks.count();
    expect(count, 'At least one social media link should appear in the footer').toBeGreaterThan(0);
  });

  test('page title includes the brand name @functional', async ({ homePage, siteConfig }) => {
    const title = await homePage.getTitle();
    expect(title.toLowerCase()).toContain(siteConfig.name.toLowerCase());
  });
});
