import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const databasePath = fileURLToPath(new URL("../../public/db.json", import.meta.url));
const metadata = JSON.parse(await readFile(databasePath, "utf8"));

const liveProducts = [
  {
    id: "test-yamaha-rayzr",
    slug: "yamaha-rayzr-125",
    name: { en: "Yamaha RayZR 125" },
    description: { en: "An economical scooter for Lisbon." },
    rentals: { basePrice: 2900, pricing: [] },
    images: ["https://images.twicecommerce.com/test-rayzr.jpg"],
    limitations: { visibleInListing: true },
  },
];

export const mockPublicServices = async (page, { productsFail = false } = {}) => {
  await page.route("**/.netlify/functions/get-fleet-metadata", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata),
    }),
  );
  await page.route("**/.netlify/functions/fetch-products", (route) =>
    route.fulfill({
      status: productsFail ? 502 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        productsFail ? { error: "Twice unavailable" } : { data: liveProducts },
      ),
    }),
  );
};

export const mockAdminServices = async (page) => {
  await mockPublicServices(page);
  await page.route("**/.netlify/functions/get-admin-session", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ user: { email: "admin@example.com" } }),
    }),
  );
  await page.route("**/.netlify/functions/get-fleet-metadata-history", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: [] }),
    }),
  );
};

export const fleetMetadata = metadata;
