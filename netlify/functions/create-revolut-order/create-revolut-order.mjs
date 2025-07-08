export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { amount, currency } = JSON.parse(event.body);
  const secretKey = process.env.VITE_REVOLUT_SECRET_KEY;

  if (!secretKey) {
    return { statusCode: 500, body: "Revolut secret key not configured." };
  }

  try {
    const response = await fetch("https://merchant.revolut.com/api/1.0/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: currency,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { statusCode: response.status, body: JSON.stringify(errorData) };
    }

    const orderData = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ token: orderData.token }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
