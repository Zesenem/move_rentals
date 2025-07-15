export const processRevolutPaymentAndOrder = async (payload) => {
  try {
    const response = await fetch(`/.netlify/functions/process-revolut-payment-and-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error processing Revolut payment and order:", errorData);
      throw new Error(errorData.error?.message || 'Failed to complete booking and payment.');
    }

    return await response.json();
  } catch (error) {
    console.error("Error in processRevolutPaymentAndOrder:", error);
    throw error;
  }
};