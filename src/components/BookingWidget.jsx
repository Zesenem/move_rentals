import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getUnavailableDates } from "../services/twice.js";
import { useCartStore } from "../store/cartStore.js";
import Button from "./Button";
import { RingLoader } from "react-spinners";
import { calculateTieredPrice, calculateExtrasTotal } from "../utils/priceCalculator.js";
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

const PriceBreakdown = ({ pricePerDay, numberOfDays, totalPrice }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-steel">
      <span>Base price per day</span>
      <span className="font-semibold">€{pricePerDay.toFixed(2)}</span>
    </div>
    {numberOfDays > 0 && (
      <div className="flex justify-between items-center text-gray-400">
        <span>Selected days</span>
        <span>x {numberOfDays}</span>
      </div>
    )}
    <div className="pt-4 mt-2 border-t border-graphite/50 flex justify-between items-center">
      <span className="text-xl font-bold text-cloud">Total Price</span>
      <span className="text-2xl font-bold text-cloud">
        {totalPrice > 0 ? `€${totalPrice.toFixed(2)}` : "€--.--"}
      </span>
    </div>
  </div>
);

function BookingWidget({ bike, selectedExtras }) {
  const [range, setRange] = useState();
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { items: cartItems, addItem: addItemToCart } = useCartStore();

  const {
    data: apiUnavailableDates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["availability", bike.id],
    queryFn: () => getUnavailableDates(bike.id),
    enabled: !!bike.id,
    initialData: [],
  });

  const cartBookedDates = useMemo(() => {
    const dates = [];
    cartItems.forEach((item) => {
      if (item.id.startsWith(bike.id)) {
        const interval = eachDayOfInterval({
          start: new Date(item.range.from),
          end: new Date(item.range.to),
        });
        dates.push(...interval);
      }
    });
    return dates;
  }, [cartItems, bike.id]);

  const allDisabledDates = useMemo(() => {
    return [{ before: new Date() }, ...apiUnavailableDates, ...cartBookedDates];
  }, [apiUnavailableDates, cartBookedDates]);

  useEffect(() => {
    if (range?.from && range?.to) {
      const days = differenceInCalendarDays(range.to, range.from) + 1;
      setNumberOfDays(days);
    } else {
      setNumberOfDays(0);
    }
    setIsAdded(false);
  }, [range]);

  const basePrice = calculateTieredPrice(bike.pricingTiers, bike.price_per_day, numberOfDays);
  const extrasPrice = calculateExtrasTotal(selectedExtras, numberOfDays);
  const totalPrice = basePrice + extrasPrice;

  const bookingId = range?.from ? `${bike.id}-${range.from.toISOString()}` : null;
  const isInCart = bookingId ? cartItems.some((item) => item.id === bookingId) : false;

  const handleAddToCart = useCallback(() => {
    if (!range?.from || !range?.to || !bike) return;
    const newItem = {
      id: bookingId,
      name: bike.name,
      image: bike.image_urls?.[0],
      pricePerDay: bike.price_per_day,
      pricingTiers: bike.pricingTiers,
      days: numberOfDays,
      totalPrice: totalPrice,
      range: {
        from: range.from,
        to: range.to,
      },
      extras: selectedExtras,
    };
    addItemToCart(newItem);
    setIsAdded(true);
  }, [bookingId, bike, numberOfDays, totalPrice, selectedExtras, addItemToCart, range]);

  let footerText = "Please select the first day of your rental.";
  if (range?.from) {
    if (!range.to) {
      footerText = `Selected: ${format(range.from, "PPP")}.`;
    } else {
      footerText = `${format(range.from, "PPP")} – ${format(range.to, "PPP")}`;
    }
  }

  const defaultClassNames = getDefaultClassNames();
  const today = new Date();

  if (isError) {
    return (
      <div className="bg-arsenic p-6 rounded-lg border border-graphite/50 text-center text-red-400">
        <p>Error loading availability.</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="bg-arsenic p-4 sm:p-6 rounded-lg border border-graphite/50 shadow-lg">
      <div className="relative flex justify-center">
        {isLoading && (
          <div className="absolute inset-0 bg-arsenic/80 flex items-center justify-center z-20 rounded-lg">
            <RingLoader color="#6EE7B7" />
          </div>
        )}
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={allDisabledDates}
          numberOfMonths={1}
          fromDate={today}
          footer={<p className="text-center pt-4 text-steel font-semibold text-sm">{footerText}</p>}
          classNames={{
            root: `${defaultClassNames.root} shadow-lg p-5 bg-zinc-100`,
            caption: "flex justify-between items-center h-12 px-1",
            caption_label: "text-lg font-bold text-gray-700",
            nav_button: "h-9 w-9 flex items-center justify-center hover:bg-gray-200 rounded-full",
            table: "border-collapse w-full mt-2",
            head_row: "flex text-gray-500 mb-2",
            head_cell: "w-full h-10 flex items-center justify-center font-semibold text-sm",
            row: "flex w-full mt-1",
            cell: "w-full h-12 flex items-center justify-center text-base relative",
            day: "group w-10 h-10 m-1 rounded-full transition-colors",
            day_today: "text-orange-600 font-bold",
            day_selected: "bg-orange-700 text-white",
            day_range_middle: "bg-orange-700/20 rounded-none",
            day_range_start: "rounded-r-none",
            day_range_end: "rounded-l-none",
            day_outside: "text-gray-400",
            day_disabled: "text-gray-300 cursor-not-allowed",
          }}
          components={{
            DayButton: (props) => {
              const { className, ...buttonProps } = props;
              return (
                <button
                  {...buttonProps}
                  type="button"
                  className={`
                                        ${className}
                                        text-zinc-950
                                        bg-zinc-200
                                        w-10 h-10
                                        group-aria-selected:bg-orange-700
                                        group-aria-selected:text-white
                                        rounded-full
                                    `}
                />
              );
            },
          }}
        />
      </div>

      <div className="mt-6 border-t border-graphite/50 pt-6">
        <PriceBreakdown
          pricePerDay={bike.price_per_day}
          numberOfDays={numberOfDays}
          totalPrice={totalPrice}
        />
        <div className="mt-6">
          {isAdded ? (
            <div className="text-center p-4 bg-emerald-500/10 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold mb-4">
                <FaCheck />
                <span>Added to Cart!</span>
              </div>
              <div className="flex gap-4">
                <Button as="Link" to="/checkout" variant="primary" className="w-full">
                  View Cart
                </Button>
                <Button onClick={() => setIsAdded(false)} variant="ghost" className="w-full">
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={!range?.from || !range?.to || isInCart}
              className="w-full py-3 text-lg flex items-center justify-center gap-2"
            >
              {isInCart ? "Already in Cart" : "Add to Cart"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingWidget;
