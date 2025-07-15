export const handler = async (event) => {
  const { bikeId } = event.queryStringParameters;
  if (!bikeId) {
    return { statusCode: 400, body: JSON.stringify({ error: "bikeId is required." }) };
  }

  const API_BASE_URL = "https://api.twicecommerce.com/admin";
  const API_ID = process.env.TWICE_API_ID;
  const API_SECRET = process.env.TWICE_API_SECRET;

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

  try {
    let allOrders = [];
    let nextPageToken = null;
    do {
      const url = new URL(`${API_BASE_URL}/orders`);
      if (nextPageToken) url.searchParams.append("pageToken", nextPageToken);
      const response = await fetch(url.toString(), { headers: twiceHeaders });
      if (!response.ok) {
        const errorData = await response.json();
        return { statusCode: response.status, body: JSON.stringify(errorData) };
      }
      const paginatedResponse = await response.json();
      allOrders = allOrders.concat(paginatedResponse.data);
      nextPageToken = paginatedResponse.nextPageToken;
    } while (nextPageToken);

    const bookingsForBike = allOrders.filter(
      (order) =>
        order.state !== "cancelled" && order.items.some((item) => item.productId === bikeId)
    );

    return { statusCode: 200, body: JSON.stringify(bookingsForBike) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
