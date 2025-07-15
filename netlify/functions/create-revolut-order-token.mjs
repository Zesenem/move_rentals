// netlify/functions/create-revolut-order-token.mjs
// import fetch from "node-fetch"; // Required for fetch in some Node.js environments

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { amount, currency } = JSON.parse(event.body);

  const REVOLUT_SECRET_KEY = process.env.REVOLUT_SECRET_KEY;
  // Determine Revolut API URL based on your environment variable setting
  // You should set REVOLUT_ENV in Netlify environment variables (e.g., 'sandbox' or 'production')
  const REVOLUT_API_URL =
    process.env.REVOLUT_ENV === "sandbox"
      ? "https://sandbox-merchant.revolut.com/api/1.0"
      : "https://merchant.revolut.com/api/1.0";

  if (!REVOLUT_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Revolut secret key is not configured in Netlify environment variables.",
      }),
    };
  }

  if (!amount || !currency) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing amount or currency in request body." }),
    };
  }

  try {
    const revolutOrderPayload = {
      amount: Math.round(amount * 100), // Revolut API expects amount in the lowest denomination (e.g., cents for EUR)
      currency: currency,
      // capture_mode: "automatic", // You can set this to "automatic" or "manual" based on your needs
      // description: "Rental Booking", // Optional: Add a description
      // merchant_order_id: "your-internal-order-id", // Optional: Link to your internal order ID for reconciliation
    };

    const response = await fetch(`${REVOLUT_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REVOLUT_SECRET_KEY}`, // Authenticate with your secret key
        "Revolut-Api-Version": "2025-06-04", // Use the latest API version if documented as different
      },
      body: JSON.stringify(revolutOrderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating Revolut order:", errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: errorData.message || "Failed to create Revolut order on backend.",
        }),
      };
    }

    const orderData = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ orderToken: orderData.token, orderId: orderData.id }),
    };
  } catch (error) {
    console.error("Error in create-revolut-order-token function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Internal server error during Revolut order creation.",
      }),
    };
  }
};
