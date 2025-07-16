export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const { REVOLUT_SECRET_KEY, REVOLUT_ENV } = process.env;
  const { amount, currency } = JSON.parse(event.body);

  if (!REVOLUT_SECRET_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error." }) };
  }
  if (!amount || !currency) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing amount or currency." }) };
  }

  const REVOLUT_API_URL = REVOLUT_ENV === "sandbox"
      ? "https://sandbox-merchant.revolut.com/api/1.0/orders"
      : "https://merchant.revolut.com/api/1.0/orders";

  const revolutOrderPayload = {
    amount: Math.round(amount * 100),
    currency: currency,
  };

  try {
    const response = await fetch(REVOLUT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${REVOLUT_SECRET_KEY}`,
        "Revolut-Api-Version": "2023-09-01", 
      },
      body: JSON.stringify(revolutOrderPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Revolut API returned an error:", responseData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: responseData.message || "Failed to create order." }),
      };
    }

    // --- The Correct Fix ---
    // The API now returns 'token'. We use and return that.
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ token: responseData.token, orderId: responseData.id }),
    };

  } catch (error) {
    console.error("An unexpected error occurred in the function.", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error." }) };
  }
};