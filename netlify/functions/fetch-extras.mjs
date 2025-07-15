export const handler = async () => {
  const API_BASE_URL = "https://api.twicecommerce.com/admin";
  const API_ID = process.env.TWICE_API_ID;
  const API_SECRET = process.env.TWICE_API_SECRET;
  const EXTRAS_CATEGORY_ID = "GH1Hm7Cz2fsProT5dkRR";

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
    const response = await fetch(`${API_BASE_URL}/products?categories=${EXTRAS_CATEGORY_ID}`, {
      headers: twiceHeaders,
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { statusCode: response.status, body: JSON.stringify(errorData) };
    }
    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
