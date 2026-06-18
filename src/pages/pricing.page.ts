import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export interface PricingPlanInfo {
  name: string;
  price: string;
  features: string[];
}

export class PricingPage extends BasePage {
  readonly planCards: Locator;
  readonly planHeadings: Locator;
  readonly planPrices: Locator;
  readonly ctaButtons: Locator;
  readonly faqSection: Locator;
  readonly faqItems: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.planCards = page.locator(
      '[class*="pricing"], [class*="plan"], [class*="tier"], ' +
      '[class*="package"], [class*="card"]'
    ).filter({ hasText: /\$/ });
    this.planHeadings = page.locator('h2, h3, h4').filter({ hasText: /early.stage|growth|high.growth|discovery|pro/i });
    this.planPrices = page.locator('[class*="price"], [class*="amount"]').filter({ hasText: /\$\d+/ });
    this.ctaButtons = page.locator('a, button').filter({ hasText: /get started|sign up|try|contact|book/i });
    this.faqSection = page.locator('[class*="faq"], [id*="faq"], section').filter({ hasText: /frequently asked|faq/i }).first();
    this.faqItems = page.locator('[class*="faq"] li, [class*="accordion"] .item, details');
  }

  async navigateToPricing(): Promise<void> {
    await this.page.goto(`${this.url}/pricing/`, { waitUntil: 'domcontentloaded' });
  }

  async getPlanCount(): Promise<number> {
    return this.planCards.count();
  }

  async getPlanNames(): Promise<string[]> {
    const all = await this.planHeadings.all();
    const names = await Promise.all(all.map(h => h.textContent()));
    return names.map(n => n?.trim() ?? '').filter(Boolean);
  }

  async getPlanPrices(): Promise<string[]> {
    const all = await this.planPrices.all();
    const prices = await Promise.all(all.map(p => p.textContent()));
    return prices.map(p => p?.trim() ?? '').filter(Boolean);
  }

  async getCtaButtonCount(): Promise<number> {
    return this.ctaButtons.count();
  }

  async hasFaqSection(): Promise<boolean> {
    return this.faqSection.count().then(c => c > 0);
  }

  async getFaqItemCount(): Promise<number> {
    return this.faqItems.count();
  }

  async isPricingPageLoaded(): Promise<boolean> {
    try {
      const cardCount = await this.planCards.count();
      const headingCount = await this.page.locator('h1, h2').count();
      return cardCount > 0 || headingCount > 0;
    } catch {
      return false;
    }
  }
}
