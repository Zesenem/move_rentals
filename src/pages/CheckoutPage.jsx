import { useState, useRef, useCallback } from 'react';
import { useCartStore } from '../store/cartStore';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '../services/twice.js';
import Button from '../components/Button';
import { FaTrash, FaCreditCard } from 'react-icons/fa';
import MbWayIcon from '../components/icons/MbWayIcon';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import RevolutCardField from '../components/RevolutCardField';

const CartItem = ({ item, onRemove }) => (
    <li className="flex flex-col sm:items-center justify-between bg-arsenic p-4 rounded-lg sm:flex-row gap-4">
        <div className="flex items-center">
            <img src={item.image} alt={item.name} className="w-24 h-16 object-cover rounded-md mr-4" />
            <div>
                <h2 className="font-bold text-cloud">{item.name}</h2>
                <p className="text-sm text-space">
                    {format(item.range.from, 'MMM d, yyyy')} to {format(item.range.to, 'MMM d, yyyy')}
                </p>
                <p className="text-sm font-semibold text-steel">{item.days} days</p>
                {item.extras && Object.keys(item.extras).length > 0 && (
                    <div className="mt-2 border-t border-graphite/20 pt-2">
                        <h3 className="text-xs font-bold text-steel uppercase">Extras:</h3>
                        <ul className="text-sm text-space list-inside">
                            {Object.values(item.extras).map(extra => (
                                <li key={extra.id}>- {extra.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
        <div className="text-right sm:text-right w-full sm:w-auto self-end sm:self-center">
            <p className="font-bold text-lg text-cloud mb-1">€{item.totalPrice.toFixed(2)}</p>
            <button onClick={() => onRemove(item.id)} className="text-space hover:text-red-500 transition-colors">
                <FaTrash />
            </button>
        </div>
    </li>
);

const inputStyles = "w-full bg-phantom border border-graphite rounded-md p-3 text-cloud focus:ring-cloud focus:border-cloud";

const MbWayPayment = () => (
    <div>
        <p className="text-center text-sm text-space mb-4">
            You will receive a notification in the MB WAY app to approve this payment.
        </p>
        <div>
            <label htmlFor="phone-number" className="block text-sm font-medium text-space mb-1">Phone Number</label>
            <input type="tel" id="phone-number" placeholder="+351 ••• ••• •••" className={inputStyles} />
        </div>
    </div>
);

function CheckoutPage() {
    const { items, removeItem, clearCart, getCartTotal } = useCartStore();
    const total = getCartTotal();
    const navigate = useNavigate();
    const revolutCardRef = useRef();
    const [paymentMethod, setPaymentMethod] = useState('revolut');
    const [customerDetails, setCustomerDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const { mutate: processOrder, isPending: isCreatingOrder, error: orderError } = useMutation({
        mutationFn: createOrder,
        onSuccess: (order) => {
            clearCart();
            navigate(`/booking-success/${order.id}`);
        },
    });

    const handlePaymentSuccess = useCallback(() => {
        console.log("Payment successful! Creating order in Twice...");
        processOrder({ cartItems: items, customerDetails });
    }, [processOrder, items, customerDetails]);

    const handlePaymentError = useCallback((errorMessage) => {
        console.error("Payment failed:", errorMessage);
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (paymentMethod === 'revolut') {
            if (revolutCardRef.current) {
                revolutCardRef.current.submit(customerDetails);
            }
        } else {
            console.log('Submitting MB WAY payment...');
            handlePaymentSuccess();
        }
    };

    const paymentSelectorClasses = (method) => 
        `flex items-center justify-center gap-2 p-3 rounded-md transition-all font-semibold w-full ${
            paymentMethod === method ? 'bg-cloud text-phantom scale-105' : 'bg-phantom text-space hover:bg-phantom/70'
        }`;

    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-steel mb-4">Your Cart is Empty</h1>
                <p className="text-space">Looks like you haven't added any rentals yet.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-extrabold text-steel mb-8">Review Your Rental</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-cloud mb-4">Your Items</h2>
                            <ul className="space-y-4">
                                {items.map((item) => (
                                    <CartItem key={item.id} item={item} onRemove={removeItem} />
                                ))}
                            </ul>
                        </div>
                        <div className="bg-arsenic p-6 rounded-lg">
                            <h2 className="text-2xl font-bold text-cloud mb-4">Your Details</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-space mb-1">First Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="firstName" value={customerDetails.firstName} onChange={(e) => setCustomerDetails({...customerDetails, firstName: e.target.value})} className={inputStyles} required />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-space mb-1">Last Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="lastName" value={customerDetails.lastName} onChange={(e) => setCustomerDetails({...customerDetails, lastName: e.target.value})} className={inputStyles} required />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-space mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" value={customerDetails.email} onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})} className={inputStyles} required />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-space mb-1">Phone Number <span className="text-red-500">*</span></label>
                                    <input type="tel" name="phone" value={customerDetails.phone} onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} className={inputStyles} required />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-arsenic p-6 rounded-lg sticky top-24">
                            <h2 className="text-2xl font-bold text-cloud border-b border-graphite/50 pb-4 mb-4">Complete Your Booking</h2>
                            <div className="flex justify-between font-bold text-xl text-cloud my-4">
                                <span>Total</span>
                                <span>€{total.toFixed(2)}</span>
                            </div>
                            <div className="space-y-4 mt-8">
                                <h3 className="text-lg font-semibold text-cloud">Payment Method</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => setPaymentMethod('revolut')} className={paymentSelectorClasses('revolut')}>
                                        <FaCreditCard /> Card
                                    </button>
                                    <button type="button" onClick={() => setPaymentMethod('mbway')} className={paymentSelectorClasses('mbway')}>
                                        <MbWayIcon /> MB WAY
                                    </button>
                                </div>
                                <div className="pt-4">
                                    {paymentMethod === 'revolut' && (
                                        <RevolutCardField
                                            ref={revolutCardRef}
                                            amount={total}
                                            currency="EUR"
                                            onPaymentSuccess={handlePaymentSuccess}
                                            onPaymentError={handlePaymentError}
                                        />
                                    )}
                                    {paymentMethod === 'mbway' && <MbWayPayment />}
                                </div>
                            </div>
                            <Button type="submit" disabled={isCreatingOrder} className="w-full mt-8 py-3 text-lg">
                                {isCreatingOrder ? 'Processing...' : `Pay & Confirm Booking`}
                            </Button>
                            {orderError && (
                                <p className="text-red-400 text-center mt-4">{orderError.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CheckoutPage;