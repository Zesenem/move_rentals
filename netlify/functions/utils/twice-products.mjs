const API_BASE_URL = "https://api.twicecommerce.com/admin";
export const MOTORCYCLE_CATEGORY_ID = "Enlv0F1KBYYbOb5HdzJH";

export const fetchTwiceProducts = async ({
  maxPages = 20,
  requireCredentials = true,
} = {}) => {
  const apiId = process.env.TWICE_API_ID;
  const apiSecret = process.env.TWICE_API_SECRET;

  if (!apiId || !apiSecret) {
    if (!requireCredentials) {
      return [];
    }

    throw new Error("Twice API credentials are not configured.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(`${apiId}:${apiSecret}`).toString("base64")}`,
    "x-rentle-version": "2023-02-01",
  };
  const products = [];
  let pageToken;
  let pageCount = 0;

  do {
    const url = new URL(`${API_BASE_URL}/products`);
    url.searchParams.set("categories", MOTORCYCLE_CATEGORY_ID);
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Twice API returned ${response.status}.`);
    }

    const page = await response.json();
    products.push(...(page.data || []));
    pageToken = page.nextPageToken || null;
    pageCount += 1;
  } while (pageToken && pageCount < maxPages);

  return products;
};
