import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";

const RevolutCardField = forwardRef(({ orderToken, onPaymentSuccess, onPaymentError }, ref) => {
  const containerRef = useRef(null);
  const cardFieldRef = useRef(null);
  const revolutInstance = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSdkReady, setIsSdkReady] = useState(false);

  const loadRevolutScript = () => {
    if (document.getElementById("revolut-embed-script")) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = "revolut-embed-script";
      script.src = "https://merchant.revolut.com/embed.js";
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
      if (!orderToken) {
        setIsSdkReady(false);
        return;
      }

      try {
        setErrorMessage(null);
        setIsSdkReady(false);

        await loadRevolutScript();
        const RevolutCheckoutSDK = await waitForRevolutCheckout();
        revolutInstance.current = await RevolutCheckoutSDK(orderToken);

        if (!containerRef.current) {
          setErrorMessage("Revolut container element not found. Please refresh.");
          return;
        }

        if (revolutInstance.current) {
          cardFieldRef.current = revolutInstance.current.createCardField({
            target: containerRef.current,
            style: {
              base: {
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
                color: "#C0C0C0",
                "::placeholder": {
                  color: "#808080",
                },
              },
              invalid: {
                color: "#EF4444",
              },
            },
          });

          if (cardFieldRef.current) {
            cardFieldRef.current.mount();
            setIsSdkReady(true);
          } else {
            setErrorMessage(
              "Failed to create card input fields. Invalid public key or environment?"
            );
          }
        } else {
          setErrorMessage("Payment form failed to load. Please refresh.");
        }
      } catch (error) {
        console.error("Failed to load Revolut SDK or initialize:", error);
        setErrorMessage("Error loading payment system: " + (error.message || "Unknown error"));
      }
    };

    initRevolut();

    return () => {
      if (cardFieldRef.current) {
        cardFieldRef.current.destroy();
      }
      setIsSdkReady(false);
    };
  }, [orderToken]);

  useImperativeHandle(ref, () => ({
    submit: async (customerDetails) => {
      if (!cardFieldRef.current || !revolutInstance.current || !isSdkReady) {
        throw new Error("Revolut card field not initialized or ready.");
      }

      try {
        const result = await cardFieldRef.current.submit({
          email: customerDetails.email,
          phone: customerDetails.phone,
          name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        });

        if (["AUTHORIZED", "CAPTURED"].includes(result.status)) {
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
      <div
        ref={containerRef}
        className="revolut-card-field-container p-4 border border-graphite rounded-md"
      ></div>
      <div className="flex justify-end mt-2 text-sm text-space">
        <p>Powered by Revolut</p>
      </div>
    </div>
  );
});

export default RevolutCardField;
