import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

const RevolutCardField = forwardRef(
  ({ amount, currency, onPaymentSuccess, onPaymentError }, ref) => {
    const containerRef = useRef(null);
    const cardFieldRef = useRef(null);
    const [rc, setRc] = useState(null);

    // Load Revolut SDK script manually
    const loadRevolutScript = () => {
      return new Promise((resolve, reject) => {
        if (window.RevolutCheckout) {
          return resolve(window.RevolutCheckout);
        }

        const script = document.createElement('script');
        script.src = 'https://merchant.revolut.com/embed.js';
        script.async = true;
        script.onload = () => resolve(window.RevolutCheckout);
        script.onerror = () => reject(new Error('Failed to load Revolut script'));
        document.body.appendChild(script);
      });
    };

    // Initialize Revolut Checkout SDK and card field
    useEffect(() => {
      let revolutInstance;

      loadRevolutScript()
        .then((RevolutCheckout) => RevolutCheckout({ publicKey: import.meta.env.VITE_REVOLUT_PUBLIC_KEY }))
        .then((revolut) => {
          revolutInstance = revolut;
          setRc(revolut);
          return revolut.createCardField({
            element: containerRef.current,
            style: {},
            amount,
            currency,
          });
        })
        .then((cardField) => {
          cardFieldRef.current = cardField;
        })
        .catch((err) => {
          console.error('Revolut Checkout init error', err);
          onPaymentError(err);
        });

      return () => {
        // Cleanup if necessary in future
      };
    }, [amount, currency, onPaymentError]);

    // Expose submit() to parent via ref
    useImperativeHandle(ref, () => ({
      submit: async (customerDetails) => {
        if (!cardFieldRef.current || !rc) {
          throw new Error('Revolut not ready');
        }
        try {
          // Collect card details and get a payment token
          const paymentToken = await cardFieldRef.current.submit({
            billingDetails: {
              name: `${customerDetails.firstName} ${customerDetails.lastName}`,
              email: customerDetails.email,
              phone: customerDetails.phone,
            },
          });

          // Launch payment modal
          const result = await rc.startPayment({ paymentToken });
          if (['AUTHORIZED', 'CAPTURED'].includes(result.status)) {
            onPaymentSuccess(result);
          } else {
            onPaymentError(result);
          }
        } catch (err) {
          onPaymentError(err);
        }
      },
    }));

    return <div ref={containerRef} style={{ minHeight: '200px' }} />;
  }
);

export default RevolutCardField;
