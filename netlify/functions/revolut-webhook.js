import crypto from 'crypto';
import { Buffer } from 'buffer';
import process from 'process';

const TWICE_API_BASE = 'https://api.twicecommerce.com/admin';
const REVOLUT_API_BASE = "https://merchant.revolut.com/api";

// The signature verification is working perfectly.
const verifySignature = (payload, headers, secret) => {
  const signatureFromHeader = headers['revolut-signature'];
  const timestampFromHeader = headers['revolut-request-timestamp'];
  if (!signatureFromHeader || !timestampFromHeader || !secret || !payload) return false;
  try {
    const signatureParts = signatureFromHeader.split(',');
    const v1Signature = signatureParts.find(part => part.startsWith('v1='));
    if (!v1Signature) return false;
    const signature = v1Signature.split('=')[1];
    if (!signature) return false;
    const signedPayload = `v1.${timestampFromHeader}.${payload}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(signedPayload);
    const computedSignature = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(computedSignature), Buffer.from(signature));
  } catch (error) {
    console.error("Error during signature verification:", error);
    return false;
  }
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { TWICE_API_ID, TWICE_API_SECRET, REVOLUT_SECRET_KEY, REVOLUT_WEBHOOK_SIGNING_SECRET } = process.env;

  if (!verifySignature(event.body, event.headers, REVOLUT_WEBHOOK_SIGNING_SECRET)) {
    console.warn("Invalid webhook signature.");
    return { statusCode: 401, body: 'Invalid signature' };
  }

  try {
    const webhookEvent = JSON.parse(event.body);
    console.log(`✅ Signature verified. Event type: ${webhookEvent.event}`);

    if (webhookEvent.event === 'ORDER_COMPLETED') {
      const revolutOrderId = webhookEvent.order_id;

      if (!revolutOrderId) {
        console.error("Webhook is missing order_id.");
        return { statusCode: 200, body: 'OK: Missing order_id.' };
      }

      //
      // **THE FIX: Use the order_id to fetch the full order details from Revolut.**
      //
      console.log(`Fetching full details for Revolut order: ${revolutOrderId}`);
      const revolutOrderResponse = await fetch(`${REVOLUT_API_BASE}/orders/${revolutOrderId}`, {
        headers: {
          "Authorization": `Bearer ${REVOLUT_SECRET_KEY}`,
          "Revolut-Api-Version": "2024-09-01",
        }
      });

      if (!revolutOrderResponse.ok) {
        const errorText = await revolutOrderResponse.text();
        console.error(`Failed to fetch Revolut order details:`, errorText);
        return { statusCode: 200, body: 'Error fetching Revolut order.' };
      }
      
      const fullOrderDetails = await revolutOrderResponse.json();
      const { metadata } = fullOrderDetails;

      if (!metadata) {
          console.error("Fetched Revolut order is missing metadata object.");
          return { statusCode: 200, body: 'OK: Missing metadata.' };
      }

      const { lc: leanCartString, cd: customerDetailsString } = metadata;
      const leanCart = JSON.parse(leanCartString);
      const customerDetails = JSON.parse(customerDetailsString);

      if (!leanCart || !customerDetails) {
        console.error("Webhook is missing parsed cart or customer details in metadata.");
        return { statusCode: 200, body: 'OK: Missing parsed metadata.' };
      }

      console.log("Creating paid order in Twice Commerce...");
      
      const twiceEncodedCredentials = Buffer.from(`${TWICE_API_ID}:${TWICE_API_SECRET}`).toString("base64");
      const twiceHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${twiceEncodedCredentials}`,
        "x-rentle-version": "2023-02-01",
      };
      
      const storesResponse = await fetch(`${TWICE_API_BASE}/stores`, { headers: twiceHeaders });
      const storesData = await storesResponse.json();
      const storeId = storesData.data?.[0]?.id;

      if (!storeId) {
        throw new Error("Could not retrieve storeId from Twice Commerce.");
      }
      
      const firstItem = leanCart[0];
      const startDate = new Date(firstItem.from);
      const [pickupHours, pickupMinutes] = firstItem.time.split(':').map(Number);
      const preciseStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), pickupHours, pickupMinutes);

      const createPayload = {
        storeId: storeId,
        customer: { ...customerDetails, marketingConsent: true },
        items: leanCart.map(item => ({
            productId: item.id,
            variantId: item.vId,
            quantity: 1,
        })),
        startDate: preciseStartDate.toISOString(),
        duration: { period: "days", value: firstItem.days > 0 ? firstItem.days : 1 },
        paid: true,
        externalOrderId: revolutOrderId
      };

      const twiceCreateResponse = await fetch(`${TWICE_API_BASE}/orders`, {
        method: 'POST',
        headers: twiceHeaders,
        body: JSON.stringify(createPayload),
      });

      if (!twiceCreateResponse.ok) {
        const errorBody = await twiceCreateResponse.text();
        console.error(`Failed to create order in Twice Commerce:`, errorBody);
        return { statusCode: 200, body: 'Error creating order.' };
      }
      
      const newTwiceOrder = await twiceCreateResponse.json();
      console.log(`✅ Successfully created paid order ${newTwiceOrder.id} in Twice Commerce.`);
    }

    return { statusCode: 200, body: 'Webhook received successfully.' };

  } catch (error) {
    console.error('Webhook handler failed:', error);
    return { statusCode: 500, body: `Internal Server Error: ${error.message}` };
  }
};