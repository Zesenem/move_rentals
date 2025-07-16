import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import RevolutCheckout from '@revolut/checkout';

const cardStyles = {
  base: {
    backgroundColor: '#1E2A3A', 
    color: '#D0D4DB',          
    '::placeholder': {
      color: '#6B7280',       
    },
    borderColor: '#394B59',    
  },
  focus: {
    borderColor: '#D0D4DB',      
  },
  error: {
    color: '#F87171',           
    borderColor: '#F87171',
  },
};


const RevolutCardField = forwardRef(({ orderToken, onPaymentSuccess, onPaymentError }, ref) => {
  const cardFieldContainerRef = useRef(null);
  const cardFieldInstanceRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderToken && cardFieldContainerRef.current) {
      setError(null);
      setIsReady(false);

      RevolutCheckout(orderToken)
        .then((instance) => {
          if (!cardFieldContainerRef.current) return;

          const cardField = instance.createCardField({
            target: cardFieldContainerRef.current,
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
  }, [orderToken, onPaymentSuccess, onPaymentError]);

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

