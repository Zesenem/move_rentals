import { useState, useEffect, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, differenceInCalendarDays } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { checkAvailability } from '../services/twice.js';
import { useCartStore } from '../store/cartStore.js';
import Button from './Button';

const calendarStyles = `
  .rdp { --rdp-cell-size: 44px; --rdp-accent-color: #6EE7B7; --rdp-background-color: #40424D; --rdp-accent-color-dark: #6EE7B7; --rdp-background-color-dark: #40424D; border: 1px solid #40424D; border-radius: 0.5rem; color: #D3D6E0; }
  .rdp-head_cell { color: #9DA2B3; }
  .rdp-caption_label { font-weight: 700; color: #EDEFF7; }
  .rdp-nav_button { border-radius: 99px; }
  .rdp-day { color: #EDEFF7; }
  .rdp-day_outside { color: #6E7180; }
  .rdp-day_disabled { color: #40424D; }
`;

const PriceBreakdown = ({ pricePerDay, numberOfDays, totalPrice }) => (
  <>
    <div className="flex justify-between items-center mb-1"><span className="text-steel">Price per day</span><span className="font-semibold text-steel">€{pricePerDay.toFixed(2)}</span></div>
    <div className="flex justify-between items-center mb-4"><span className="text-steel">{numberOfDays > 0 ? `x ${numberOfDays} days` : 'Select dates to see price'}</span></div>
    <div className="flex justify-between items-center mb-4 border-t border-graphite/50 pt-4"><span className="text-xl font-bold text-cloud">Total Price</span><span className="text-2xl font-bold text-cloud">{totalPrice > 0 ? `€${totalPrice.toFixed(2)}` : '€--.--'}</span></div>
  </>
);

const ActionArea = ({ isPending, isSuccess, isError, data, error, onCheck, onAddToCart, range }) => (
  <div className="h-16 flex flex-col justify-center">
    {isSuccess ? (
      <>
        <p className="text-center text-status-available font-semibold mb-2">{data.message}</p>
        <Button onClick={onAddToCart} className="w-full py-3 text-lg">Add to Cart</Button>
      </>
    ) : (
      <Button className="w-full py-3 text-lg" disabled={!range?.from || !range?.to || isPending} onClick={onCheck}>
        {isPending ? 'Checking...' : 'Check Availability'}
      </Button>
    )}
    {isError && (<p className="text-center text-red-500 font-semibold mt-2">{error.message}</p>)}
  </div>
);

function BookingWidget({ bike }) {
  const [range, setRange] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const addItemToCart = useCartStore((state) => state.addItem);

  const { 
    mutate: runCheckAvailability, 
    reset: resetAvailability, 
    isPending, 
    isSuccess, 
    isError, 
    data: availabilityData, 
    error: availabilityError 
  } = useMutation({
    mutationFn: checkAvailability,
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
  });

  useEffect(() => {
    if (range?.from && range?.to) {
      const days = differenceInCalendarDays(range.to, range.from) + 1;
      setNumberOfDays(days);
      setTotalPrice(days * bike.price_per_day);
      resetAvailability();
    } else {
      setNumberOfDays(0);
      setTotalPrice(0);
    }
  }, [range, bike.price_per_day, resetAvailability]);

  const handleCheckAvailability = useCallback(() => {
    if (range?.from && range?.to) {
      runCheckAvailability({
        productId: bike.id,
        startDate: range.from,
        endDate: range.to,
      });
    }
  }, [range, bike.id, runCheckAvailability]);

  const handleAddToCart = useCallback(() => {
    if (!range?.from || !range?.to || !bike) return;
    const newItem = {
      id: `${bike.id}-${range.from.toISOString()}`,
      name: bike.name,
      image: bike.image_urls[0],
      pricePerDay: bike.price_per_day,
      days: numberOfDays,
      totalPrice: totalPrice,
      range: { from: format(range.from, 'PPP'), to: format(range.to, 'PPP') },
    };
    addItemToCart(newItem);
  }, [range, bike, numberOfDays, totalPrice, addItemToCart]);

  let footer = <p>Please pick the first day of your rental.</p>;
  if (range?.from) {
    if (!range.to) {
      footer = <p>Selected: {format(range.from, 'PPP')}</p>;
    } else if (range.to) {
      footer = <p>{format(range.from, 'PPP')} – {format(range.to, 'PPP')}</p>;
    }
  }

  return (
    <div className="bg-arsenic p-6 rounded-lg border border-graphite/50">
      <style>{calendarStyles}</style>
      <div className="flex justify-center">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          footer={<div className="text-center pt-4 text-cloud font-semibold">{footer}</div>}
          numberOfMonths={1}
          fromDate={new Date()}
          styles={{ caption: { textTransform: 'capitalize' } }}
        />
      </div>
      <div className="mt-6 border-t border-graphite/50 pt-6">
        <PriceBreakdown 
          pricePerDay={bike.price_per_day} 
          numberOfDays={numberOfDays}
          totalPrice={totalPrice}
        />
        <ActionArea 
          isPending={isPending}
          isSuccess={isSuccess}
          isError={isError}
          data={availabilityData}
          error={availabilityError}
          onCheck={handleCheckAvailability}
          onAddToCart={handleAddToCart}
          range={range}
        />
      </div>
    </div>
  );
}

export default BookingWidget;
