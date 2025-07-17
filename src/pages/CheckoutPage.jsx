import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { initiateCheckout } from "../services/twice.js";
import Button from "../components/Button";
import { FaTrash, FaLock } from "react-icons/fa";

const CartItem = ({ item, onRemove }) => (
  <li className="flex flex-col gap-4 rounded-lg bg-arsenic p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-4">
      <img src={item.image} alt={item.name} className="h-20 w-28 rounded-md object-cover" />
      <div>
        <h2 className="text-xl font-bold text-cloud">{item.name}</h2>
        <p className="mt-1 text-base text-space">
          {format(new Date(item.range.from), "MMM d, yyyy")} to{" "}
          {format(new Date(item.range.to), "MMM d, yyyy")}
        </p>
        <p className="text-sm font-semibold text-steel">
          {item.days} {item.days === 1 ? "day" : "days"}
        </p>
      </div>
    </div>
    <div className="flex items-center justify-between sm:w-auto sm:flex-col sm:items-end sm:text-right">
      <p className="mb-1 text-xl font-bold text-cloud">€{item.totalPrice.toFixed(2)}</p>
      <button
        onClick={() => onRemove(item.id)}
        className="text-space transition-colors hover:text-red-500"
        aria-label={`Remove ${item.name} from cart`}
      >
        <FaTrash />
      </button>
    </div>
  </li>
);

function CheckoutPage() {
  const { items, removeItem, getCartTotal } = useCartStore();
  const total = getCartTotal();

  const [formErrors, setFormErrors] = useState({});
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const {
    mutate: handleCheckout,
    isPending,
    error,
  } = useMutation({
    mutationFn: initiateCheckout,
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        localStorage.setItem("customerDetails", JSON.stringify(customerDetails));
        window.location.href = data.checkoutUrl;
      } else {
        setFormErrors({ api: "Could not retrieve payment link. Please try again." });
      }
    },
    onError: (err) => {
      setFormErrors({ api: err.message || "An unknown error occurred." });
    },
  });

  const handleCustomerDetailsChange = (e) => {
    const { id, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [id]: value }));
  };
  const handlePhoneChange = (phone) => {
    setCustomerDetails((prev) => ({ ...prev, phone }));
  };

  const handleSubmit = () => {
    const errors = {};
    if (!customerDetails.firstName.trim()) errors.firstName = "First name is required";
    if (!customerDetails.lastName.trim()) errors.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email))
      errors.email = "Please enter a valid email address";
    if (!customerDetails.phone || !isPossiblePhoneNumber(customerDetails.phone))
      errors.phone = "Please enter a valid phone number";

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      handleCheckout({
        cartItems: items,
        customerDetails: customerDetails,
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center py-20 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-steel">Your Cart is Empty</h1>
          <p className="mt-4 text-lg text-space">Looks like you haven't selected a bike yet.</p>
          <Button as={Link} to="/#fleet-section" variant="primary" className="mt-8">
            Browse Our Fleet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-extrabold text-steel">Review Your Rental</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg bg-arsenic p-6">
            <h2 className="mb-4 text-2xl font-bold text-cloud">Your Items</h2>
            <ul className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onRemove={removeItem} />
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-arsenic p-6">
            <h2 className="mb-4 text-2xl font-bold text-cloud">Your Details</h2>
            {/* FIXED: The form fields have been re-added here */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-space">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={customerDetails.firstName}
                    onChange={handleCustomerDetailsChange}
                    className="w-full rounded-md border border-graphite bg-phantom p-3 text-cloud focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                    required
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-space">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={customerDetails.lastName}
                    onChange={handleCustomerDetailsChange}
                    className="w-full rounded-md border border-graphite bg-phantom p-3 text-cloud focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                    required
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-space">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={customerDetails.email}
                  onChange={handleCustomerDetailsChange}
                  className="w-full rounded-md border border-graphite bg-phantom p-3 text-cloud focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                  required
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-space">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="phone-input-container">
                  <PhoneInput
                    id="phone"
                    value={customerDetails.phone}
                    onChange={handlePhoneChange}
                    defaultCountry="PT"
                    international
                    countryCallingCodeEditable={false}
                  />
                </div>
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg bg-arsenic p-6">
            <h2 className="mb-4 border-b border-graphite/50 pb-4 text-2xl font-bold text-cloud">
              Order Summary
            </h2>
            <div className="my-4 flex justify-between text-xl font-bold text-cloud">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-cloud">Payment Method</h3>
              <div className="flex items-center gap-3 rounded-md bg-phantom p-4">
                <FaLock className="h-6 w-6 flex-shrink-0 text-steel" />
                <div>
                  <p className="font-semibold text-cloud">Secure Redirect</p>
                  <p className="text-sm text-space">via Revolut</p>
                </div>
              </div>
              <p className="text-center text-xs text-graphite">
                You will be redirected to complete your payment securely.
              </p>

              {error && <p className="text-center text-red-500">{error.message}</p>}

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full py-3 text-lg"
              >
                {isPending ? "Processing..." : "Pay & Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
