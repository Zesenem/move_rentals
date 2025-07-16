export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
      headers: { 'Allow': 'POST' }
    };
  }

  const { amount, currency } = JSON.parse(event.body);
  const { REVOLUT_SECRET_KEY, REVOLUT_ENV } = process.env;

  const REVOLUT_API_URL =
    REVOLUT_ENV === "merchant"
      ? "https://sandbox-merchant.revolut.com/api/1.0"
      : "https://merchant.revolut.com/api/1.0";

  if (!REVOLUT_SECRET_KEY) {
    console.error("Revolut secret key is not configured.");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Revolut secret key is not configured in environment variables.",
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
      amount: Math.round(amount * 100),
      currency: currency,
    };

    const response = await fetch(`${REVOLUT_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REVOLUT_SECRET_KEY}`,
        "Revolut-Api-Version": "2025-06-04",
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
      headers: {
        'Access-Control-Allow-Origin': '*', // For production, you should restrict this to your domain
        'Access-Control-Allow-Headers': 'Content-Type',
      },
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