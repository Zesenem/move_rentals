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

// Sub-components (CartItem, MbWayPayment) are assumed to be in separate files or defined here.
// They are included for completeness and context.

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

  // --- MODIFICATION START ---
  // States to hold either the embedded payment token or the fallback URL
  const [revolutOrderToken, setRevolutOrderToken] = useState(null);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  // --- MODIFICATION END ---

  const {
    mutate: fetchRevolutOrder,
    isPending: isFetchingOrder,
    error: fetchOrderError,
    data: revolutOrderData,
  } = useMutation({
    mutationFn: createRevolutOrderToken,
    // --- MODIFICATION START ---
    // Update onSuccess to handle both token and checkoutUrl responses
    onSuccess: (data) => {
      console.log("✅ Received revolut order token response:", data);
      if (data.token) {
        setRevolutOrderToken(data.token);
        setCheckoutUrl(null); // Ensure fallback URL is cleared
      } else if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
        setRevolutOrderToken(null); // Ensure token is cleared
      } else {
        console.warn("⚠️ Neither token nor checkoutUrl was returned from the API.");
      }
    },
    // --- MODIFICATION END ---
    onError: (error) => {
      console.error("❌ Error fetching Revolut order:", error);
    },
  });

  const orderRequestedRef = useRef(false);

  useEffect(() => {
    // This effect triggers the API call to get a payment token/URL
    if (
      paymentMethod === "revolut" &&
      total > 0 &&
      !revolutOrderToken &&
      !checkoutUrl && // Also check for checkoutUrl
      !isFetchingOrder &&
      !orderRequestedRef.current
    ) {
      orderRequestedRef.current = true;
      fetchRevolutOrder({ amount: total, currency: "EUR" });
    }
  }, [paymentMethod, total, revolutOrderToken, checkoutUrl, isFetchingOrder, fetchRevolutOrder]);

  useEffect(() => {
    // This effect resets the payment details if the method or total changes
    if (paymentMethod !== "revolut" || total === 0) {
      orderRequestedRef.current = false;
      setRevolutOrderToken(null);
      setCheckoutUrl(null); // Also reset the checkoutUrl
    }
  }, [paymentMethod, total]);

  const { mutate: submitOrderAndPayment, isPending: isProcessingPaymentAndOrder } = useMutation({
    mutationFn: processRevolutPaymentAndOrder,
    onSuccess: (order) => {
      clearCart();
      navigate(`/booking-success/${order.id}`);
    },
  });

  const handlePaymentSuccess = useCallback(
    (paymentResult) => {
      submitOrderAndPayment({
        cartItems: items,
        customerDetails,
        revolutPaymentId: paymentResult.id,
        totalAmount: total,
        currency: "EUR",
        revolutOrderId: revolutOrderData?.orderId,
      });
    },
    [submitOrderAndPayment, items, customerDetails, total, revolutOrderData]
  );

  const handlePaymentError = useCallback((error) => {
    // Using a more robust way to show errors is recommended, but alert works for now
    alert(`Payment failed: ${error.message || "Please check your card details"}`);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!customerDetails.firstName.trim()) errors.firstName = "First name is required";
    if (!customerDetails.lastName.trim()) errors.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email))
      errors.email = "Please enter a valid email address";
    if (!customerDetails.phone || !isPossiblePhoneNumber(customerDetails.phone))
      errors.phone = "Please enter a valid phone number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    localStorage.setItem("customerDetails", JSON.stringify(customerDetails));

    // This form submission is only for the embedded card field flow
    if (paymentMethod === "revolut" && revolutCardRef.current && revolutOrderToken) {
      const revolutPayload = {
        name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        email: customerDetails.email,
        phone: customerDetails.phone,
      };
      revolutCardRef.current.submit(revolutPayload);
    }
    // Note: The redirect flow is handled by its own button, not the main form submit
  };

  // --- MODIFICATION START ---
  // Handler for the redirect fallback button
  const handleRedirectToRevolut = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };
  // --- MODIFICATION END ---

  const handleCustomerDetailsChange = (e) => {
    const { id, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [id]: value }));
  };
  const handlePhoneChange = (phone) => {
    setCustomerDetails((prev) => ({ ...prev, phone }));
  };
  const paymentSelectorClasses = (method) =>
    `flex items-center justify-center gap-2 p-3 rounded-md transition-all font-semibold w-full ${
      paymentMethod === method
        ? "bg-cloud text-phantom scale-105"
        : "bg-phantom text-space hover:bg-phantom/70"
    }`;

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
                {/* Customer Details Form Fields... */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-space mb-1"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={customerDetails.firstName}
                      onChange={handleCustomerDetailsChange}
                      className="w-full bg-phantom border border-graphite rounded-md p-3 text-cloud"
                      required
                    />
                    {formErrors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-space mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={customerDetails.lastName}
                      onChange={handleCustomerDetailsChange}
                      className="w-full bg-phantom border border-graphite rounded-md p-3 text-cloud"
                      required
                    />
                    {formErrors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-space mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={handleCustomerDetailsChange}
                    className="w-full bg-phantom border border-graphite rounded-md p-3 text-cloud"
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-space mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="phone-input-container">
                    <PhoneInput
                      id="phone"
                      value={customerDetails.phone}
                      onChange={handlePhoneChange}
                      defaultCountry="PT"
                      className="phone-input"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
                  )}
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
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("revolut")}
                    className={paymentSelectorClasses("revolut")}
                  >
                    <FaCreditCard /> Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("mbway")}
                    className={paymentSelectorClasses("mbway")}
                  >
                    <MbWayIcon /> MB WAY
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 p-3 rounded-md bg-phantom text-space/50 cursor-not-allowed"
                  >
                    <FaApple /> Apple Pay
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 p-3 rounded-md bg-phantom text-space/50 cursor-not-allowed"
                  >
                    <FaGoogle /> Google Pay
                  </button>
                </div>

                {/* --- MODIFICATION START --- */}
                {/* This section now conditionally renders the correct payment UI */}
                <div className="pt-4 min-h-[100px]">
                  {paymentMethod === "revolut" && (
                    <>
                      {isFetchingOrder && (
                        <p className="text-center text-space">Initializing Payment...</p>
                      )}

                      {fetchOrderError && !checkoutUrl && (
                        <p className="text-center text-red-500">
                          Could not initialize payment. Please try again or select a different
                          method.
                        </p>
                      )}

                      {revolutOrderToken && (
                        <RevolutCardField
                          ref={revolutCardRef}
                          orderToken={revolutOrderToken}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                        />
                      )}

                      {checkoutUrl && !revolutOrderToken && (
                        <div>
                          <p className="text-center text-sm text-space mb-4">
                            The embedded card form is unavailable. Please complete your payment on
                            Revolut's secure page.
                          </p>
                          <Button
                            type="button"
                            onClick={handleRedirectToRevolut}
                            className="w-full bg-purple-600 text-white hover:bg-purple-700"
                          >
                            Pay with Revolut
                          </Button>
                        </div>
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
                {/* --- MODIFICATION END --- */}
              </div>

              {/* --- MODIFICATION START --- */}
              {/* The main button is now hidden if the redirect flow is active, */}
              {/* as that flow has its own button. */}
              {!(paymentMethod === "revolut" && checkoutUrl) && (
                <Button
                  type="submit"
                  disabled={
                    isProcessingPaymentAndOrder ||
                    isFetchingOrder ||
                    (paymentMethod === "revolut" && !revolutOrderToken)
                  }
                  className="w-full mt-8 py-3 text-lg"
                >
                  {isFetchingOrder
                    ? "Initializing..."
                    : isProcessingPaymentAndOrder
                    ? "Processing..."
                    : "Pay & Confirm Booking"}
                </Button>
              )}
              {/* --- MODIFICATION END --- */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
