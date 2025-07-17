/* eslint-env node */
import process from "process";

export const handler = async () => {
  const { REVOLUT_SECRET_KEY, REVOLUT_ENV, URL: NETLIFY_SITE_URL } = process.env;
  const siteUrl = NETLIFY_SITE_URL || "http://localhost:8888";

  if (!REVOLUT_SECRET_KEY) {
    return { statusCode: 500, body: "Server configuration error: REVOLUT_SECRET_KEY is missing." };
  }

  const REVOLUT_API_URL =
    REVOLUT_ENV === "sandbox"
      ? "https://sandbox-merchant.revolut.com/api/webhooks"
      : "https://merchant.revolut.com/api/webhooks";

  const webhookListenerUrl = `${siteUrl}/.netlify/functions/revolut-webhook`;

  const payload = {
    url: webhookListenerUrl,
    events: ["ORDER_COMPLETED"],
  };

  try {
    const response = await fetch(REVOLUT_API_URL, {
      method: "POST",
      headers: {
        // FIXED: Added the 'Accept' and 'Revolut-Api-Version' headers to be more explicit.
        Accept: "application/json",
        Authorization: `Bearer ${REVOLUT_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2023-09-01",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Revolut API Error:", responseData);
      throw new Error(`Failed to create webhook. Status: ${response.status}`);
    }

    console.log("✅ Webhook created successfully!");
    console.log("✅ Webhook ID:", responseData.id);
    console.log(
      "🔴 COPY THIS SIGNING SECRET and add it to your Netlify environment variables as REVOLUT_WEBHOOK_SIGNING_SECRET:",
      responseData.signing_secret
    );

    return {
      statusCode: 200,
      body: `Webhook created successfully for URL: ${webhookListenerUrl}. Please check your Netlify function logs for the signing secret.`,
    };
  } catch (error) {
    console.error("Webhook setup failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
