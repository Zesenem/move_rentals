import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import Button from '../components/Button';
import SumUpPayment from '../components/SumUpPayment';
import MbWayPayment from '../components/MbWayPayment';
import { FaTrash, FaCreditCard } from 'react-icons/fa';
import MbWayIcon from '../components/icons/MbWayIcon';

const CartItem = ({ item, onRemove }) => (
  <li className="flex items-start sm:items-center justify-between bg-arsenic p-4 rounded-lg flex-col sm:flex-row gap-4">
    <div className="flex items-center">
      <img src={item.image} alt={item.name} className="w-24 h-16 object-cover rounded-md mr-4" />
      <div>
        <h2 className="font-bold text-cloud">{item.name}</h2>
        <p className="text-sm text-space">{item.range.from} to {item.range.to}</p>
        <p className="text-sm font-semibold text-steel">{item.days} days x €{item.pricePerDay.toFixed(2)}</p>
      </div>
    </div>
    <div className="text-right sm:text-right w-full sm:w-auto">
      <p className="font-bold text-lg text-cloud mb-1">€{item.totalPrice.toFixed(2)}</p>
      <button onClick={() => onRemove(item.id)} className="text-space hover:text-red-500 transition-colors">
        <FaTrash />
      </button>
    </div>
  </li>
);

const PaymentSection = ({ total, onPay }) => {
  const [paymentMethod, setPaymentMethod] = useState('sumup');

  const paymentSelectorClasses = (method) => 
    `flex items-center justify-center gap-2 p-3 rounded-md transition-all font-semibold w-full ${
      paymentMethod === method ? 'bg-cloud text-phantom scale-105' : 'bg-phantom text-space hover:bg-phantom/70'
    }`;

  return (
    <div className="bg-arsenic p-6 rounded-lg sticky top-24">
      <h2 className="text-2xl font-bold text-cloud border-b border-graphite/50 pb-4 mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2 text-space">
        <span>Subtotal</span>
        <span>€{total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-4 text-space">
        <span>Taxes (VAT 23%)</span>
        <span>Included</span>
      </div>
      <div className="flex justify-between font-bold text-xl text-cloud border-t border-graphite/50 pt-4">
        <span>Total</span>
        <span>€{total.toFixed(2)}</span>
      </div>
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-cloud">Payment Method</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setPaymentMethod('sumup')} className={paymentSelectorClasses('sumup')}>
            <FaCreditCard /> Card
          </button>
          <button onClick={() => setPaymentMethod('mbway')} className={paymentSelectorClasses('mbway')}>
            <MbWayIcon /> MB WAY
          </button>
        </div>
        <div className="pt-4">
          {paymentMethod === 'sumup' && <SumUpPayment />}
          {paymentMethod === 'mbway' && <MbWayPayment />}
        </div>
      </div>
      <Button onClick={() => onPay(paymentMethod)} className="w-full mt-6 py-3 text-lg">
        Confirm & Pay €{total.toFixed(2)}
      </Button>
    </div>
  );
};

function CheckoutPage() {
  const { items, removeItem, getCartTotal } = useCartStore();
  const total = getCartTotal();

  const handlePayment = (paymentMethod) => {
    console.log(`Initiating payment for €${total.toFixed(2)} via ${paymentMethod}`);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-steel mb-4">Your Cart is Empty</h1>
        <p className="text-space">Looks like you haven't added any rentals yet.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h1 className="text-4xl font-extrabold text-steel mb-8">Review Your Rental</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <ul className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onRemove={removeItem} />
            ))}
          </ul>
        </div>
        <div className="lg:col-span-1">
          <PaymentSection total={total} onPay={handlePayment} />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;