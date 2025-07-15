const API_BASE_URL = "https://api.twicecommerce.com/admin";
const API_SECRET_KEY = import.meta.env.VITE_TWICE_API_SECRET;
const API_ID = import.meta.env.VITE_TWICE_API_ID;

const MOTORCYCLE_CATEGORY_ID = "Enlv0F1KBYYbOb5HdzJH";
const EXTRAS_CATEGORY_ID = "GH1Hm7Cz2fsProT5dkRR";

const encodedCredentials = btoa(`${API_ID}:${API_SECRET_KEY}`);

const twiceHeaders = {
  "Content-Type": "application/json",
  Authorization: `Basic ${encodedCredentials}`,
  "x-rentle-version": "2023-02-01",
};

function mapApiProductToAppProduct(apiProduct) {
  return {
    id: apiProduct.id,
    slug: apiProduct.slug || apiProduct.id,
    name: apiProduct.name?.en || apiProduct.name?.def || "Unnamed Product",
    price_per_day: apiProduct.rentals?.basePrice / 100 || 0,
    pricingTiers: apiProduct.rentals?.pricing || [],
    image_urls: apiProduct.images || [],
    status: apiProduct.limitations?.visibleInListing ? "available" : "unavailable",
    description: apiProduct.description?.en || apiProduct.description?.def || "",
    security_deposit: apiProduct.rentals?.deposit / 100 || 0,
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
  try {
    if (
      !MOTORCYCLE_CATEGORY_ID ||
      MOTORCYCLE_CATEGORY_ID === "replace-with-your-motorcycle-category-id"
    ) {
      throw new Error("Motorcycle Category ID is not set in twice.js");
    }

    const [apiResponse, staticData] = await Promise.all([
      fetch(`${API_BASE_URL}/products?categories=${MOTORCYCLE_CATEGORY_ID}`, {
        headers: twiceHeaders,
      }),
      fetchStaticData(),
    ]);

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(errorData.error?.message || "Failed to fetch products.");
    }

    const paginatedResponse = await apiResponse.json();
    const liveProducts = paginatedResponse.data.map(mapApiProductToAppProduct);

    const staticMotorcycles = staticData.motorcycles_static_data;

    return liveProducts.map((liveProduct) => {
      const staticInfo = staticMotorcycles.find((p) => p.id === liveProduct.id);
      return {
        ...liveProduct,
        badges: staticInfo?.badges || [],
        quick_glance: staticInfo?.quick_glance || [],
      };
    });
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    throw error;
  }
};

export const fetchExtras = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?categories=${EXTRAS_CATEGORY_ID}`, {
      headers: twiceHeaders,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch extras.");
    }
    const paginatedResponse = await response.json();
    return paginatedResponse.data.map(mapApiProductToAppProduct);
  } catch (error) {
    console.error("Error in fetchExtras:", error);
    throw error;
  }
};

export const fetchProductBySlug = async (slug) => {
  if (!slug) throw new Error("A product slug must be provided.");
  try {
    const [productResponse, staticData] = await Promise.all([
      fetch(`${API_BASE_URL}/products/${slug}`, { headers: twiceHeaders }),
      fetchStaticData(),
    ]);

    if (!productResponse.ok) {
      throw new Error("Motorcycle not found by slug or ID");
    }
    const productData = await productResponse.json();
    const bike = mapApiProductToAppProduct(productData);

    const staticInfo = staticData.motorcycles_static_data.find((p) => p.id === bike.id);

    return {
      bike: {
        ...bike,
        badges: staticInfo?.badges || [],
        quick_glance: staticInfo?.quick_glance || [],
      },
      commonData: staticData.common_data,
    };
  } catch (error) {
    console.error(`Error in fetchProductBySlug for slug: ${slug}`, error);
    throw error;
  }
};

export const getUnavailableDates = async (bikeId) => {
  if (!bikeId) return [];
  try {
    let allOrders = [];
    let nextPageToken = null;
    do {
      const url = new URL(`${API_BASE_URL}/orders`);
      if (nextPageToken) url.searchParams.append("pageToken", nextPageToken);
      const response = await fetch(url.toString(), { headers: twiceHeaders });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch orders.");
      }
      const paginatedResponse = await response.json();
      allOrders = allOrders.concat(paginatedResponse.data);
      nextPageToken = paginatedResponse.nextPageToken;
    } while (nextPageToken);

    const bookingsForBike = allOrders.filter((order) => {
      const isNotCancelled = order.state !== "cancelled";
      const hasMatchingProduct = order.items.some((item) => item.productId === bikeId);
      return isNotCancelled && hasMatchingProduct;
    });

    const disabledDates = [];
    bookingsForBike.forEach((booking) => {
      let currentDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      while (currentDate <= endDate) {
        disabledDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return disabledDates;
  } catch (error) {
    console.error(`Error in getUnavailableDates for bikeId: ${bikeId}`, error);
    throw error;
  }
};

export const createOrder = async ({ cartItems, customerDetails }) => {
  const storesResponse = await fetch(`${API_BASE_URL}/stores`, { headers: twiceHeaders });
  if (!storesResponse.ok) throw new Error("Could not fetch store details.");
  const storesData = await storesResponse.json();
  const storeId = storesData.data?.[0]?.id;
  if (!storeId) throw new Error("Default store ID not found.");

  const orderPayload = {
    storeId: storeId,
    customer: {
      ...customerDetails,
      marketingConsent: true,
    },
    items: cartItems.flatMap((item) => {
      const mainItem = { productId: item.id.split("-")[0], quantity: 1 };
      const extraItems = Object.values(item.extras).map((extra) => ({
        productId: extra.id,
        quantity: extra.quantity,
      }));
      return [mainItem, ...extraItems];
    }),
    startDate: cartItems[0].range.from.toISOString(),
    duration: {
      period: "days",
      value: cartItems[0].days,
    },
    paid: false,
  };

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: twiceHeaders,
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error creating order:", errorData);
    throw new Error(errorData.error?.message || "Failed to create order.");
  }

  return await response.json();
};
