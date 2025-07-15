import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import RevolutCheckout from "@revolut/checkout";

const RevolutCardField = forwardRef(
  ({ amount, currency, onPaymentSuccess, onPaymentError }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const cardFieldRef = useRef(null);
    const cardInstanceRef = useRef(null);

    useEffect(() => {
      // Ensure we don't re-initialize if not needed
      if (!cardFieldRef.current || cardInstanceRef.current) return;

      let isMounted = true; // Track if the component is mounted

      const initializeCardField = async () => {
        try {
          // Fetch the payment token from your Netlify function
          const response = await fetch("/.netlify/functions/create-revolut-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, currency }),
          });

          if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Failed to retrieve payment token: ${errBody}`);
          }

          const { token } = await response.json();
          console.log('🎟️ Revolut token:', token);
          if (!token) {
            throw new Error("Server did not return a valid payment token.");
          }

          // Wait for the RevolutCheckout library to be ready
          const RC = await RevolutCheckout(token);

          if (!isMounted) return; // Don't proceed if component unmounted

          const cardField = RC.createCardField({
            target: cardFieldRef.current,
            onSuccess() {
              setError(null);
              onPaymentSuccess("Payment successful!");
            },
            onError(message) {
              const errorMessage = `Payment failed: ${message}`;
              setError(errorMessage);
              onPaymentError(message);
            },
            // It's good practice to style the card field
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
          // Provide a user-friendly error message
          setError(
            "Could not load the payment form. This may be due to an ad blocker. Please try disabling it or use a different browser."
          );
          onPaymentError(err.message);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      // Only initialize if there's an amount to pay
      if (amount > 0) {
        initializeCardField();
      } else {
        setIsLoading(false);
      }

      // Cleanup function to run when the component unmounts
      return () => {
        isMounted = false;
        if (cardInstanceRef.current && typeof cardInstanceRef.current.destroy === "function") {
          cardInstanceRef.current.destroy();
          cardInstanceRef.current = null;
        }
      };
    }, [amount, currency, onPaymentSuccess, onPaymentError]); // Dependencies for the useEffect hook

    // Expose a `submit` method via the ref
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

    // Render loading/error states
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
