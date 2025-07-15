import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import RevolutCheckout from "@revolut/checkout";

const RevolutCardField = forwardRef(
  ({ amount, currency, onPaymentSuccess, onPaymentError }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const cardFieldRef = useRef(null);
    const cardInstanceRef = useRef(null);

    useEffect(() => {
      const initializeCardField = async () => {
        if (!cardFieldRef.current) return;

        try {
          const response = await fetch("/.netlify/functions/create-revolut-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, currency }),
          });

          if (!response.ok) {
            throw new Error("Failed to retrieve payment token from server.");
          }

          const { token } = await response.json();

          if (!token) {
            throw new Error("Server did not return a valid payment token.");
          }

          const RC = await RevolutCheckout(token, "sandbox");

          const cardField = RC.createCardField({
            target: cardFieldRef.current,
            onSuccess() {
              setError(null);
              onPaymentSuccess("Payment successful!");
            },
            onError(message) {
              setError(`Payment failed: ${message}`);
              onPaymentError(message);
            },
            styles: {
              base: {
                color: "#EDEFF7",
                "::placeholder": { color: "#6E7180" },
              },
              focused: { color: "#FFFFFF" },
              error: { color: "#EF4444" },
            },
          });

          cardInstanceRef.current = cardField;
        } catch (err) {
          console.error("Revolut initialization failed:", err);
          setError(
            "Could not load the payment form. This may be due to a browser extension (like an ad blocker). Please try disabling it or use a different browser."
          );
          onPaymentError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      if (amount > 0) {
        initializeCardField();
      }

      return () => {
        if (cardInstanceRef.current && typeof cardInstanceRef.current.destroy === "function") {
          cardInstanceRef.current.destroy();
        }
      };
    }, [amount, currency, onPaymentSuccess, onPaymentError]);

    useImperativeHandle(ref, () => ({
      submit: (customerDetails) => {
        if (cardInstanceRef.current) {
          cardInstanceRef.current.submit({
            name: `${customerDetails.firstName} ${customerDetails.lastName}`,
            email: customerDetails.email,
            phone: customerDetails.phone,
          });
        }
      },
    }));

    return (
      <div>
        {isLoading && <p className="text-center text-space">Loading payment form...</p>}
        <div ref={cardFieldRef} style={{ minHeight: "50px" }}></div>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>
    );
  }
);

export default RevolutCardField;
