import crypto from 'crypto';
import { Buffer } from 'buffer';
import process from 'process';

const TWICE_API_BASE = 'https://api.twicecommerce.com/admin';

const verifySignature = (payload, header, secret) => {
  if (!header) return false;
  try {
    const [timestamp, signature] = header.split(',');
    const signedPayload = `${timestamp.split('=')[1]}.${payload}`;
    const hmac = crypto.createHmac('sha266', secret);
    hmac.update(signedPayload);
    const computedSignature = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(computedSignature), Buffer.from(signature.split('=')[1]));
  } catch (error) {
    console.error("Error during signature verification:", error);
    return false;
  }
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { TWICE_API_ID, TWICE_API_SECRET, REVOLUT_WEBHOOK_SIGNING_SECRET } = process.env;
  const signatureHeader = event.headers['revolut-signature'] || event.headers['Revolut-Signature'];

  console.log("--- Revolut Webhook Received ---");
  
  if (!verifySignature(event.body, signatureHeader, REVOLUT_WEBHOOK_SIGNING_SECRET)) {
    console.warn(" Invalid webhook signature.");
    console.log("Received Headers:", JSON.stringify(event.headers, null, 2));
    return { statusCode: 401, body: 'Invalid signature' };
  }

  try {
    const webhookEvent = JSON.parse(event.body);
    console.log(` Signature verified. Event type: ${webhookEvent.event}`);

    if (webhookEvent.event === 'ORDER_COMPLETED') {
      const orderData = webhookEvent.data;
      const twiceOrderId = orderData.metadata?.twice_order_id;

      if (!twiceOrderId) {
        console.error(" Webhook missing twice_order_id in metadata.");
        return { statusCode: 200, body: 'OK: No action taken (missing metadata).' };
      }
      
      console.log(`Processing confirmation for Twice Order ID: ${twiceOrderId}`);

      const twiceEncodedCredentials = Buffer.from(`${TWICE_API_ID}:${TWICE_API_SECRET}`).toString("base64");
      const twiceHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${twiceEncodedCredentials}`,
        "x-rentle-version": "2023-02-01",
      };

      const updatePayload = {
        paid: true,
        status: 'confirmed'
      };

      const twiceUpdateResponse = await fetch(`${TWICE_API_BASE}/orders/${twiceOrderId}`, {
        method: 'PATCH',
        headers: twiceHeaders,
        body: JSON.stringify(updatePayload),
      });

      if (!twiceUpdateResponse.ok) {
        const errorBody = await twiceUpdateResponse.text();
        console.error(`Failed to update order ${twiceOrderId} in Twice Commerce:`, errorBody);
        return { statusCode: 200, body: 'Error updating backend, but event acknowledged.' };
      }

      console.log(`✅ Successfully confirmed order ${twiceOrderId} in Twice Commerce.`);
    }

    return { statusCode: 200, body: 'Webhook received successfully.' };

  } catch (error) {
    console.error(' Webhook handler failed:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};