import { fetchTwiceProducts } from "./utils/twice-products.mjs";

export const handler = async () => {
  try {
    const allProducts = await fetchTwiceProducts();
    return {
      statusCode: 200,
      headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" },
      body: JSON.stringify({ data: allProducts }),
    };
  } catch (error) {
    const statusCode = error.message.includes("credentials") ? 500 : 502;
    return { statusCode, body: JSON.stringify({ error: error.message }) };
  }
};
