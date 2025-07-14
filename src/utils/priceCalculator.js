function convertPeriodToDays(period, value) {
  switch (period) {
    case "days":
      return value;
    case "weeks":
      return value * 7;
    case "months":
      return value * 30;
    default:
      return 0;
  }
}

export const calculateTieredPrice = (pricingTiers, basePricePerDay, numberOfDays) => {
  if (!pricingTiers || pricingTiers.length === 0 || numberOfDays <= 0) {
    return basePricePerDay * numberOfDays;
  }

  let bestTier = null;
  pricingTiers.forEach((tier) => {
    const tierDurationDays = convertPeriodToDays(tier.timePeriod, tier.timeValue);
    if (tierDurationDays > 0 && tierDurationDays <= numberOfDays) {
      if (
        !bestTier ||
        tierDurationDays > convertPeriodToDays(bestTier.timePeriod, bestTier.timeValue)
      ) {
        bestTier = tier;
      }
    }
  });

  if (bestTier) {
    const tierDurationDays = convertPeriodToDays(bestTier.timePeriod, bestTier.timeValue);
    const remainingDays = numberOfDays - tierDurationDays;
    const tierPrice = bestTier.price / 100;
    const remainingPrice = remainingDays * basePricePerDay;
    return tierPrice + remainingPrice;
  }

  return basePricePerDay * numberOfDays;
};

export const calculateExtrasTotal = (selectedExtras, numberOfDays) => {
  let total = 0;
  for (const key in selectedExtras) {
    const extra = selectedExtras[key];
    const extraPrice = calculateTieredPrice(extra.pricingTiers, extra.price_per_day, numberOfDays);
    total += extraPrice * (extra.quantity || 1);
  }
  return total;
};
