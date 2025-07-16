import { useRef, useEffect, useImperativeHandle, forwardRef, useState, useCallback } from "react";

/**
 * A React component that securely embeds and manages the Revolut Card Field.
 * It handles SDK loading, initialization, and payment submission.
 *
 * @param {object} props - The component props.
 * @param {string} props.orderToken - The public token for a Revolut order, used to initialize the payment widget.
 * @param {function} props.onPaymentSuccess - Callback function triggered on successful payment authorization.
 * @param {function} props.onPaymentError - Callback function triggered when a payment error occurs.
 * @param {React.Ref} ref - The forwarded ref to expose imperative methods like `submit`.
 */
const RevolutCardField = forwardRef(({ orderToken, onPaymentSuccess, onPaymentError }, ref) => {
  const containerRef = useRef(null);
  const cardFieldRef = useRef(null);
  const revolutInstance = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isReady, setIsReady] = useState(false);

  /**
   * Loads the Revolut embed.js script if it's not already present in the document.
   * @returns {Promise<void>} A promise that resolves when the script is loaded.
   */
  const loadRevolutScript = useCallback(() => {
    if (document.getElementById("revolut-embed-script")) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = "revolut-embed-script";
      script.src = "https://merchant.revolut.com/embed.js"; // This URL is the same for sandbox and production
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Revolut SDK script."));
      document.head.appendChild(script);
    });
  }, []);

  /**
   * Waits for the RevolutCheckout SDK to become available on the window object.
   * @param {number} timeout - Maximum time to wait in milliseconds.
   * @returns {Promise<object>} A promise that resolves with the RevolutCheckout SDK.
   */
  const waitForRevolutCheckout = useCallback((timeout = 5000) => {
    return new Promise((resolve, reject) => {
      let timeLeft = timeout;
      const interval = 100;
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
  }, []);

  // Effect to initialize the Revolut Card Field when the orderToken changes.
  useEffect(() => {
    let isMounted = true;

    const initRevolut = async () => {
      // Don't initialize if there's no token.
      if (!orderToken) {
        setIsReady(false);
        return;
      }

      try {
        setErrorMessage(null);
        setIsReady(false);

        await loadRevolutScript();
        const RevolutCheckoutSDK = await waitForRevolutCheckout();
        
        if (!isMounted) return;

        revolutInstance.current = await RevolutCheckoutSDK(orderToken);

        if (!containerRef.current) {
          throw new Error("Revolut container element not found.");
        }

        // Create and mount the card field instance
        cardFieldRef.current = revolutInstance.current.createCardField({
          target: containerRef.current,
          // You can customize the style of the card field here
          style: {
            base: {
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              color: "#C0C0C0", // Light gray text color for dark mode
              "::placeholder": {
                color: "#808080", // Dimmer placeholder color
              },
            },
            invalid: {
              color: "#EF4444", // Red color for validation errors
            },
          },
        });
        
        cardFieldRef.current.mount();
        setIsReady(true);

      } catch (error) {
        if (isMounted) {
          console.error("Failed to load or initialize Revolut Card Field:", error);
          setErrorMessage(`Error loading payment system: ${error.message || "Unknown error"}`);
        }
      }
    };

    initRevolut();

    // Cleanup function to run when the component unmounts or orderToken changes
    return () => {
      isMounted = false;
      if (cardFieldRef.current) {
        cardFieldRef.current.destroy();
        cardFieldRef.current = null;
      }
      setIsReady(false);
    };
  }, [orderToken, loadRevolutScript, waitForRevolutCheckout]);

  // Expose imperative methods to the parent component via ref
  useImperativeHandle(ref, () => ({
    /**
     * Submits the card details to Revolut for payment processing.
     * @param {object} customerDetails - The customer's billing information.
     */
    submit: async (customerDetails) => {
      if (!cardFieldRef.current || !isReady) {
        throw new Error("Revolut card field is not initialized or ready.");
      }

      try {
        // The `submit` method tokenizes the card details and sends them to Revolut
        const result = await cardFieldRef.current.submit({
          email: customerDetails.email,
          phone: customerDetails.phone,
          name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        });
        
        // Check the result status from Revolut
        if (["AUTHORIZED", "CAPTURED"].includes(result.status)) {
          onPaymentSuccess(result);
        } else {
          // Handle other statuses (e.g., 'PENDING', 'FAILED') as errors
          onPaymentError(new Error(`Payment failed with status: ${result.status}`));
        }
      } catch (error) {
        console.error("Error submitting Revolut payment:", error);
        onPaymentError(new Error(error.message || "Payment submission failed."));
      }
    },
    /**
     * A boolean flag indicating if the card field is mounted and ready for submission.
     */
    isReady: isReady,
  }));

  return (
    <div>
      {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
      {!isReady && !errorMessage && (
        <div className="text-space text-center py-4">Loading payment form...</div>
      )}
      {/* This container is the target for the Revolut Card Field */}
      <div
        ref={containerRef}
        className="revolut-card-field-container p-4 border border-graphite rounded-md"
        style={{ display: isReady ? 'block' : 'none' }} // Only show when ready
      ></div>
      {isReady && (
        <div className="flex justify-end mt-2 text-xs text-space/50">
          <p>Secure payment powered by Revolut</p>
        </div>
      )}
    </div>
  );
});

export default RevolutCardField;

