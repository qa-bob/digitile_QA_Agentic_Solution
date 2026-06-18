import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '@site-types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { PricingPage } from '@pages/pricing.page';
import { DamPage } from '@pages/dam.page';
import { AiListingPage } from '@pages/ai-listing.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactFormPage page object (does not auto-navigate) */
  contactPage: ContactFormPage;
  /** PricingPage page object (does not auto-navigate) */
  pricingPage: PricingPage;
  /** DamPage page object (does not auto-navigate) */
  damPage: DamPage;
  /** AiListingPage page object (does not auto-navigate) */
  aiListingPage: AiListingPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  pricingPage: async ({ page, siteConfig }, use) => {
    const pricingPage = new PricingPage(page, siteConfig);
    await use(pricingPage);
  },

  damPage: async ({ page, siteConfig }, use) => {
    const damPage = new DamPage(page, siteConfig);
    await use(damPage);
  },

  aiListingPage: async ({ page, siteConfig }, use) => {
    const aiListingPage = new AiListingPage(page, siteConfig);
    await use(aiListingPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };
