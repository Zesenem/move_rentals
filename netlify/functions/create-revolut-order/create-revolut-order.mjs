export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const REVOLUT_API_KEY = process.env.REVOLUT_SECRET_KEY;
  const REVOLUT_API_URL = "https://sandbox-merchant.revolut.com/api/orders";

  if (!REVOLUT_API_KEY) {
    console.error("Revolut API key is not set.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error." }),
    };
  }

  try {
    const { amount, currency } = JSON.parse(event.body);

    const response = await fetch(REVOLUT_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REVOLUT_API_KEY}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2023-09-01",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: currency,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create Revolut order:", errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to create payment order.", details: errorData }),
      };
    }

    const orderData = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ token: orderData.token }),
    };
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An internal server error occurred." }),
    };
  }
};
