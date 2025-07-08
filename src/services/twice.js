// src/services/twice.js

// NOTE: This remains a placeholder until we get real API credentials from Twice Commerce.
const TWICE_API_BASE_URL = 'https://api.twice.io/v2';

/**
 * Maps a product object from a hypothetical Twice Commerce API response
 * to the structure our React components expect.
 * @param {object} apiProduct - The product object from the Twice API.
 * @returns {object} The product object in our app's format.
 */
// eslint-disable-next-line no-unused-vars
const mapApiProductToAppProduct = (apiProduct) => {
  // This function is ready for when we connect to the real API.
  // We'll map fields like apiProduct.pricing.price_per_day.amount to our format.
  return {
    id: apiProduct.id,
    slug: apiProduct.slug,
    name: apiProduct.name,
    price_per_day: (apiProduct.pricing.price_per_day.amount / 100),
    image_urls: apiProduct.images.map(img => img.url),
    status: apiProduct.availability_status,
    description: apiProduct.description_html.replace(/<p>|<\/p>/g, ''),
    technical_features: apiProduct.custom_fields.technical_features
      ? JSON.parse(apiProduct.custom_fields.technical_features)
      : [],
    security_deposit: parseInt(apiProduct.custom_fields.security_deposit, 10),
  };
};

/**
 * Fetches the list of all available rental products.
 * Currently simulates by fetching from db.json.
 */
export const fetchProducts = async () => {
  try {
    const response = await fetch('/db.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // In a real scenario, we would map the response:
    // return data.products.map(mapApiProductToAppProduct);
    return data.motorcycles;
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    throw error;
  }
};

/**
 * Fetches a single product by its slug, along with common rental data.
 * @param {string} slug - The slug of the motorcycle to fetch.
 */
export const fetchProductBySlug = async (slug) => {
  if (!slug) {
    throw new Error("A product slug must be provided.");
  }
  try {
    const response = await fetch('/db.json');
    if (!response.ok) {
      throw new Error('Could not fetch the data file.');
    }
    const data = await response.json();
    const currentBike = data.motorcycles.find((m) => m.slug === slug);

    if (!currentBike) {
      throw new Error("Motorcycle not found");
    }
    return {
      bike: currentBike,
      commonData: data.common_data,
    };
  } catch (error) {
    console.error(`Error in fetchProductBySlug for slug: ${slug}`, error);
    throw error;
  }
};

/**
 * Checks the availability of a product for a given date range.
 * NOTE: This is a simulation. A real API call to Twice would be made here.
 * @param {object} bookingDetails
 * @param {string} bookingDetails.productId - The ID of the product to check.
 * @param {Date} bookingDetails.startDate - The desired start date.
 *-
 * @param {Date} bookingDetails.endDate - The desired end date.
 */
export const checkAvailability = async ({ productId, startDate, endDate }) => {
  console.log('Checking availability for:', { productId, startDate, endDate });

  // --- SIMULATION LOGIC ---
  // In a real scenario, we would make a POST request to a Twice endpoint.
  // For now, we'll just simulate a successful response after a short delay.
  await new Promise(resolve => setTimeout(resolve, 750));

  const isAvailable = true; // We'll pretend the item is always available for now.

  if (isAvailable) {
    return {
      status: 'available',
      message: 'This motorcycle is available for the selected dates!',
    };
  } else {
    throw new Error('Sorry, this motorcycle is not available for the selected dates.');
  }
};