// src/components/RevolutCardField.jsx
import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';

const RevolutCardField = forwardRef(({ amount, currency, onPaymentSuccess, onPaymentError }, ref) => {
  const containerRef = useRef(null);
  const cardFieldRef = useRef(null);
  const revolutInstance = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSdkReady, setIsSdkReady] = useState(false);

  const loadRevolutScript = () => {
    if (document.getElementById('revolut-embed-script')) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'revolut-embed-script';
      script.src = 'https://merchant.revolut.com/embed.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const waitForRevolutCheckout = (timeout = 5000, interval = 100) => {
    return new Promise((resolve, reject) => {
      let timeLeft = timeout;
      const timer = setInterval(() => {
        if (window.RevolutCheckout) {
          clearInterval(timer);
          resolve(window.RevolutCheckout);
        } else {
          timeLeft -= interval;
          if (timeLeft <= 0) {
            clearInterval(timer);
            reject(new Error("RevolutCheckout SDK did not load within the timeout."));
          }
        }
      }, interval);
    });
  };

  useEffect(() => {
    const initRevolut = async () => {
      try {
        setErrorMessage(null);
        setIsSdkReady(false);

        console.log("Attempting to load Revolut script...");
        await loadRevolutScript();
        console.log("Revolut script loaded. Waiting for RevolutCheckout global...");

        const RevolutCheckoutSDK = await waitForRevolutCheckout();
        console.log("RevolutCheckoutSDK instance found:", RevolutCheckoutSDK);

        // --- THE CORE FIX: AWAITING THE INITIALIZATION ---
        revolutInstance.current = await RevolutCheckoutSDK({ // <--- Changed this line
          publicKey: import.meta.env.VITE_REVOLUT_PUBLIC_KEY,
          locale: 'en',
        });
        console.log("Revolut instance created:", revolutInstance.current); // This should now log the actual object

        // Ensure containerRef.current is not null before creating card field
        console.log("containerRef.current before createCardField:", containerRef.current);
        if (!containerRef.current) {
          setErrorMessage("Revolut container element not found. Please refresh.");
          console.error("Critical: containerRef.current is null.");
          return;
        }

        if (revolutInstance.current) {
          cardFieldRef.current = revolutInstance.current.createCardField({
            element: containerRef.current,
            style: {
              base: {
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                color: '#C0C0C0',
                '::placeholder': {
                  color: '#808080',
                },
              },
              invalid: {
                color: '#EF4444',
              },
            },
            amount,
            currency,
          });

          if (cardFieldRef.current) {
            console.log("Card field object created:", cardFieldRef.current);
            cardFieldRef.current.mount();
            setIsSdkReady(true);
          } else {
            console.error("revolutInstance.current.createCardField() returned null or undefined.");
            setErrorMessage("Failed to create card input fields. Invalid public key or environment?");
          }

        } else {
          console.error("Revolut instance not ready for card field creation.");
          setErrorMessage("Payment form failed to load. Please refresh.");
        }
      } catch (error) {
        console.error("Failed to load Revolut SDK or initialize:", error);
        setErrorMessage("Error loading payment system: " + (error.message || "Unknown error"));
      }
    };

    // --- REVERTING DEBUGGING CHANGE: Add dependencies back ---
    // The empty array was for debugging. Now that the core issue is identified,
    // we want this effect to re-run if amount or currency changes.
    if (amount > 0) {
      initRevolut();
    } else {
      setErrorMessage("Invalid amount for payment.");
    }

    return () => {
      if (cardFieldRef.current) {
        console.log("Destroying Revolut card field on unmount/cleanup.");
        cardFieldRef.current.destroy();
      }
      setIsSdkReady(false);
    };
  }, [amount, currency]); // <--- REVERTED: Dependencies added back

  useImperativeHandle(ref, () => ({
    submit: async (customerDetails) => {
      if (!cardFieldRef.current || !revolutInstance.current || !isSdkReady) {
        throw new Error("Revolut card field not initialized or ready.");
      }

      try {
        const result = await cardFieldRef.current.submit({
          email: customerDetails.email,
          phone: customerDetails.phone,
          customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
        });

        if (['AUTHORIZED', 'CAPTURED'].includes(result.status)) {
          onPaymentSuccess(result);
        } else {
          onPaymentError(new Error(`Payment failed: ${result.status}`));
        }
      } catch (error) {
        console.error("Error submitting Revolut payment:", error);
        onPaymentError(new Error(error.message || "Payment submission failed."));
      }
    },
    isReady: isSdkReady,
  }));

  return (
    <div>
      {errorMessage && <p className="text-rogueRed mb-4">{errorMessage}</p>}
      {!isSdkReady && !errorMessage && (
        <div className="text-space text-center py-4">Loading payment form...</div>
      )}
      <div ref={containerRef} className="revolut-card-field-container p-4 border border-graphite rounded-md">
        {/* Revolut will inject the card fields here */}
      </div>
      <div className="flex justify-end mt-2 text-sm text-space">
        <p>Powered by Revolut Pay</p>
      </div>
    </div>
  );
});

export default RevolutCardField;
