const normalizeString = (value = "") => value.trim().toLowerCase();

const slugify = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getStaticVehicleKey = (vehicle = {}) =>
  vehicle.id || vehicle.slug || `name:${normalizeString(vehicle.name)}`;

const matchesStaticVehicle = (staticVehicle, liveProduct) => {
  if (staticVehicle.id && staticVehicle.id === liveProduct.id) {
    return true;
  }

  if (staticVehicle.slug && staticVehicle.slug === liveProduct.slug) {
    return true;
  }

  const directNameMatch =
    Boolean(staticVehicle.name) &&
    (normalizeString(staticVehicle.name) === normalizeString(liveProduct.name) ||
      slugify(staticVehicle.name) === slugify(liveProduct.name));

  if (directNameMatch) {
    return true;
  }

  return staticVehicle.match_names?.some(
    (name) =>
      normalizeString(name) === normalizeString(liveProduct.name) ||
      slugify(name) === slugify(liveProduct.name)
  );
};

const mergeVehicleData = (baseProduct, staticVehicle = {}) => ({
  ...baseProduct,
  slug: staticVehicle.slug || baseProduct.slug,
  name: staticVehicle.name || baseProduct.name,
  price_per_day: staticVehicle.price_per_day ?? baseProduct.price_per_day,
  pricingTiers: staticVehicle.pricingTiers ?? baseProduct.pricingTiers ?? [],
  image_urls: staticVehicle.image_urls ?? baseProduct.image_urls ?? [],
  status: staticVehicle.status || baseProduct.status || "available",
  availability_label: staticVehicle.availability_label || baseProduct.availability_label,
  description: staticVehicle.description || baseProduct.description || "",
  badges: staticVehicle.badges ?? baseProduct.badges ?? [],
  quick_glance: staticVehicle.quick_glance ?? baseProduct.quick_glance ?? [],
  security_deposit: staticVehicle.security_deposit ?? baseProduct.security_deposit ?? null,
  technical_features:
    staticVehicle.technical_features ?? baseProduct.technical_features ?? [],
  included: staticVehicle.included ?? baseProduct.included,
  requirements: staticVehicle.requirements ?? baseProduct.requirements,
  important_notes: staticVehicle.important_notes ?? baseProduct.important_notes ?? [],
});

const createStaticOnlyVehicle = (staticVehicle) =>
  mergeVehicleData(
    {
      id: staticVehicle.id || `static-${staticVehicle.slug || slugify(staticVehicle.name)}`,
      slug: staticVehicle.slug || slugify(staticVehicle.name),
      name: staticVehicle.name || "Unnamed Product",
      price_per_day: staticVehicle.price_per_day ?? null,
      pricingTiers: [],
      image_urls: staticVehicle.image_urls || [],
      status: staticVehicle.status || "available",
      description: staticVehicle.description || "",
    },
    staticVehicle
  );

function mapApiProductToAppProduct(apiProduct) {
  return {
    id: apiProduct.id,
    slug: apiProduct.slug || apiProduct.id,
    name: apiProduct.name?.en || apiProduct.name?.def || "Unnamed Product",
    price_per_day: apiProduct.rentals?.basePrice ? apiProduct.rentals.basePrice / 100 : null,
    pricingTiers: apiProduct.rentals?.pricing || [],
    image_urls: apiProduct.images || [],
    status: apiProduct.limitations?.visibleInListing ? "available" : "unavailable",
    description: apiProduct.description?.en || apiProduct.description?.def || "",
  };
}

const fetchStaticData = async () => {
  try {
    const response = await fetch("/db.json");
    if (!response.ok) throw new Error("Could not fetch the static data file.");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch db.json:", error);
    throw error;
  }
};

export const fetchProducts = async () => {
  const staticData = await fetchStaticData();
  const staticVehicles = staticData.motorcycles_static_data || [];

  let liveProducts = [];
  let liveProductsError = null;

  try {
    const apiResponse = await fetch(`/.netlify/functions/fetch-products`);

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(errorData.error?.message || "Failed to fetch products.");
    }

    const paginatedResponse = await apiResponse.json();
    liveProducts = paginatedResponse.data.map(mapApiProductToAppProduct);
  } catch (error) {
    liveProductsError = error;
    console.error("Error fetching live products:", error);
  }

  const matchedStaticKeys = new Set();
  const mergedLiveProducts = liveProducts.map((liveProduct) => {
    const staticVehicle = staticVehicles.find((vehicle) =>
      matchesStaticVehicle(vehicle, liveProduct)
    );

    if (staticVehicle) {
      matchedStaticKeys.add(getStaticVehicleKey(staticVehicle));
    }

    return mergeVehicleData(liveProduct, staticVehicle);
  });

  const staticOnlyVehicles = staticVehicles
    .filter((vehicle) => vehicle.source === "static")
    .filter((vehicle) => !matchedStaticKeys.has(getStaticVehicleKey(vehicle)))
    .map(createStaticOnlyVehicle);

  const allVehicles = [...mergedLiveProducts, ...staticOnlyVehicles];

  if (!allVehicles.length && liveProductsError) {
    throw liveProductsError;
  }

  return allVehicles;
};

export const fetchProductBySlug = async (slug) => {
  try {
    const allProducts = await fetchProducts();
    const bike = allProducts.find((p) => p.slug === slug);
    if (!bike) {
      throw new Error("Vehicle not found by slug");
    }
    const staticData = await fetchStaticData();
    return {
      bike: bike,
      commonData: staticData.common_data,
    };
  } catch (error) {
    console.error("Error in fetchProductBySlug:", error);
    throw error;
  }
};
