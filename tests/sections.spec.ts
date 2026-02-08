import { test, expect } from "@playwright/test";

/**
 * Test that all major sections are present and visible on each page.
 * Note: Framer Motion animations start elements at opacity:0.
 * We use scrollIntoViewIfNeeded() to trigger viewport-based animations.
 */

test.describe("Homepage sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("hero section has heading, subtext, and CTA buttons", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Healed by Spirit");
    await expect(page.locator('a:has-text("Explore Services")')).toBeVisible();
    await expect(page.locator('a:has-text("Meet Brian")')).toBeVisible();
  });

  test("hero has background image", async ({ page }) => {
    const heroImg = page.locator("section").first().locator("img").first();
    await expect(heroImg).toBeAttached();
  });

  test("services section shows service cards", async ({ page }) => {
    const heading = page.getByText("Our Services");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
    const serviceCards = page.locator('a[href^="/services/"]');
    expect(await serviceCards.count()).toBeGreaterThanOrEqual(3);
  });

  test("about Brian section is present", async ({ page }) => {
    const heading = page.getByText("About Brian", { exact: false }).first();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test("locations section shows locations", async ({ page }) => {
    const heading = page.getByText("Locations");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Albuquerque").first()).toBeVisible();
  });

  test("book promo section is present", async ({ page }) => {
    const heading = page.getByText("Access The Real You").first();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test("testimonials section shows quotes", async ({ page }) => {
    const heading = page.getByText("Testimonials");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test("bottom CTA section is present", async ({ page }) => {
    const heading = page.getByText("Have a Question?");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });
});

test.describe("About page sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about", { waitUntil: "domcontentloaded" });
  });

  test("hero with heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("About Us");
  });

  test("video section is present", async ({ page }) => {
    const videoContainer = page.locator("iframe, video, .aspect-video");
    expect(await videoContainer.count()).toBeGreaterThanOrEqual(1);
  });

  test("stats section with numbers", async ({ page }) => {
    const stat = page.getByText("98").first();
    await stat.scrollIntoViewIfNeeded();
    await expect(stat).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("40").first()).toBeVisible();
    await expect(page.getByText("60").first()).toBeVisible();
  });

  test("testimonials section", async ({ page }) => {
    const heading = page.getByText("What My Clients Say");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test("CTA links to services", async ({ page }) => {
    const link = page.locator('a:has-text("View All Services")').first();
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Services page sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/services", { waitUntil: "domcontentloaded" });
  });

  test("hero heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Services");
  });

  test("shows all 4 service categories", async ({ page }) => {
    // Scroll through the page to trigger animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 0));

    await expect(page.getByRole("heading", { name: /Healing Sessions/ }).first()).toBeAttached();
    await expect(page.getByRole("heading", { name: /Soul Connection/ }).first()).toBeAttached();
    await expect(page.getByRole("heading", { name: /Connect & Radiate/ }).first()).toBeAttached();
    await expect(page.getByRole("heading", { name: /Curriculum/ }).first()).toBeAttached();
  });

  test("each category has a detail link", async ({ page }) => {
    const detailLinks = page.locator('a[href^="/services/"]');
    expect(await detailLinks.count()).toBeGreaterThanOrEqual(4);
  });

  test("CTA section is present", async ({ page }) => {
    const heading = page.getByText("Ready to Begin Your Journey");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Service detail pages", () => {
  const slugs = [
    "healing-sessions",
    "workshops",
    "connect-radiate",
    "healers-curriculum",
  ];

  for (const slug of slugs) {
    test(`/services/${slug} loads with services listed`, async ({ page }) => {
      await page.goto(`/services/${slug}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toBeVisible();

      const serviceItems = page.locator("h2");
      expect(await serviceItems.count()).toBeGreaterThanOrEqual(1);

      await expect(page.locator('a:has-text("All Services")')).toBeVisible();
    });
  }
});

test.describe("Book page sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/book", { waitUntil: "domcontentloaded" });
  });

  test("book cover image is present", async ({ page }) => {
    const bookImg = page.locator('img[alt*="Access the Real You"]');
    await expect(bookImg).toBeVisible();
  });

  test("title and subtitle", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Access The Real You");
    await expect(page.getByText("Touching Your Divinity")).toBeVisible();
  });

  test("purchase options are visible", async ({ page }) => {
    const printBook = page.getByText("Print Book");
    await printBook.scrollIntoViewIfNeeded();
    await expect(printBook).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Audiobook", { exact: true })).toBeVisible();
  });

  test("about the book section", async ({ page }) => {
    const heading = page.getByText("About the Book");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test("reader testimonial", async ({ page }) => {
    const heading = page.getByText("What Readers Say");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test("CTA section", async ({ page }) => {
    const heading = page.getByText("Ready to Access The Real You");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Shop page sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shop", { waitUntil: "domcontentloaded" });
  });

  test("hero heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Shop");
  });

  test("product cards are displayed", async ({ page }) => {
    // Scroll to trigger animations on product grid
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);

    const productImages = page.locator("section img");
    expect(await productImages.count()).toBeGreaterThanOrEqual(1);

    const buyButtons = page.locator('button:has-text("Buy Now")');
    expect(await buyButtons.count()).toBeGreaterThanOrEqual(1);
  });

  test("coming soon notice is visible", async ({ page }) => {
    const notice = page.getByText("Online checkout is being set up");
    await notice.scrollIntoViewIfNeeded();
    await expect(notice).toBeVisible({ timeout: 5000 });
  });

  test("contact info in coming soon notice", async ({ page }) => {
    const phoneLink = page.locator('section a[href="tel:505-541-0265"]');
    expect(await phoneLink.count()).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Contact page sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
  });

  test("hero heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Contact");
  });

  test("contact form has all fields", async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("Brian's headshot image is present", async ({ page }) => {
    const headshot = page.locator('img[alt="Brian Kurtz"]');
    await expect(headshot).toBeVisible();
  });

  test("contact info section", async ({ page }) => {
    const heading = page.getByText("Get in Touch");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("505-541-0265").first()).toBeVisible();
    await expect(page.getByText("healer@healedbyspirit.com").first()).toBeVisible();
    await expect(page.getByText("Albuquerque").first()).toBeVisible();
  });
});

test.describe("Terms page sections", () => {
  test("has all legal sections", async ({ page }) => {
    await page.goto("/terms", { waitUntil: "domcontentloaded" });

    await expect(page.locator("h1")).toContainText("Terms");
    await expect(page.getByRole("heading", { name: "Disclaimer" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Refund Policy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Privacy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Intellectual Property" })).toBeVisible();
  });

  test("has contact links in refund section", async ({ page }) => {
    await page.goto("/terms");
    const emailLink = page.locator('a[href="mailto:healer@healedbyspirit.com"]');
    expect(await emailLink.count()).toBeGreaterThanOrEqual(1);
  });
});
