import { readFleetMetadata } from "./utils/fleet-metadata-store.mjs";

const SITE_URL = "https://move-rentals.com";
const STATIC_PATHS = ["/", "/contact", "/terms-and-conditions", "/privacy-policy"];

const slugify = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalise = (value = "") => value.trim().toLowerCase();

const matchesMetadata = (metadataVehicle, liveVehicle) => {
  if (metadataVehicle.id && metadataVehicle.id === liveVehicle.id) return true;
  if (metadataVehicle.slug && metadataVehicle.slug === liveVehicle.slug) return true;

  const metadataName = normalise(metadataVehicle.name);
  const liveName = normalise(liveVehicle.name);

  return (
    (metadataName && (metadataName === liveName || slugify(metadataName) === slugify(liveName))) ||
    metadataVehicle.match_names?.some((name) => {
      const matchName = normalise(name);
      return matchName === liveName || slugify(matchName) === slugify(liveName);
    })
  );
};

const isPublicVehicle = (vehicle) =>
  vehicle.slug && vehicle.status !== "unavailable" && vehicle.status !== "coming-soon";

const fetchLiveVehicles = async () => {
  const apiId = process.env.TWICE_API_ID;
  const apiSecret = process.env.TWICE_API_SECRET;

  // A sitemap with the static pages is still useful if credentials are unavailable.
  if (!apiId || !apiSecret) return [];

  const credentials = Buffer.from(`${apiId}:${apiSecret}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${credentials}`,
    "x-rentle-version": "2023-02-01",
  };
  const categoryId = "Enlv0F1KBYYbOb5HdzJH";
  const vehicles = [];
  let pageToken;
  let pageCount = 0;

  do {
    const url = new URL("https://api.twicecommerce.com/admin/products");
    url.searchParams.set("categories", categoryId);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`Twice API returned ${response.status}.`);

    const page = await response.json();
    vehicles.push(
      ...(page.data || []).map((product) => ({
        id: product.id,
        slug: product.slug || product.id,
        name: product.name?.en || product.name?.def || "",
        status: product.limitations?.visibleInListing === false ? "unavailable" : "available",
      })),
    );
    pageToken = page.nextPageToken || null;
    pageCount += 1;
  } while (pageToken && pageCount < 20);

  return vehicles;
};

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const handler = async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let metadata = {};
  try {
    metadata = (await readFleetMetadata(event)) || {};
  } catch (error) {
    console.error("Could not read fleet metadata for sitemap:", error);
  }

  const staticVehicles = metadata.motorcycles_static_data || [];
  let liveVehicles = [];
  try {
    liveVehicles = await fetchLiveVehicles();
  } catch (error) {
    console.error("Could not read live products for sitemap:", error);
  }

  const matchedStaticVehicles = new Set();
  const vehiclePaths = liveVehicles.flatMap((liveVehicle) => {
    const metadataVehicle = staticVehicles.find((vehicle) => matchesMetadata(vehicle, liveVehicle));
    if (metadataVehicle) matchedStaticVehicles.add(metadataVehicle);

    const vehicle = {
      ...liveVehicle,
      slug: metadataVehicle?.slug || liveVehicle.slug,
      status: metadataVehicle?.status || liveVehicle.status,
    };
    return isPublicVehicle(vehicle) ? [`/motorcycle/${encodeURIComponent(vehicle.slug)}`] : [];
  });

  // These are intentional listings that exist only in the fleet metadata, not Twice.
  for (const vehicle of staticVehicles) {
    if (vehicle.source === "static" && !matchedStaticVehicles.has(vehicle)) {
      const slug = vehicle.slug || slugify(vehicle.name);
      if (isPublicVehicle({ ...vehicle, slug })) {
        vehiclePaths.push(`/motorcycle/${encodeURIComponent(slug)}`);
      }
    }
  }

  const paths = [...new Set([...STATIC_PATHS, ...vehiclePaths])];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths.map((path) => `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc></url>`).join("\n") +
    `\n</urlset>\n`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
    body: event.httpMethod === "HEAD" ? "" : body,
  };
};
