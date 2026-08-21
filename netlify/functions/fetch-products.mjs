export const handler = async () => {
  const API_BASE_URL = "https://api.twicecommerce.com/admin";
  const API_ID = process.env.TWICE_API_ID;
  const API_SECRET = process.env.TWICE_API_SECRET;
  const MOTORCYCLE_CATEGORY_ID = "Enlv0F1KBYYbOb5HdzJH";

  if (!API_ID || !API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API credentials are not configured." }),
    };
  }

  const encodedCredentials = Buffer.from(`${API_ID}:${API_SECRET}`).toString("base64");
  const twiceHeaders = {
    "Content-Type": "application/json",
    Authorization: `Basic ${encodedCredentials}`,
    "x-rentle-version": "2023-02-01",
  };

  // The API paginates results (10 per page by default) via a `pageToken` cursor.
  const MAX_PAGES = 20;

  try {
    const allProducts = [];
    let pageToken;
    let pageCount = 0;

    do {
      const url = new URL(`${API_BASE_URL}/products`);
      url.searchParams.set("categories", MOTORCYCLE_CATEGORY_ID);
      if (pageToken) {
        url.searchParams.set("pageToken", pageToken);
      }

      const response = await fetch(url, { headers: twiceHeaders });

      if (!response.ok) {
        const errorData = await response.json();
        return { statusCode: response.status, body: JSON.stringify(errorData) };
      }

      const page = await response.json();
      allProducts.push(...(page.data || []));
      pageToken = page.nextPageToken || null;
      pageCount += 1;
    } while (pageToken && pageCount < MAX_PAGES);

    return { statusCode: 200, body: JSON.stringify({ data: allProducts }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
