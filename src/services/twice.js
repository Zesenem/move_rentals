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

export const processRevolutPaymentAndOrder = async (payload) => {
  const response = await fetch(`/.netlify/functions/process-revolut-payment-and-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error processing Revolut payment and order:", errorData);
    throw new Error(errorData.error?.message || "Failed to complete booking and payment.");
  }
  return await response.json();
};
