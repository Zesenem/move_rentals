import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  format,
  differenceInCalendarDays,
  eachDayOfInterval,
  isToday,
  addHours,
  isSameDay,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { FaCheck, FaShoppingCart, FaClock } from "react-icons/fa";
import { RingLoader } from "react-spinners";

import { getUnavailableDates } from "../services/twice.js";
import { useCartStore } from "../store/cartStore.js";
import { calculateTieredPrice, calculateExtrasTotal } from "../utils/priceCalculator.js";
import Button from "./Button";

const generateTimeSlots = (interval = 30, minTime = "08:00") => {
  const slots = [];
  const startTime = 8 * 60;
  const endTime = 18 * 60 + 30;

  const [minHours, minMinutes] = minTime.split(":").map(Number);
  const minTimeInMinutes = minHours * 60 + minMinutes;

  let loopStartTime = Math.max(startTime, minTimeInMinutes);

  if (loopStartTime > endTime) return [];
  if (loopStartTime % interval !== 0) {
    loopStartTime = loopStartTime - (loopStartTime % interval) + interval;
  }

  for (let timeInMinutes = loopStartTime; timeInMinutes <= endTime; timeInMinutes += interval) {
    const hours = Math.floor(timeInMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (timeInMinutes % 60).toString().padStart(2, "0");
    slots.push(`${hours}:${minutes}`);
  }
  return slots;
};

const PriceBreakdown = ({ basePricePerDay, numberOfDays, extrasPrice, totalPrice }) => (
  <div className="space-y-3 text-sm">
    <div className="flex justify-between text-steel">
      <span>Base price per day</span>
      <span className="font-semibold text-cloud">€{basePricePerDay.toFixed(2)}</span>
    </div>
    {numberOfDays > 0 && (
      <div className="flex justify-between text-steel">
        <span>Duration</span>
        <span className="font-semibold text-cloud">{numberOfDays} day(s)</span>
      </div>
    )}
    {extrasPrice > 0 && (
      <div className="flex justify-between text-steel">
        <span>Extras</span>
        <span className="font-semibold text-cloud">+ €{extrasPrice.toFixed(2)}</span>
      </div>
    )}
    <div className="!mt-4 flex items-center justify-between border-t border-graphite/50 pt-4">
      <span className="text-xl font-bold text-cloud">Total Price</span>
      <span
        key={totalPrice}
        className="animate-[pulse_0.5s_ease-in-out] text-2xl font-bold text-cloud"
      >
        {totalPrice > 0 ? `€${totalPrice.toFixed(2)}` : "€--.--"}
      </span>
    </div>
  </div>
);

function BookingWidget({ bike, selectedExtras }) {
  const [range, setRange] = useState();
  const [isAdded, setIsAdded] = useState(false);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [error, setError] = useState(null);

  const { items: cartItems, addItem: addItemToCart } = useCartStore();

  const {
    data: allBookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["availability", bike.id],
    queryFn: () => getUnavailableDates(bike.id),
    enabled: !!bike.id,
    initialData: [],
  });

  const combinedBookings = useMemo(() => {
    const cartBookings = cartItems
      .filter((item) => item.id.startsWith(bike.id))
      .map((item) => ({
        startDate: item.range.from,
        endDate: item.range.to,
        pickupTime: item.pickupTime,
      }));
    return [...allBookings, ...cartBookings];
  }, [allBookings, cartItems, bike.id]);

  const disabledDatesSet = useMemo(() => {
    const dates = new Set();
    combinedBookings.forEach((booking) => {
      const interval = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
      interval.forEach((date) => dates.add(format(date, "yyyy-MM-dd")));
    });
    return dates;
  }, [combinedBookings]);

  const disabledDatesForPicker = useMemo(() => {
    const dates = Array.from(disabledDatesSet).map((dateStr) => new Date(dateStr));
    return [{ before: new Date() }, ...dates];
  }, [disabledDatesSet]);

  const handleSelect = (selectedRange) => {
    setError(null);
    if (selectedRange?.from && selectedRange?.to) {
      const selectedInterval = eachDayOfInterval({
        from: selectedRange.from,
        to: selectedRange.to,
      });
      const hasOverlap = selectedInterval.some((date) =>
        disabledDatesSet.has(format(date, "yyyy-MM-dd"))
      );

      if (hasOverlap) {
        setError(
          "Your selection includes dates that are already booked. Please choose a different range."
        );
        setRange(undefined);
        return;
      }
    }
    setRange(selectedRange);
  };

  const timeSlots = useMemo(() => {
    if (!range?.from) return generateTimeSlots();

    const dayBefore = new Date(range.from);
    dayBefore.setDate(dayBefore.getDate() - 1);

    const latestReturnBooking = combinedBookings
      .filter((booking) => isSameDay(new Date(booking.endDate), dayBefore))
      .sort((a, b) => b.pickupTime.localeCompare(a.pickupTime))[0];

    let minTime = "08:00";
    if (latestReturnBooking) {
      const [hours, minutes] = latestReturnBooking.pickupTime.split(":").map(Number);
      const returnTime = new Date();
      returnTime.setHours(hours, minutes, 0, 0);
      const availableTime = addHours(returnTime, 1);
      minTime = format(availableTime, "HH:mm");
    }

    if (isToday(range.from)) {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      minTime = currentTime > minTime ? currentTime : minTime;
    }

    return generateTimeSlots(30, minTime);
  }, [range?.from, combinedBookings]);

  useEffect(() => {
    if (timeSlots.length > 0 && !timeSlots.includes(pickupTime)) {
      setPickupTime(timeSlots[0]);
    } else if (timeSlots.length === 0 && range?.from) {
      setPickupTime("");
    }
  }, [timeSlots, pickupTime, range?.from]);

  const numberOfDays = useMemo(() => {
    return range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) + 1 : 0;
  }, [range]);

  useEffect(() => {
    setIsAdded(false);
  }, [range, selectedExtras, pickupTime]);

  const basePrice = calculateTieredPrice(bike.pricingTiers, bike.price_per_day, numberOfDays);
  const extrasPrice = calculateExtrasTotal(selectedExtras, numberOfDays);
  const totalPrice = basePrice + extrasPrice;

  const bookingId = useMemo(
    () =>
      range?.from && range?.to
        ? `${bike.id}-${range.from.toISOString()}-${range.to.toISOString()}-${pickupTime}`
        : null,
    [bike.id, range, pickupTime]
  );

  const isInCart = useMemo(
    () => (bookingId ? cartItems.some((item) => item.id === bookingId) : false),
    [bookingId, cartItems]
  );

  const handleAddToCart = useCallback(() => {
    if (!range?.from || !range?.to || !bike || !pickupTime) return;

    const newItem = {
      id: bookingId,
      name: bike.name,
      image: bike.image_urls?.[0],
      pricePerDay: bike.price_per_day,
      pricingTiers: bike.pricingTiers,
      days: numberOfDays,
      totalPrice: totalPrice,
      range: { from: range.from, to: range.to },
      pickupTime: pickupTime,
      extras: selectedExtras,
    };
    addItemToCart(newItem);
    setIsAdded(true);
  }, [bookingId, bike, numberOfDays, totalPrice, selectedExtras, addItemToCart, range, pickupTime]);

  let footerText = "Please select your rental period.";
  if (range?.from) {
    footerText = range.to
      ? `${format(range.from, "PPP")} – ${format(range.to, "PPP")}`
      : `Selected: ${format(range.from, "PPP")}.`;
  }
  const defaultClassNames = getDefaultClassNames();

  if (isError) {
    return (
      <div className="rounded-lg border border-graphite/50 bg-arsenic p-6 text-center text-red-400">
        <p>Error loading availability. Please try refreshing.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-graphite/50 bg-arsenic p-4 shadow-lg sm:p-6">
      <div className="relative flex justify-center">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-arsenic/80">
            <RingLoader color="#6EE7B7" />
          </div>
        )}
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={disabledDatesForPicker}
          numberOfMonths={1}
          fromDate={new Date()}
          footer={<p className="pt-4 text-center text-sm font-semibold text-steel">{footerText}</p>}
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

      {error && <p className="mt-4 text-center text-sm font-semibold text-red-500">{error}</p>}

      <div className="mt-6 space-y-6 border-t border-graphite/50 pt-6">
        {range?.from && (
          <div>
            <label
              htmlFor="pickupTime"
              className="mb-2 flex items-center gap-2 text-lg font-bold text-cloud"
            >
              <FaClock />
              Pickup Time
            </label>
            {timeSlots.length > 0 ? (
              <select
                id="pickupTime"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full cursor-pointer rounded-md border-graphite/50 bg-phantom p-3 text-cloud focus:border-emerald-500 focus:ring-emerald-500"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-steel">
                No more pickup times available for today. Please select a future date.
              </p>
            )}
          </div>
        )}

        <PriceBreakdown
          basePricePerDay={bike.price_per_day}
          numberOfDays={numberOfDays}
          extrasPrice={extrasPrice}
          totalPrice={totalPrice}
        />
        <div className="mt-6">
          {isAdded ? (
            <div className="animate-[fadeIn_0.5s_ease-in-out] rounded-lg bg-emerald-500/10 p-4 text-center">
              <div className="mb-4 flex items-center justify-center gap-2 font-bold text-emerald-400">
                <FaCheck />
                <span>Added to Cart!</span>
              </div>
              <div className="flex gap-4">
                <Button as={Link} to="/checkout" variant="primary" className="w-full">
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
              disabled={!range?.from || !range?.to || !pickupTime || isInCart}
              className="w-full py-3 text-lg"
              icon={isInCart ? FaCheck : FaShoppingCart}
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
