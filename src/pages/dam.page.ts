import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class DamPage extends BasePage {
  readonly pageHeading: Locator;
  readonly featureSections: Locator;
  readonly watchDemoButton: Locator;
  readonly getStartedButton: Locator;
  readonly videoPlayer: Locator;
  readonly featureHeadings: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pageHeading = page.locator('h1, h2').filter({ hasText: /digital asset management|dam/i }).first();
    this.featureSections = page.locator('section, [class*="feature"], [class*="section"]');
    this.watchDemoButton = page.locator('a, button').filter({ hasText: /watch demo/i }).first();
    this.getStartedButton = page.locator('a').filter({ hasText: /get started/i }).first();
    this.videoPlayer = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"], [class*="video"]').first();
    this.featureHeadings = page.locator('h2, h3').filter({
      hasText: /search|share|visuali|organiz|tag|custom field|filter|grid|list|table/i,
    });
  }

  async navigateToDam(): Promise<void> {
    await this.page.goto(`${this.url}/dam-google-drive-dropbox/`, { waitUntil: 'domcontentloaded' });
  }

  async getPageHeadingText(): Promise<string> {
    return (await this.pageHeading.textContent())?.trim() ?? '';
  }

  async getFeatureHeadingTexts(): Promise<string[]> {
    const all = await this.featureHeadings.all();
    const texts = await Promise.all(all.map(h => h.textContent()));
    return texts.map(t => t?.trim() ?? '').filter(Boolean);
  }

  async isWatchDemoVisible(): Promise<boolean> {
    // Watch Demo is in a Revolution Slider — check DOM presence rather than visual visibility
    if (await this.watchDemoButton.count() > 0) return true;
    // Broader: any element (including custom slider elements) containing "Watch Demo" text
    const textMatch = this.page.getByText(/watch\s*demo/i).first();
    return (await textMatch.count()) > 0;
  }

  async isGetStartedVisible(): Promise<boolean> {
    // Check by URL pattern first (most reliable)
    const byUrl = this.page.locator('a[href*="signup"], a[href*="cloud.digitile"]').first();
    if (await byUrl.count() > 0) return true;
    // Fallback: text-based detection
    return (await this.getStartedButton.count()) > 0;
  }

  async hasVideoPlayer(): Promise<boolean> {
    return this.videoPlayer.count().then(c => c > 0);
  }

  async getFeatureSectionCount(): Promise<number> {
    return this.featureSections.count();
  }
}
