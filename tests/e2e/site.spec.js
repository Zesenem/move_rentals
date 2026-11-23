import { expect, test } from "@playwright/test";
import { mockAdminServices, mockPublicServices } from "./fixtures.js";

test.beforeEach(async ({ page }) => {
  await mockPublicServices(page);
});

test("loads the fleet and filters vehicles", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Browse Our Fleet" }).click();

  await expect(page.getByRole("heading", { name: "Our Fleet" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Honda Vision 110/ })).toBeVisible();

  await page.getByRole("button", { name: "Open fleet filters" }).click();
  await page.getByRole("button", { name: "ECO", exact: true }).click();

  await expect(page.getByRole("link", { name: /Honda Vision 110/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "More Bikes On The Way" })).toHaveCount(0);
});

test("opens a vehicle detail route", async ({ page }) => {
  await page.goto("/motorcycle/honda-vision-110");

  await expect(page.getByRole("heading", { name: "Honda Vision 110", level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Our Fleet");
  await expect(page.getByRole("link", { name: "Contact on WhatsApp" })).toBeVisible();
});

test("shows single-image vehicle pages without broken carousel controls", async ({ page }) => {
  await page.goto("/motorcycle/yamaha-rayzr-125");

  const mainImage = page.getByRole("img", { name: /Yamaha RayZR 125 rental in Lisbon/ });
  await expect(mainImage).toHaveClass(/object-contain/);
  await expect(page.getByRole("button", { name: "Previous Image" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Next Image" })).toHaveCount(0);
});

test("opens the Lisbon rental guide", async ({ page }) => {
  await page.goto("/lisbon-rental-guide");

  await expect(
    page.getByRole("heading", { name: "Renting a scooter or motorcycle in Lisbon", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Home");
  await expect(page.getByRole("link", { name: "Browse the fleet" })).toBeVisible();
});

test("does not load analytics until consent is accepted", async ({ page }) => {
  const analyticsRequests = [];
  page.on("request", (request) => {
    if (request.url().includes("googletagmanager.com/gtm.js")) {
      analyticsRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("complementary", { name: "Cookie consent" })).toBeVisible();
  expect(analyticsRequests).toHaveLength(0);

  await page.getByRole("button", { name: "Reject optional" }).click();
  expect(analyticsRequests).toHaveLength(0);

  await page.getByRole("button", { name: "Manage cookie preferences" }).click();
  await page.getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(() => analyticsRequests.length).toBe(1);
});

test("keeps the live mileage counter gated", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Kilometres ridden with Move" })).toHaveCount(0);
});

test("uses the last successful fleet when Twice is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "move-rentals-fleet-cache",
      JSON.stringify({
        savedAt: Date.now(),
        commonData: { requirements: [], included: [] },
        products: [
          {
            id: "cached-vehicle",
            slug: "cached-vehicle",
            name: "Cached City Scooter",
            image_urls: [],
            badges: [],
            quick_glance: [],
            status: "available",
            price_per_day: 25,
          },
        ],
      }),
    );
  });
  await mockPublicServices(page, { productsFail: true });
  await page.goto("/");
  await page.getByRole("button", { name: "Browse Our Fleet" }).click();

  await expect(page.getByRole("status")).toContainText("most recent saved fleet details");
  await expect(page.getByRole("link", { name: /Cached City Scooter/ })).toBeVisible();
});

test("saves admin fleet metadata", async ({ page }) => {
  let savedPayload;
  await mockAdminServices(page);
  await page.route("**/.netlify/functions/save-fleet-metadata", async (route) => {
    savedPayload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: savedPayload }),
    });
  });

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Gestão da Frota" })).toBeVisible();
  await page.getByRole("button", { name: "Adicionar imagem HTTPS" }).click();
  await page.getByRole("textbox", { name: "Vehicle image URL 1" }).fill(
    "https://example.com/vehicle.jpg",
  );
  await page.getByRole("button", { name: "Guardar alterações" }).click();
  await expect.poll(() => savedPayload).not.toBeUndefined();
  expect(savedPayload.motorcycles_static_data).toBeInstanceOf(Array);
});

test("blocks an admin save when a newer revision exists", async ({ page }) => {
  await mockAdminServices(page);
  await page.route("**/.netlify/functions/save-fleet-metadata", (route) =>
    route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Another administrator saved newer changes. Reload the page before saving again.",
      }),
    }),
  );

  await page.goto("/admin");
  await page.getByRole("button", { name: "Guardar alterações" }).click();
  await expect(page.getByText(/Another administrator saved newer changes/)).toBeVisible();
});
