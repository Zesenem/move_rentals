export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
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
    const storesResponse = await fetch(`${API_BASE_URL}/stores`, { headers: twiceHeaders });
    if (!storesResponse.ok) throw new Error("Could not fetch store details.");
    const storesData = await storesResponse.json();
    const storeId = storesData.data?.[0]?.id;
    if (!storeId) throw new Error("Default store ID not found.");

    const { cartItems, customerDetails } = JSON.parse(event.body);

    const orderPayload = {
      storeId: storeId,
      customer: { ...customerDetails, marketingConsent: true },
      items: cartItems.flatMap((item) => {
        const mainItem = { productId: item.id.split("-")[0], quantity: 1 };
        const extraItems = Object.values(item.extras).map((extra) => ({
          productId: extra.id,
          quantity: extra.quantity,
        }));
        return [mainItem, ...extraItems];
      }),
      startDate: cartItems[0].range.from,
      duration: { period: "days", value: cartItems[0].days },
      paid: false,
    };

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: twiceHeaders,
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { statusCode: response.status, body: JSON.stringify(errorData) };
    }

    const newOrder = await response.json();
    return { statusCode: 200, body: JSON.stringify(newOrder) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
