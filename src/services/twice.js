// src/services/twice.js

/**
 * Maps a product object from the backend API to the application's product format.
 * @param {object} apiProduct - The product object from the API.
 * @returns {object} The product object in the application's format.
 */
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

/**
 * Fetches static data from the local db.json file.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON data.
 */
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

/**
 * Fetches all products, combining live API data with local static data.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of products.
 */
export const fetchProducts = async () => {
  try {
    const [apiResponse, staticData] = await Promise.all([
      fetch(`/.netlify/functions/fetch-products`),
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

/**
 * Fetches extra products/services from the backend.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of extras.
 */
export const fetchExtras = async () => {
  try {
    const response = await fetch(`/.netlify/functions/fetch-extras`);
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

/**
 * Fetches a single product by its slug.
 * @param {string} slug - The slug of the product to fetch.
 * @returns {Promise<object>} A promise resolving to the bike and common static data.
 */
export const fetchProductBySlug = async (slug) => {
  try {
    const allProducts = await fetchProducts();
    const bike = allProducts.find((p) => p.slug === slug);
    if (!bike) {
      throw new Error("Motorcycle not found by slug");
    }
    const staticData = await fetchStaticData();
    return {
      bike: bike,
      commonData: staticData.common_data,
    };
  } catch (error) {
    console.error(`Error in fetchProductBySlug for slug: ${slug}`, error);
    throw error;
  }
};

/**
 * Fetches unavailable dates for a specific bike.
 * @param {string} bikeId - The ID of the bike.
 * @returns {Promise<Array<Date>>} A promise resolving to an array of disabled dates.
 */
export const getUnavailableDates = async (bikeId) => {
  if (!bikeId) return [];
  try {
    const response = await fetch(`/.netlify/functions/get-unavailable-dates?bikeId=${bikeId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch bookings.");
    }
    const bookingsForBike = await response.json();
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

/**
 * Creates an order in your system before payment.
 * @param {object} payload - The order details.
 * @param {Array} payload.cartItems - The items in the cart.
 * @param {object} payload.customerDetails - The customer's information.
 * @returns {Promise<object>} The created order data.
 */
export const createOrder = async ({ cartItems, customerDetails }) => {
  const response = await fetch(`/.netlify/functions/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartItems, customerDetails }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error creating order:", errorData);
    throw new Error(errorData.error?.message || "Failed to create order.");
  }
  return await response.json();
};

/**
 * Creates a Revolut order to get a payment token.
 * @param {object} payload - The payment details.
 * @param {number} payload.amount - The amount to charge.
 * @param {string} payload.currency - The currency code (e.g., 'EUR').
 * @returns {Promise<object>} The Revolut order data containing the orderToken.
 */
export const createRevolutOrderToken = async ({ amount, currency }) => {
  const response = await fetch(`/.netlify/functions/create-revolut-order-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error creating Revolut order token:", errorData);
    throw new Error(errorData.error?.message || "Failed to create Revolut order token.");
  }
  return await response.json();
};

/**
 * Processes the final payment and order after Revolut confirmation.
 * @param {object} payload - The payload containing payment and order details.
 * @returns {Promise<object>} The final confirmation data.
 */
export const processRevolutPaymentAndOrder = async (payload) => {
  const response = await fetch(`/.netlify/functions/process-revolut-payment-and-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error processing Revolut payment and order:", errorData);
    throw new Error(errorData.error?.message || 'Failed to complete booking and payment.');
  }
  return await response.json();
};