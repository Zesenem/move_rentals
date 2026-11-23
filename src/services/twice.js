import { fetchFleetMetadata } from "./fleetMetadata.js";
import {
  getVehicleMetadataKey,
  matchesVehicleMetadata,
  slugify,
} from "./fleetMatching.js";
import { getEffectiveRentalTerms, removeLegacyJetSkiRentalNotes } from "../utils/rentalTerms.js";

const mergeVehicleData = (baseProduct, staticVehicle = {}) => {
  const name = staticVehicle.name || baseProduct.name;
  const vehicle = { ...baseProduct, ...staticVehicle, name };
  const importantNotes = staticVehicle.important_notes ?? baseProduct.important_notes ?? [];

  return {
    ...baseProduct,
    slug: staticVehicle.slug || baseProduct.slug,
    name,
    price_per_day: staticVehicle.price_per_day ?? baseProduct.price_per_day,
    vehicle_type: staticVehicle.vehicle_type ?? baseProduct.vehicle_type ?? "",
    licence_categories: staticVehicle.licence_categories ?? baseProduct.licence_categories ?? [],
    displacement_cc: staticVehicle.displacement_cc ?? baseProduct.displacement_cc ?? null,
    luggage_capacity_l: staticVehicle.luggage_capacity_l ?? baseProduct.luggage_capacity_l ?? null,
    rental_terms: getEffectiveRentalTerms(vehicle),
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
    important_notes: removeLegacyJetSkiRentalNotes(vehicle, importantNotes),
  };
};

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
    // Products are public unless Twice explicitly hides them. This matches the sitemap
    // behaviour and prevents an older/missing limitations field from disabling a valid listing.
    status: apiProduct.limitations?.visibleInListing === false ? "unavailable" : "available",
    description: apiProduct.description?.en || apiProduct.description?.def || "",
  };
}

const fetchFleetData = async () => {
  const metadataPromise = fetchFleetMetadata();
  const liveProductsPromise = fetch("/.netlify/functions/fetch-products")
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Failed to fetch products.");
      }

      const paginatedResponse = await response.json();
      return paginatedResponse.data.map(mapApiProductToAppProduct);
    })
    .catch((error) => {
      console.error("Error fetching live products:", error);
      return { products: [], error };
    });
  const [staticData, liveProductsResult] = await Promise.all([
    metadataPromise,
    liveProductsPromise,
  ]);
  const staticVehicles = staticData.motorcycles_static_data || [];
  let liveProducts = [];
  let liveProductsError = null;

  if (Array.isArray(liveProductsResult)) {
    liveProducts = liveProductsResult;
  } else {
    liveProductsError = liveProductsResult.error;
  }

  const matchedStaticKeys = new Set();
  const mergedLiveProducts = liveProducts.map((liveProduct) => {
    const staticVehicle = staticVehicles.find((vehicle) =>
      matchesVehicleMetadata(vehicle, liveProduct)
    );

    if (staticVehicle) {
      matchedStaticKeys.add(getVehicleMetadataKey(staticVehicle));
    }

    return mergeVehicleData(liveProduct, staticVehicle);
  });

  const staticOnlyVehicles = staticVehicles
    .filter((vehicle) => vehicle.source === "static")
    .filter((vehicle) => !matchedStaticKeys.has(getVehicleMetadataKey(vehicle)))
    .map(createStaticOnlyVehicle);

  const allVehicles = [...mergedLiveProducts, ...staticOnlyVehicles];

  if (!allVehicles.length && liveProductsError) {
    throw liveProductsError;
  }

  return {
    products: allVehicles,
    commonData: staticData.common_data || { requirements: [], included: [] },
  };
};

export const fetchProducts = async () => {
  const { products } = await fetchFleetData();
  return products;
};

export const fetchProductBySlug = async (slug) => {
  try {
    const { products, commonData } = await fetchFleetData();
    const bike = products.find((product) => product.slug === slug);
    if (!bike) {
      throw new Error("Vehicle not found by slug");
    }
    return {
      bike,
      commonData,
    };
  } catch (error) {
    console.error("Error in fetchProductBySlug:", error);
    throw error;
  }
};
