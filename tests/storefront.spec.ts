import { test, expect } from "@playwright/test";

test.describe("Premium Rice Shop Storefront - Phase 5 E2E Audit", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local Next.js production server
    await page.goto("http://localhost:3001");
  });

  test("should load the page with correct RTL parameters and title", async ({ page }) => {
    // Assert correct lang and dir configuration
    const htmlDir = await page.locator("html").getAttribute("dir");
    const htmlLang = await page.locator("html").getAttribute("lang");
    expect(htmlDir).toBe("rtl");
    expect(htmlLang).toBe("fa");

    // Assert luxury page title
    await expect(page).toHaveTitle(/فروشگاه برنج لوکس ایرانی/);
  });

  test("should render the floating Navbar layout and brand logo", async ({ page }) => {
    // Assert branding title exists
    const logoTitle = page.locator("text=طلای شالیزار").first();
    await expect(logoTitle).toBeVisible();

    // Assert desktop navigation link lists are visible
    const desktopHomeLink = page.locator("text=صفحه اصلی").first();
    await expect(desktopHomeLink).toBeVisible();
  });

  test("should drive the interactive State Visualizer through all states", async ({ page }) => {
    const visualizerSection = page.locator("#demo-states");
    await expect(visualizerSection).toBeVisible();

    // Click on the Loading State simulator button
    await page.get_by_role("button", name="شبیه‌سازی حالت Loading").click();
    const loadingCaption = page.locator("text=در حال بارگذاری شالیزار هنر");
    await expect(loadingCaption).toBeVisible();

    // Click on the Empty State simulator button
    await page.get_by_role("button", name="شبیه‌سازی حالت Empty").click();
    const emptyTitle = page.locator("text=هیچ رقمی یافت نشد");
    await expect(emptyTitle).toBeVisible();

    // Click on the Error State simulator button
    await page.get_by_role("button", name="شبیه‌سازی حالت Error").click();
    const errorTitle = page.locator("text=عدم پاسخ‌دهی سرور کشت مرکزی");
    await expect(errorTitle).toBeVisible();

    // Restore to normal view
    await page.get_by_role("button", name="نمایش محتوای محصولات ممتاز").click();
    const firstProduct = page.locator("text=برنج هاشمی فوق ممتاز گیلان").first();
    await expect(firstProduct).toBeVisible();
  });
});
