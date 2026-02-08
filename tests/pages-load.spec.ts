import { test, expect } from "@playwright/test";

/**
 * Verify every route loads with 200 status, correct <title>, and no console errors.
 */

const pages = [
  { path: "/", titleIncludes: "Healed by Spirit" },
  { path: "/about", titleIncludes: "About" },
  { path: "/services", titleIncludes: "Services" },
  { path: "/services/healing-sessions", titleIncludes: "Healing Sessions" },
  { path: "/services/workshops", titleIncludes: "Workshop" },
  { path: "/services/connect-radiate", titleIncludes: "Connect" },
  { path: "/services/healers-curriculum", titleIncludes: "Curriculum" },
  { path: "/book", titleIncludes: "Book" },
  { path: "/shop", titleIncludes: "Shop" },
  { path: "/contact", titleIncludes: "Contact" },
  { path: "/terms", titleIncludes: "Terms" },
];

for (const { path, titleIncludes } of pages) {
  test(`${path} loads successfully`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const title = await page.title();
    expect(title.toLowerCase()).toContain(titleIncludes.toLowerCase());

    // Filter out known non-critical errors (e.g. third-party scripts)
    const criticalErrors = consoleErrors.filter(
      (e) => !e.includes("third-party") && !e.includes("favicon")
    );
    expect(criticalErrors).toHaveLength(0);
  });
}

test("404 page renders for unknown route", async ({ page }) => {
  const response = await page.goto("/nonexistent-page-xyz");
  expect(response?.status()).toBe(404);
});
