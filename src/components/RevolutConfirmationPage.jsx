import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { processRevolutPaymentAndOrder } from "../services/twice";
import { useCartStore } from "../store/cartStore";

function RevolutConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart, items } = useCartStore();

  const { mutate: finalizeOrder } = useMutation({
    mutationFn: processRevolutPaymentAndOrder,
    onSuccess: (order) => {
      clearCart();
      navigate(`/booking-success/${order.id}`);
    },
    onError: (err) => {
      console.error("Finalization error", err);
      alert("Something went wrong finalizing your booking.");
      navigate("/checkout");
    },
  });

  useEffect(() => {
    const revolutPaymentId = searchParams.get("payment_id");
    const revolutOrderId = searchParams.get("order_id");

    if (revolutPaymentId && revolutOrderId) {
      const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));

      finalizeOrder({
        cartItems: items,
        customerDetails,
        revolutPaymentId,
        revolutOrderId,
        totalAmount: items.reduce((acc, item) => acc + item.totalPrice, 0),
        currency: "EUR",
      });
    } else {
      navigate("/checkout");
    }
  }, []);

  return <p className="text-center text-cloud">Processing your order...</p>;
}

export default RevolutConfirmationPage;
