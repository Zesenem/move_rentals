import { useState, useRef, useCallback, useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { useMutation } from "@tanstack/react-query";
import { createRevolutOrderToken, processRevolutPaymentAndOrder } from "../services/twice.js";
import Button from "../components/Button";
import { FaTrash, FaCreditCard, FaApple, FaGoogle } from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import MbWayIcon from "../components/icons/MbWayIcon";
import RevolutCardField from "../components/RevolutCardField";

// Sub-component for displaying a single item in the cart
const CartItem = ({ item, onRemove }) => (
  <li className="flex flex-col sm:items-center justify-between bg-arsenic p-6 rounded-lg sm:flex-row gap-6">
    <div className="flex items-center">
      <img src={item.image} alt={item.name} className="w-28 h-20 object-cover rounded-md mr-6" />
      <div>
        <h2 className="font-bold text-xl text-cloud">{item.name}</h2>
        <p className="text-base text-space mt-1">
          {format(new Date(item.range.from), "MMM d, yyyy")} to{" "}
          {format(new Date(item.range.to), "MMM d, yyyy")}
        </p>
        <p className="text-sm font-semibold text-steel">{item.days} days</p>
        {item.extras && Object.keys(item.extras).length > 0 && (
          <div className="mt-3 border-t border-graphite/20 pt-3">
            <h3 className="text-xs font-bold text-steel uppercase tracking-wider">Extras:</h3>
            <ul className="text-sm text-space list-inside mt-1">
              {Object.values(item.extras).map((extra) => (
                <li key={extra.id}>- {extra.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    <div className="text-right sm:text-right w-full sm:w-auto self-end sm:self-center">
      <p className="font-bold text-xl text-cloud mb-1">€{item.totalPrice.toFixed(2)}</p>
      <button
        onClick={() => onRemove(item.id)}
        className="text-space hover:text-red-500 transition-colors"
        aria-label={`Remove ${item.name} from cart`}
      >
        <FaTrash />
      </button>
    </div>
  </li>
);

// Sub-component for MB WAY payment input
const MbWayPayment = ({ phone, setPhone, error }) => (
    <div>
      <p className="text-center text-sm text-space mb-4">
        You will receive a notification in the MB WAY app to approve this payment.
      </p>
      <div>
        <label htmlFor="phone-number-mbway" className="block text-sm font-medium text-space mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="phone-input-container">
          <PhoneInput
            id="phone-number-mbway"
            placeholder="Enter phone number"
            value={phone}
            onChange={setPhone}
            defaultCountry="PT"
            international
            countryCallingCodeEditable={true}
            className="phone-input"
          />
        </div>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );


function CheckoutPage() {
  const { items, removeItem, clearCart, getCartTotal } = useCartStore();
  const total = getCartTotal();
  const navigate = useNavigate();
  const revolutCardRef = useRef(null);

  const [paymentMethod, setPaymentMethod] = useState("revolut");
  const [formErrors, setFormErrors] = useState({});
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [revolutOrderToken, setRevolutOrderToken] = useState(null);

  // --- Mutation to fetch the Revolut Order Token ---
  const {
    mutate: fetchRevolutOrderToken,
    isPending: isFetchingRevolutToken,
    error: fetchRevolutTokenError,
    data: revolutTokenData, // Contains { orderToken, orderId }
  } = useMutation({
    mutationFn: createRevolutOrderToken,
    onSuccess: (data) => {
      // On success, store the public token to initialize the card field
      setRevolutOrderToken(data.orderToken);
    },
    onError: (error) => {
      console.error("Error fetching Revolut order token:", error);
    },
  });

  // --- Effect to fetch the Revolut token when conditions are met ---
  // THIS IS THE CORRECTED PART
  useEffect(() => {
    // Only try to fetch if Revolut is the selected method
    if (paymentMethod === "revolut") {
      // And if we don't already have a token, aren't fetching one, and the cart isn't empty.
      if (!revolutOrderToken && !isFetchingRevolutToken && total > 0) {
        fetchRevolutOrderToken({ amount: total, currency: "EUR" });
      }
    }
  }, [paymentMethod, total]); // The dependency array is now simple and correct


  // --- Mutation to submit the final order after successful payment ---
  const {
    mutate: submitOrderAndPayment,
    isPending: isProcessingPaymentAndOrder,
    error: paymentAndOrderError,
  } = useMutation({
    mutationFn: processRevolutPaymentAndOrder,
    onSuccess: (order) => {
      clearCart();
      navigate(`/booking-success/${order.id}`);
    },
    onError: (error) => {
      console.error("Order or Payment failed:", error);
      alert(`Booking failed: ${error.message || "Please try again."}`);
    },
  });

  // --- Callbacks for the RevolutCardField component ---
  const handlePaymentSuccess = useCallback((revolutPaymentResult) => {
    submitOrderAndPayment({
      cartItems: items,
      customerDetails,
      revolutPaymentId: revolutPaymentResult.id,
      revolutPaymentStatus: revolutPaymentResult.status,
      totalAmount: total,
      currency: "EUR",
      revolutOrderId: revolutTokenData?.orderId,
    });
  }, [submitOrderAndPayment, items, customerDetails, total, revolutTokenData]);

  const handlePaymentError = useCallback((error) => {
    console.error("Payment failed:", error);
    alert(`Payment failed: ${error.message || "Please check your card details"}`);
  }, []);

  // --- Form validation and submission logic ---
  const validateForm = () => {
    const errors = {};
    if (!customerDetails.firstName.trim()) errors.firstName = "First name is required";
    if (!customerDetails.lastName.trim()) errors.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) errors.email = "Please enter a valid email address";
    if (!customerDetails.phone || !isPossiblePhoneNumber(customerDetails.phone)) errors.phone = "Please enter a valid phone number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === "revolut") {
      if (!revolutOrderToken || !revolutCardRef.current?.isReady) {
        alert("Revolut payment is not ready. Please wait.");
        return;
      }
      try {
        await revolutCardRef.current.submit(customerDetails);
      } catch (error) {
        handlePaymentError(error);
      }
    }

    if (paymentMethod === "mbway") {
      console.log("Submitting with MB WAY...");
    }
  };

  const handleCustomerDetailsChange = (e) => {
    const { id, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [id]: value }));
  };

  const handlePhoneChange = (phone) => {
    setCustomerDetails(prev => ({ ...prev, phone }));
  };

  const paymentSelectorClasses = (method) =>
    `flex items-center justify-center gap-2 p-3 rounded-md transition-all font-semibold w-full ${
      paymentMethod === method
        ? "bg-cloud text-phantom scale-105"
        : "bg-phantom text-space hover:bg-phantom/70"
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
      <form onSubmit={handleFormSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-arsenic p-6 rounded-lg">
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
                    <label htmlFor="firstName" className="block text-sm font-medium text-space mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input id="firstName" type="text" value={customerDetails.firstName} onChange={handleCustomerDetailsChange} className="w-full bg-phantom border border-graphite rounded-md p-3 text-cloud focus:ring-cloud focus:border-cloud" required />
                    {formErrors.firstName && <p className="text-red-400 text-sm mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-space mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input id="lastName" type="text" value={customerDetails.lastName} onChange={handleCustomerDetailsChange} className="w-full bg-phantom border border-graphite rounded-md p-3 text-cloud focus:ring-cloud focus:border-cloud" required />
                    {formErrors.lastName && <p className="text-red-400 text-sm mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-space mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input id="email" type="email" value={customerDetails.email} onChange={handleCustomerDetailsChange} className="w-full bg-phantom border border-graphite rounded-md p-3 text-cloud focus:ring-cloud focus:border-cloud" required />
                  {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-space mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="phone-input-container">
                    <PhoneInput id="phone" placeholder="Enter phone number" value={customerDetails.phone} onChange={handlePhoneChange} defaultCountry="PT" international countryCallingCodeEditable={true} className="phone-input" />
                  </div>
                  {formErrors.phone && <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-arsenic p-6 rounded-lg sticky top-24">
              <h2 className="text-2xl font-bold text-cloud border-b border-graphite/50 pb-4 mb-4">
                Complete Your Booking
              </h2>
              <div className="flex justify-between font-bold text-xl text-cloud my-4">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold text-cloud">Payment Method</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPaymentMethod("revolut")} className={paymentSelectorClasses("revolut")}>
                        <FaCreditCard /> Card
                    </button>
                    <button type="button" onClick={() => setPaymentMethod("mbway")} className={paymentSelectorClasses("mbway")}>
                        <MbWayIcon /> MB WAY
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" disabled className="flex items-center justify-center gap-2 p-3 rounded-md bg-phantom text-space/50 cursor-not-allowed">
                        <FaApple /> Apple Pay
                    </button>
                    <button type="button" disabled className="flex items-center justify-center gap-2 p-3 rounded-md bg-phantom text-space/50 cursor-not-allowed">
                        <FaGoogle /> Google Pay
                    </button>
                </div>

                <div className="pt-4 min-h-[100px]">
                  {paymentMethod === "revolut" && (
                    <>
                      {isFetchingRevolutToken && <p className="text-center text-space">Initializing secure payment...</p>}
                      {fetchRevolutTokenError && <p className="text-center text-red-500">Could not load payment form. Please try again.</p>}
                      {revolutOrderToken && (
                        <RevolutCardField
                          ref={revolutCardRef}
                          orderToken={revolutOrderToken}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                        />
                      )}
                    </>
                  )}
                  {paymentMethod === "mbway" && (
                    <MbWayPayment
                      phone={customerDetails.phone}
                      setPhone={handlePhoneChange}
                      error={formErrors.phone}
                    />
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={isProcessingPaymentAndOrder || (paymentMethod === "revolut" && (!revolutOrderToken || isFetchingRevolutToken))}
                className="w-full mt-8 py-3 text-lg"
              >
                {isProcessingPaymentAndOrder || isFetchingRevolutToken ? "Processing..." : `Pay & Confirm Booking`}
              </Button>
              {paymentAndOrderError && <p className="text-red-400 text-center mt-4">{paymentAndOrderError.message}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
