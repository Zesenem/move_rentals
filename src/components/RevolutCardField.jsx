import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import RevolutCheckout from '@revolut/checkout';

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

