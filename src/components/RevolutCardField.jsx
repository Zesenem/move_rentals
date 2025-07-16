import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import RevolutCheckout from '@revolut/checkout';

const RevolutCardField = forwardRef(({ orderToken, onPaymentSuccess, onPaymentError }, ref) => {
  // A ref to hold the div where the iframe will be mounted
  const cardFieldContainerRef = useRef(null);
  // A ref to hold the Revolut Card Field instance once it's created
  const cardFieldInstanceRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // This is the main effect that initializes Revolut Checkout
  useEffect(() => {
    // Only run if we have a token and a div to mount into
    if (orderToken && cardFieldContainerRef.current) {
      // Reset state for re-initialization if the token changes
      setError(null);
      setIsReady(false);

      RevolutCheckout(orderToken)
        .then((instance) => {
          // Check if the component is still mounted before proceeding
          if (!cardFieldContainerRef.current) return;

          const cardField = instance.createCardField({
            target: cardFieldContainerRef.current,
            // You can add custom styles here if needed
            // styles: {
            //   base: {
            //     color: '#fff',
            //   },
            // },
            onSuccess(paymentResult) {
              // Pass the success result to the parent component
              onPaymentSuccess(paymentResult);
            },
            onError(message) {
              // Set the internal error state and pass to the parent
              setError(`Payment failed: ${message}`);
              onPaymentError(new Error(message));
            },
            onReady() {
              setIsReady(true);
            },
          });
          
          // Store the card field instance in a ref
          cardFieldInstanceRef.current = cardField;
        })
        .catch((err) => {
          // This catch block is crucial for debugging initialization errors
          console.error("Failed to initialize Revolut Checkout:", err);
          setError("Could not load the payment widget. The order token might be invalid or expired.");
          onPaymentError(err);
        });
    }

    // Cleanup function: This is critical to prevent memory leaks
    return () => {
      if (cardFieldInstanceRef.current && typeof cardFieldInstanceRef.current.destroy === 'function') {
        cardFieldInstanceRef.current.destroy();
        cardFieldInstanceRef.current = null;
      }
    };
    // This effect depends on the token. It will re-run if the token changes.
  }, [orderToken, onPaymentSuccess, onPaymentError]);

  // Expose the submit and isReady methods to the parent component via the ref
  useImperativeHandle(ref, () => ({
    submit: (customerDetails) => {
      if (cardFieldInstanceRef.current) {
        cardFieldInstanceRef.current.submit(customerDetails);
      } else {
        console.error("Cannot submit: Revolut Card Field is not initialized.");
      }
    },
    isReady: isReady,
  }));

  // Render any initialization errors directly in the UI
  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  // This is the target div for the Revolut iframe
  return <div ref={cardFieldContainerRef} id="revolut-card-field"></div>;
});

// Add a display name for better debugging in React DevTools
RevolutCardField.displayName = 'RevolutCardField';

export default RevolutCardField;

