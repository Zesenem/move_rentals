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
        security_deposit: staticInfo?.security_deposit || 0, 
        forfait: staticInfo?.forfait,
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
    console.error("Error in fetchProductBySlug:", error);
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
    console.error("Error in getUnavailableDates:", error);
    throw error;
  }
};

export const initiateCheckout = async ({ cartItems, customerDetails }) => {
  try {
    const response = await fetch(`/.netlify/functions/initiate-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems, customerDetails }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Could not start the checkout process.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error initiating checkout:", error);
    throw error;
  }
};
