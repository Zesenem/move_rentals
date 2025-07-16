import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import RevolutCheckout from '@revolut/checkout';

// Style object to match your site's dark theme
// Colors are from your tailwind.config.js (phantom, graphite, cloud, etc.)
const cardStyles = {
  base: {
    backgroundColor: '#1E2A3A', // phantom
    color: '#D0D4DB',           // cloud
    '::placeholder': {
      color: '#6B7280',         // space (approximated)
    },
    borderColor: '#394B59',      // graphite
  },
  focus: {
    borderColor: '#D0D4DB',      // cloud
  },
  error: {
    color: '#F87171',            // A standard red for errors
    borderColor: '#F87171',
  },
};


const RevolutCardField = forwardRef(({ publicId, onPaymentSuccess, onPaymentError }, ref) => {
  const cardFieldContainerRef = useRef(null);
  const cardFieldInstanceRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (publicId && cardFieldContainerRef.current) {
      setError(null);
      setIsReady(false);

      RevolutCheckout(publicId)
        .then((instance) => {
          if (!cardFieldContainerRef.current) return;

          const cardField = instance.createCardField({
            target: cardFieldContainerRef.current,
            // --- THIS IS THE NEW PART ---
            // We pass the custom style object here
            styles: cardStyles,
            onSuccess(paymentResult) {
              onPaymentSuccess(paymentResult);
            },
            onError(message) {
              setError(`Payment failed: ${message}`);
              onPaymentError(new Error(message));
            },
            onReady() {
              setIsReady(true);
            },
          });
          
          cardFieldInstanceRef.current = cardField;
        })
        .catch((err) => {
          console.error("Failed to initialize Revolut Checkout:", err);
          setError("Could not load payment widget. The ID may be invalid.");
          onPaymentError(err);
        });
    }

    return () => {
      if (cardFieldInstanceRef.current?.destroy) {
        cardFieldInstanceRef.current.destroy();
      }
    };
  }, [publicId, onPaymentSuccess, onPaymentError]);

  useImperativeHandle(ref, () => ({
    submit: (customerDetails) => {
      if (cardFieldInstanceRef.current) {
        cardFieldInstanceRef.current.submit(customerDetails);
      }
    },
    isReady: isReady,
  }));

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  return <div ref={cardFieldContainerRef} id="revolut-card-field"></div>;
});

RevolutCardField.displayName = 'RevolutCardField';

export default RevolutCardField;

