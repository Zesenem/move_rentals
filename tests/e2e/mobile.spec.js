import { expect, test } from "@playwright/test";
import { mockPublicServices } from "./fixtures.js";

test("mobile fleet filters open as a compact sheet and return results", async ({ page }) => {
  await mockPublicServices(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Reject optional" }).click();
  await page.getByRole("button", { name: "Browse Our Fleet" }).click();
  await expect(page.getByRole("heading", { name: "Our Fleet" })).toBeVisible();

  await page.getByRole("button", { name: "Find your ride" }).click();
  const dialog = page.getByRole("dialog", { name: "Fleet filters" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "ECO", exact: true }).click();
  await dialog.getByRole("button", { name: /Show 2 vehicles/ }).click();

  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Honda Vision 110/ })).toBeVisible();
});
