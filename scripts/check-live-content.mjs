const SITE_URL = process.env.SITE_URL || "https://move-rentals.com";
const REQUEST_TIMEOUT = 10_000;

const fetchJson = async (path) => {
  const response = await fetch(`${SITE_URL}${path}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}.`);
  }
  return response.json();
};

const isValidImageUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const checkImage = async (url) => {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });
    if (response.ok || response.status === 405) {
      return null;
    }
    return `${response.status} ${url}`;
  } catch (error) {
    return `${error.name}: ${url}`;
  }
};

const [metadata, productsPayload] = await Promise.all([
  fetchJson("/.netlify/functions/get-fleet-metadata"),
  fetchJson("/.netlify/functions/fetch-products"),
]);
const staticVehicles = metadata.motorcycles_static_data || [];
const liveVehicles = productsPayload.data || [];
const publishedSlugs = new Set();
const imageUrls = new Set();
const errors = [];

for (const vehicle of staticVehicles) {
  const slug = vehicle.slug;
  if (slug && !/^[a-zA-Z0-9-]+$/.test(slug)) {
    errors.push(`Invalid metadata slug: ${slug}`);
  }
  if (slug) {
    if (publishedSlugs.has(slug)) errors.push(`Duplicate metadata slug: ${slug}`);
    publishedSlugs.add(slug);
  }
  for (const image of vehicle.image_urls || []) {
    if (!isValidImageUrl(image)) errors.push(`Invalid image URL on ${vehicle.name}: ${image}`);
    else imageUrls.add(image);
  }
}

for (const product of liveVehicles) {
  const liveSlug = product.slug || product.id;
  const liveName = product.name?.en || product.name?.def || "";
  const metadataVehicle = staticVehicles.find(
    (vehicle) =>
      (vehicle.id && vehicle.id === product.id) ||
      (vehicle.slug && vehicle.slug === liveSlug) ||
      (vehicle.name && vehicle.name.toLowerCase() === liveName.toLowerCase()),
  );
  const slug = metadataVehicle?.slug || liveSlug;
  if (!slug || !/^[a-zA-Z0-9-]+$/.test(slug)) {
    errors.push(`Invalid live product slug: ${slug || "(empty)"}`);
  }
  if (slug && !metadataVehicle) {
    if (publishedSlugs.has(slug)) errors.push(`Duplicate published slug: ${slug}`);
    publishedSlugs.add(slug);
  }
  for (const image of product.images || []) {
    if (!isValidImageUrl(image)) errors.push(`Invalid image URL on ${product.name?.en}: ${image}`);
    else imageUrls.add(image);
  }
}

const imageErrors = (await Promise.all([...imageUrls].map(checkImage))).filter(Boolean);
errors.push(...imageErrors);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Checked ${staticVehicles.length} metadata entries, ${liveVehicles.length} live products, and ${imageUrls.size} images.`,
  );
}
