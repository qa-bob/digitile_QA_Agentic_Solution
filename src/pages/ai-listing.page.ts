import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class AiListingPage extends BasePage {
  readonly pageHeading: Locator;
  readonly featureTabs: Locator;
  readonly bookDemoButtons: Locator;
  readonly marketplacesList: Locator;
  readonly featureHeadings: Locator;
  readonly contactSection: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pageHeading = page.locator('h1, h2').filter({ hasText: /product listing|automate|generative ai/i }).first();
    this.featureTabs = page.locator('[role="tab"], [class*="tab-item"], [class*="tab"] li, nav.tabs a');
    this.bookDemoButtons = page.locator('a, button').filter({ hasText: /book.*demo|book a demo/i });
    this.marketplacesList = page.locator('[class*="marketplace"], [class*="logo"], ul').filter({
      hasText: /amazon|walmart|target|ebay|etsy|shopify/i,
    }).first();
    this.featureHeadings = page.locator('h2, h3').filter({
      hasText: /generative ai|workflow|template|scalab|competitive/i,
    });
    this.contactSection = page.locator('section, div').filter({ hasText: /let.*talk|contact|get in touch/i }).last();
  }

  async navigateToAiListing(): Promise<void> {
    await this.page.goto(
      `${this.url}/generative-ai-product-listing-optimization/`,
      { waitUntil: 'domcontentloaded' }
    );
  }

  async getPageHeadingText(): Promise<string> {
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }

  async getTabCount(): Promise<number> {
    return this.featureTabs.count();
  }

  async getTabLabels(): Promise<string[]> {
    const all = await this.featureTabs.all();
    const labels = await Promise.all(all.map(t => t.textContent()));
    return labels.map(l => l?.trim() ?? '').filter(Boolean);
  }

  async getBookDemoButtonCount(): Promise<number> {
    return this.bookDemoButtons.count();
  }

  async hasMarketplacesSection(): Promise<boolean> {
    return this.marketplacesList.count().then(c => c > 0);
  }

  async getFeatureHeadingTexts(): Promise<string[]> {
    const all = await this.featureHeadings.all();
    const texts = await Promise.all(all.map(h => h.textContent()));
    return texts.map(t => t?.trim() ?? '').filter(Boolean);
  }

  async isContactSectionVisible(): Promise<boolean> {
    return this.contactSection.isVisible().catch(() => false);
  }
}
