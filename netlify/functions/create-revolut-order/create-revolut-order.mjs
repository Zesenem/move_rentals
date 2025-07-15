export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const REVOLUT_API_KEY = process.env.REVOLUT_SECRET_KEY;
  const REVOLUT_API_URL = "https://merchant.revolut.com/api/orders";

  if (!REVOLUT_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  try {
    const { amount, currency } = JSON.parse(event.body);

    const response = await fetch(REVOLUT_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REVOLUT_API_KEY}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2024-09-01",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Payment gateway error",
          details: responseData,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ token: responseData.token }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
