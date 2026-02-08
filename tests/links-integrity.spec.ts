import { test, expect } from "@playwright/test";

/**
 * Click-through tests: actually navigate every internal link and verify
 * the destination page loads without errors.
 */

test.describe("Internal link click-through", () => {
  test("navigate through all header links from homepage", async ({ page }) => {
    await page.goto("/");

    const routes = [
      { linkText: "About", expectedUrl: "/about" },
      { linkText: "Services", expectedUrl: "/services" },
      { linkText: "Book", expectedUrl: "/book" },
      { linkText: "Shop", expectedUrl: "/shop" },
      { linkText: "Contact", expectedUrl: "/contact" },
    ];

    for (const { linkText, expectedUrl } of routes) {
      await page.goto("/"); // Start from home each time
      const link = page.locator(`nav a:has-text("${linkText}")`).first();
      await link.click();
      await page.waitForURL(`**${expectedUrl}`);
      expect(page.url()).toContain(expectedUrl);

      // Verify the page actually rendered (has an h1)
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("navigate to each service detail from services page", async ({ page }) => {
    await page.goto("/services");

    const serviceSlugs = [
      "healing-sessions",
      "workshops",
      "connect-radiate",
      "healers-curriculum",
    ];

    for (const slug of serviceSlugs) {
      await page.goto("/services");
      const link = page.locator(`a[href="/services/${slug}"]`).first();
      await link.click();
      await page.waitForURL(`**/services/${slug}`);
      expect(page.url()).toContain(`/services/${slug}`);
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("homepage service cards navigate to detail pages", async ({ page }) => {
    await page.goto("/");

    // Click the first service card link
    const firstServiceLink = page.locator('a[href^="/services/"]').first();
    const href = await firstServiceLink.getAttribute("href");
    await firstServiceLink.click();
    await page.waitForURL(`**${href}`);
    expect(page.url()).toContain("/services/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("book page → shop navigation works", async ({ page }) => {
    await page.goto("/book");

    const visitShop = page.locator('a:has-text("Visit Shop")').first();
    await visitShop.click();
    await page.waitForURL("**/shop");
    expect(page.url()).toContain("/shop");
  });

  test("service detail back link → services list", async ({ page }) => {
    await page.goto("/services/healing-sessions");

    const backLink = page.locator('a:has-text("All Services")');
    await backLink.click();
    await page.waitForURL("**/services");
    expect(page.url()).toContain("/services");
    // Should NOT contain a slug
    expect(page.url()).not.toMatch(/\/services\/.+/);
  });

  test("footer links all navigate correctly", async ({ page }) => {
    const footerLinks = [
      "About Brian",
      "Shop",
      "Contact",
      "Terms & Conditions",
      "Healing Sessions",
    ];

    for (const text of footerLinks) {
      // Use /terms (short page) so footer is easily reachable
      await page.goto("/terms");

      const link = page.locator("footer").getByRole("link", { name: text, exact: true });
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible({ timeout: 5000 });
      const href = await link.getAttribute("href");
      await link.click();
      await page.waitForURL(`**${href}`);
      expect(page.url()).toContain(href!);
    }
  });
});

test.describe("All internal links return 200", () => {
  test("crawl all internal links on homepage", async ({ page, request }) => {
    await page.goto("/");

    // Collect all unique internal href values
    const allLinks = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
      [...new Set(anchors.map((a) => a.getAttribute("href")!))].filter(Boolean)
    );

    expect(allLinks.length).toBeGreaterThan(0);

    // Check each link returns 200
    const failed: string[] = [];
    for (const href of allLinks) {
      const response = await request.get(href);
      if (response.status() !== 200) {
        failed.push(`${href} → ${response.status()}`);
      }
    }

    expect(failed, `Broken links found: ${failed.join(", ")}`).toHaveLength(0);
  });

  test("crawl all internal links on every page", async ({ request }) => {
    const pages = [
      "/",
      "/about",
      "/services",
      "/services/healing-sessions",
      "/services/workshops",
      "/services/connect-radiate",
      "/services/healers-curriculum",
      "/book",
      "/shop",
      "/contact",
      "/terms",
    ];

    const allLinks = new Set<string>();

    // Use the request context to fetch pages and extract links
    for (const pagePath of pages) {
      const response = await request.get(pagePath);
      const html = await response.text();

      // Extract all internal href values
      const hrefRegex = /href="(\/[^"]*?)"/g;
      let match;
      while ((match = hrefRegex.exec(html)) !== null) {
        allLinks.add(match[1]);
      }
    }

    expect(allLinks.size).toBeGreaterThan(0);

    // Check each unique link returns 200
    const failed: string[] = [];
    for (const href of allLinks) {
      const response = await request.get(href);
      if (response.status() !== 200) {
        failed.push(`${href} → ${response.status()}`);
      }
    }

    expect(failed, `Broken links: ${failed.join(", ")}`).toHaveLength(0);
  });
});
