import { Buffer } from "buffer";
import process from "process";

const TWICE_API_BASE = "https://api.twicecommerce.com/admin";
const REVOLUT_API_BASE = "https://merchant.revolut.com/api/1.0";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { TWICE_API_ID, TWICE_API_SECRET, REVOLUT_SECRET_KEY, URL: NETLIFY_SITE_URL } = process.env;
  const siteUrl = NETLIFY_SITE_URL || "http://localhost:8888";

  if (!TWICE_API_ID || !TWICE_API_SECRET || !REVOLUT_SECRET_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error." }) };
  }

  try {
    const { cartItems, customerDetails } = JSON.parse(event.body);

    const twiceEncodedCredentials = Buffer.from(`${TWICE_API_ID}:${TWICE_API_SECRET}`).toString(
      "base64"
    );
    const twiceHeaders = {
      "Content-Type": "application/json",
      Authorization: `Basic ${twiceEncodedCredentials}`,
      "x-rentle-version": "2023-02-01",
    };

    const storesResponse = await fetch(`${TWICE_API_BASE}/stores`, { headers: twiceHeaders });
    if (!storesResponse.ok) throw new Error("Could not fetch store details.");
    const storesData = await storesResponse.json();
    const storeId = storesData.data?.[0]?.id;
    if (!storeId) throw new Error("Default store ID not found.");

    const twiceOrderPayload = {
      storeId: storeId,
      customer: { ...customerDetails, marketingConsent: true },
      items: cartItems.flatMap((item) => {
        const mainItem = { productId: item.id.split("-")[0], quantity: 1 };
        const extraItems = Object.values(item.extras || {}).map((extra) => ({
          productId: extra.id,
          quantity: extra.quantity,
        }));
        return [mainItem, ...extraItems];
      }),
      startDate: cartItems[0].range.from,
      duration: { period: "days", value: cartItems[0].days },
      status: "pending_payment",
      meta: {
        pickupTime: cartItems[0].pickupTime,
      },
    };

    const twiceOrderResponse = await fetch(`${TWICE_API_BASE}/orders`, {
      method: "POST",
      headers: twiceHeaders,
      body: JSON.stringify(twiceOrderPayload),
    });

    if (!twiceOrderResponse.ok) {
      const errorData = await twiceOrderResponse.json();
      throw new Error(`Failed to create pending order: ${JSON.stringify(errorData)}`);
    }
    const twiceOrder = await twiceOrderResponse.json();
    const twiceOrderId = twiceOrder.id;
    if (!twiceOrderId) {
      throw new Error("Could not get order ID from Twice Commerce response.");
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const amountInCents = Math.round(totalAmount * 100);

    const revolutOrderPayload = {
      amount: amountInCents,
      currency: "EUR",
      merchant_order_ext_ref: twiceOrderId,
      metadata: { twice_order_id: twiceOrderId },
    };

    const revolutResponse = await fetch(`${REVOLUT_API_BASE}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REVOLUT_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2024-09-02",
      },
      body: JSON.stringify(revolutOrderPayload),
    });

    if (!revolutResponse.ok) {
      const errorData = await revolutResponse.json();
      throw new Error(`Failed to create Revolut order: ${JSON.stringify(errorData)}`);
    }
    const revolutOrder = await revolutResponse.json();

    const paymentPageUrl = revolutOrder.checkout_url;

    if (!paymentPageUrl) {
      console.error("Revolut response did not contain a 'checkout_url':", revolutOrder);
      throw new Error("Could not construct payment redirect URL from Revolut's response.");
    }

    const checkoutUrl = `${paymentPageUrl}?success_redirect_url=${siteUrl}/booking-success/${twiceOrderId}&failure_redirect_url=${siteUrl}/checkout`;

    return {
      statusCode: 200,
      body: JSON.stringify({ checkoutUrl }),
    };
  } catch (error) {
    console.error("Checkout initiation failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
