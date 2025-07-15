import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import RevolutCheckout from '@revolut/checkout';

const RevolutCardField = forwardRef(({ amount, currency, onPaymentSuccess, onPaymentError }, ref) => {
    const cardFieldRef = useRef(null);
    const [cardInstance, setCardInstance] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let instance;

        const createOrderAndMountField = async () => {
            try {
                const response = await fetch('/.netlify/functions/create-revolut-order', {
                    method: 'POST',
                    body: JSON.stringify({ amount, currency }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create Revolut order.');
                }

                const { token } = await response.json();
                if (!token) {
                    throw new Error('Missing order token from Revolut.');
                }

                const RC = await RevolutCheckout(token);
                
                instance = RC.createCardField({
                    target: cardFieldRef.current,
                    onSuccess: onPaymentSuccess,
                    onError: (message) => {
                        setError(message);
                        onPaymentError(message);
                    },
                    styles: {
                        base: {
                            color: '#EDEFF7',
                            '::placeholder': { color: '#6E7180' },
                        },
                    },
                });
                
                setCardInstance(instance);

            } catch {
                const errorMessage = 'Could not initialize payment field. Please try again.';
                setError(errorMessage);
                onPaymentError(errorMessage);
            }
        };

        if (amount > 0) {
            createOrderAndMountField();
        }

        return () => {
            if (instance) {
                instance.destroy();
            }
        };
    }, [amount, currency, onPaymentSuccess, onPaymentError]);

    useImperativeHandle(ref, () => ({
        submit: (customerDetails) => {
            if (cardInstance) {
                cardInstance.submit({
                    name: `${customerDetails.firstName} ${customerDetails.lastName}`,
                    email: customerDetails.email,
                    phone: customerDetails.phone,
                });
            }
        },
    }));

    return (
        <div>
            <div ref={cardFieldRef}></div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
    );
});

export default RevolutCardField;
