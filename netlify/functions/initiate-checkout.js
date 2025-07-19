import { Buffer } from "buffer";
import process from "process";

const REVOLUT_API_BASE = "https://merchant.revolut.com/api";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { REVOLUT_SECRET_KEY, URL: NETLIFY_SITE_URL } = process.env;
  const siteUrl = NETLIFY_SITE_URL || "http://localhost:8888";

  if (!REVOLUT_SECRET_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error." }) };
  }

  try {
    const { cartItems, customerDetails } = JSON.parse(event.body);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const amountInCents = Math.round(totalAmount * 100);

    const leanCart = cartItems.map(item => ({
      id: item.id.split("-")[0], 
      vId: item.variantId,       
      days: item.days,
      time: item.pickupTime,
      from: item.range.from,     
      to: item.range.to,         
      extras: item.extras       
    }));

    const revolutOrderPayload = {
      amount: amountInCents,
      currency: "EUR",
      customer: {
        email: customerDetails.email,
        full_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        phone: customerDetails.phone,
      },
      metadata: {
        lc: JSON.stringify(leanCart),
        cd: JSON.stringify(customerDetails)
      },
      redirect_url: `${siteUrl}/booking-success`,
    };

    const revolutResponse = await fetch(`${REVOLUT_API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REVOLUT_SECRET_KEY}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2024-09-01",
      },
      body: JSON.stringify(revolutOrderPayload),
    });

    if (!revolutResponse.ok) {
      const errorData = await revolutResponse.json();
      throw new Error(`Failed to create Revolut order: ${JSON.stringify(errorData)}`);
    }

    const revolutOrder = await revolutResponse.json();
    const checkoutUrl = revolutOrder.checkout_url;

    if (!checkoutUrl) {
      throw new Error("Could not construct payment redirect URL.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ checkoutUrl }),
    };

  } catch (error) {
    console.error("Checkout initiation failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
