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

  const REVOLUT_API_URL =
    REVOLUT_ENV === "sandbox"
      ? "https://sandbox-merchant.revolut.com/api/1.0/orders"
      : "https://merchant.revolut.com/api/1.0/orders";

  const revolutOrderPayload = {
    amount: Math.round(amount * 100),
    currency,
    capture_mode: "AUTOMATIC",
    checkout_mode: "embedded",
    return_url: "https://move-rentals.com/revolut-confirmation",
  };

  // ✅ LOG the payload you're about to send
  console.log("🔼 Sending to Revolut:", revolutOrderPayload);

  try {
    const response = await fetch(REVOLUT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REVOLUT_SECRET_KEY}`,
        "Revolut-Api-Version": "2024-09-01",
      },
      body: JSON.stringify(revolutOrderPayload),
    });

    const responseData = await response.json();

    // ✅ LOG the full Revolut API response
    console.log("🔽 Revolut API response:", responseData);

    if (!response.ok) {
      console.error("❌ Revolut API error:", responseData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: responseData.message || "Failed to create order." }),
      };
    }

    if (!responseData.token) {
      console.warn("⚠️ No token received from Revolut — check if embedded checkout is enabled.");
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        token: responseData.token,
        checkoutUrl: responseData.checkout_url,
        orderId: responseData.id,
      }),
    };
  } catch (error) {
    console.error("💥 Unexpected error during Revolut token creation:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error." }) };
  }
};
