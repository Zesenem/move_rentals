// netlify/functions/process-revolut-payment-and-order.mjs
// Using `node-fetch` as a polyfill if not natively available in your specific Netlify Node.js runtime,
// though modern Netlify environments typically have fetch built-in.
// If you consistently see 'fetch is not defined' on Netlify, uncomment the import below.
// import fetch from 'node-fetch';

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const {
    cartItems,
    customerDetails,
    revolutPaymentId,
    revolutPaymentStatus,
    totalAmount,
    currency,
    paymentMethod,
  } = JSON.parse(event.body);

  const REVOLUT_API_KEY = process.env.REVOLUT_SECRET_KEY; // 'process' is a Node.js global
  const TWICE_API_ID = process.env.TWICE_API_ID;           // 'process' is a Node.js global
  const TWICE_API_SECRET = process.env.TWICE_API_SECRET;   // 'process' is a Node.js global

  if (!TWICE_API_ID || !TWICE_API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Twice Commerce API credentials are not configured." }),
    };
  }

  // 'Buffer' is a Node.js global
  const twiceEncodedCredentials = Buffer.from(`${TWICE_API_ID}:${TWICE_API_SECRET}`).toString("base64");
  const twiceHeaders = {
    "Content-Type": "application/json",
    Authorization: `Basic ${twiceEncodedCredentials}`,
    "x-rentle-version": "2023-02-01",
  };

  try {
    let paymentSuccess = false;
    if (paymentMethod === "revolut") {
      if (!REVOLUT_API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ error: "Revolut API secret key is not configured." }) };
      }

      if (revolutPaymentStatus === 'CAPTURED' || revolutPaymentStatus === 'AUTHORIZED') {
          paymentSuccess = true;
      } else {
          return { statusCode: 400, body: JSON.stringify({ error: `Revolut payment not successful: ${revolutPaymentStatus}` }) };
      }
    } else if (paymentMethod === "mbway") {
        paymentSuccess = true;
    } else {
        return { statusCode: 400, body: JSON.stringify({ error: "Unsupported payment method." }) };
    }

    if (!paymentSuccess) {
        return { statusCode: 500, body: JSON.stringify({ error: "Payment failed or could not be verified." }) };
    }

    const storesResponse = await fetch(`https://api.twicecommerce.com/admin/stores`, { headers: twiceHeaders });
    if (!storesResponse.ok) throw new Error("Could not fetch store details from Twice Commerce.");
    const storesData = await storesResponse.json();
    const storeId = storesData.data?.[0]?.id;
    if (!storeId) throw new Error("Default Twice Commerce store ID not found.");

    const orderPayload = {
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
      paid: true,
      paymentMethodId: paymentMethod,
      externalPaymentId: revolutPaymentId,
      totalAmount: totalAmount, // Added to payload
      currency: currency,       // Added to payload
    };

    const twiceOrderResponse = await fetch(`https://api.twicecommerce.com/admin/orders`, {
      method: "POST",
      headers: twiceHeaders,
      body: JSON.stringify(orderPayload),
    });

    if (!twiceOrderResponse.ok) {
      const errorData = await twiceOrderResponse.json();
      return { statusCode: twiceOrderResponse.status, body: JSON.stringify({ error: "Failed to create order in Twice Commerce", details: errorData }) };
    }

    const newOrder = await twiceOrderResponse.json();
    return { statusCode: 200, body: JSON.stringify(newOrder) };
  } catch (error) {
    console.error("Error in process-revolut-payment-and-order function:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || "Internal server error" }) };
  }
};