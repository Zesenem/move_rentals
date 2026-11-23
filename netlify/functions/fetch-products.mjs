import { fetchTwiceProducts } from "./utils/twice-products.mjs";

export const handler = async () => {
  const startedAt = Date.now();
  try {
    const allProducts = await fetchTwiceProducts();
    console.info("Twice fleet fetch completed", {
      count: allProducts.length,
      durationMs: Date.now() - startedAt,
    });
    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
        "Server-Timing": `twice;dur=${Date.now() - startedAt}`,
      },
      body: JSON.stringify({ data: allProducts }),
    };
  } catch (error) {
    const statusCode = error.message.includes("credentials") ? 500 : 502;
    console.error("Twice fleet fetch failed", {
      durationMs: Date.now() - startedAt,
      error: error.message,
    });
    return { statusCode, body: JSON.stringify({ error: error.message }) };
  }
};
