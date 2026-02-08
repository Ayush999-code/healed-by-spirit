import { test, expect } from "@playwright/test";

/**
 * Test header navigation, footer links, and CTA links across all pages.
 */

test.describe("Header navigation", () => {
  test("desktop nav links navigate correctly", async ({ page }) => {
    await page.goto("/");

    const navLinks = [
      { text: "About", href: "/about" },
      { text: "Services", href: "/services" },
      { text: "Book", href: "/book" },
      { text: "Shop", href: "/shop" },
      { text: "Contact", href: "/contact" },
    ];

    for (const { text, href } of navLinks) {
      // Use desktop nav (hidden on mobile)
      const link = page.locator(`nav a:has-text("${text}")`).first();
      await expect(link).toBeVisible();
      expect(await link.getAttribute("href")).toBe(href);
    }
  });

  test("logo links to homepage", async ({ page }) => {
    await page.goto("/about");
    const logo = page.locator('header a[href="/"]').first();
    await logo.click();
    await page.waitForURL("/");
    expect(page.url()).toContain("/");
  });

  test("subscribe button links to shop", async ({ page }) => {
    await page.goto("/");
    const btn = page.locator('header a:has-text("Subscribe")').first();
    expect(await btn.getAttribute("href")).toBe("/shop");
  });
});

test.describe("Footer links", () => {
  // Use /terms (short page) so footer is near viewport — triggers stagger animation
  test("service links in footer navigate to correct pages", async ({ page }) => {
    await page.goto("/terms");
    await page.locator("footer").scrollIntoViewIfNeeded();

    const serviceLinks = [
      { text: "Healing Sessions", href: "/services/healing-sessions" },
      { text: "Soul Connection Workshops", href: "/services/workshops" },
      { text: "Connect & Radiate", href: "/services/connect-radiate" },
      { text: "Healer's Curriculum", href: "/services/healers-curriculum" },
    ];

    for (const { text, href } of serviceLinks) {
      const link = page.locator(`footer a:has-text("${text}")`);
      await expect(link).toBeVisible({ timeout: 5000 });
      expect(await link.getAttribute("href")).toBe(href);
    }
  });

  test("quick links in footer navigate correctly", async ({ page }) => {
    await page.goto("/terms");
    await page.locator("footer").scrollIntoViewIfNeeded();

    const quickLinks = [
      { text: "About Brian", href: "/about" },
      { text: "Shop", href: "/shop" },
      { text: "Contact", href: "/contact" },
      { text: "Terms & Conditions", href: "/terms" },
    ];

    for (const { text, href } of quickLinks) {
      const link = page.locator("footer").getByRole("link", { name: text, exact: true });
      await expect(link).toBeVisible({ timeout: 5000 });
      expect(await link.getAttribute("href")).toBe(href);
    }
  });

  test("footer contact links have correct protocols", async ({ page }) => {
    await page.goto("/terms");
    await page.locator("footer").scrollIntoViewIfNeeded();

    const phoneLink = page.locator('footer a[href^="tel:"]');
    await expect(phoneLink).toBeVisible({ timeout: 5000 });
    expect(await phoneLink.getAttribute("href")).toBe("tel:505-541-0265");

    const emailLink = page.locator('footer a[href^="mailto:"]');
    await expect(emailLink).toBeVisible({ timeout: 5000 });
    expect(await emailLink.getAttribute("href")).toBe("mailto:healer@healedbyspirit.com");
  });

  test("social media links open in new tab", async ({ page }) => {
    await page.goto("/terms");
    await page.locator("footer").scrollIntoViewIfNeeded();

    const facebook = page.locator('footer a[aria-label="Facebook"]');
    await expect(facebook).toBeVisible({ timeout: 5000 });
    expect(await facebook.getAttribute("target")).toBe("_blank");
    expect(await facebook.getAttribute("rel")).toContain("noopener");

    const youtube = page.locator('footer a[aria-label="YouTube"]');
    await expect(youtube).toBeVisible({ timeout: 5000 });
    expect(await youtube.getAttribute("target")).toBe("_blank");
    expect(await youtube.getAttribute("rel")).toContain("noopener");
  });

  test("copyright text shows current year", async ({ page }) => {
    await page.goto("/terms");
    await page.locator("footer").scrollIntoViewIfNeeded();
    const year = new Date().getFullYear().toString();
    const copyright = page.locator("footer").getByText(year);
    await expect(copyright).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Page CTA links", () => {
  test("homepage hero CTAs link correctly", async ({ page }) => {
    await page.goto("/");

    const exploreServices = page.locator('a:has-text("Explore Services")').first();
    expect(await exploreServices.getAttribute("href")).toBe("/services");

    const meetBrian = page.locator('a:has-text("Meet Brian")').first();
    expect(await meetBrian.getAttribute("href")).toBe("/about");
  });

  test("homepage CTA section links to contact", async ({ page }) => {
    await page.goto("/");
    const contactCta = page.locator('section a:has-text("Contact Us")').last();
    expect(await contactCta.getAttribute("href")).toBe("/contact");
  });

  test("services page CTA links", async ({ page }) => {
    await page.goto("/services");

    const getInTouch = page.locator('a:has-text("Get in Touch")').first();
    expect(await getInTouch.getAttribute("href")).toBe("/contact");

    const browseShop = page.locator('a:has-text("Browse Shop")').first();
    expect(await browseShop.getAttribute("href")).toBe("/shop");
  });

  test("service detail CTA links", async ({ page }) => {
    await page.goto("/services/healing-sessions");

    const contactUs = page.locator('a:has-text("Contact Us")').first();
    expect(await contactUs.getAttribute("href")).toBe("/contact");

    const purchaseShop = page.locator('a:has-text("Purchase in Shop")').first();
    expect(await purchaseShop.getAttribute("href")).toBe("/shop");
  });

  test("service detail has back link to all services", async ({ page }) => {
    await page.goto("/services/healing-sessions");
    const backLink = page.locator('a:has-text("All Services")');
    expect(await backLink.getAttribute("href")).toBe("/services");
  });

  test("about page CTA links to services", async ({ page }) => {
    await page.goto("/about");
    const viewServices = page.locator('a:has-text("View All Services")').first();
    expect(await viewServices.getAttribute("href")).toBe("/services");
  });

  test("book page links to shop", async ({ page }) => {
    await page.goto("/book");

    const printBook = page.locator('a:has-text("Print Book")');
    expect(await printBook.getAttribute("href")).toBe("/shop?category=Books");

    const visitShop = page.locator('a:has-text("Visit Shop")').first();
    expect(await visitShop.getAttribute("href")).toBe("/shop");
  });
});
