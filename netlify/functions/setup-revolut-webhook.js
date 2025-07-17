/* eslint-env node */
import process from "process";

export const handler = async function (event, context) {
  const secretApiKey = process.env.REVOLUT_SECRET_KEY;
  const siteUrl = process.env.URL || "http://localhost:8888";

  if (!secretApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Revolut secret key is not configured in environment variables.",
      }),
    };
  }

  const webhookPayload = {
    url: `${siteUrl}/.netlify/functions/revolut-webhook`,
    events: ["ORDER_COMPLETED"],
  };

  try {
    const response = await fetch("https://merchant.revolut.com/api/1.0/webhooks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretApiKey}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2024-09-01",
      },
      body: JSON.stringify(webhookPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Revolut API Error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to create webhook.", details: data }),
      };
    }

    console.log("✅ Webhook created successfully!", data);
    console.log(
      "🔴 COPY THIS SIGNING SECRET and add it to your Netlify environment variables as REVOLUT_WEBHOOK_SIGNING_SECRET:",
      data.signing_secret
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Webhook created successfully! Check your function logs for the signing_secret.",
        webhookDetails: data,
      }),
    };
  } catch (error) {
    console.error("Network or other error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An unexpected error occurred." }),
    };
  }
};
