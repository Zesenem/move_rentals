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
  if (!Array.isArray(pricingTiers) || numberOfDays <= 0) {
    return basePricePerDay * numberOfDays;
  }

  const eligibleTiers = pricingTiers
    .map((tier) => {
      if (
        !tier ||
        typeof tier.timePeriod !== "string" ||
        typeof tier.timeValue === "undefined" ||
        typeof tier.price === "undefined"
      ) {
        return null;
      }
      return {
        ...tier,
        tierDurationInDays: convertPeriodToDays(tier.timePeriod, tier.timeValue),
      };
    })
    .filter(
      (tier) =>
        tier !== null && tier.tierDurationInDays > 0 && tier.tierDurationInDays <= numberOfDays
    );

  if (eligibleTiers.length === 0) {
    return basePricePerDay * numberOfDays;
  }

  eligibleTiers.sort((a, b) => b.tierDurationInDays - a.tierDurationInDays);

  const bestTier = eligibleTiers[0];

  const remainingDays = numberOfDays - bestTier.tierDurationInDays;
  const tierPackagePrice = bestTier.price / 100;
  const remainingDaysPrice = remainingDays * basePricePerDay;

  return tierPackagePrice + remainingDaysPrice;
};

export const calculateExtrasTotal = (selectedExtras, numberOfDays) => {
  if (!selectedExtras || numberOfDays <= 0) {
    return 0;
  }

  return Object.values(selectedExtras).reduce((total, extra) => {
    if (
      !extra ||
      typeof extra.price_per_day === "undefined" ||
      typeof extra.quantity === "undefined"
    ) {
      return total;
    }

    const extraPrice = calculateTieredPrice(
      extra.pricingTiers || [],
      extra.price_per_day / 100,
      numberOfDays
    );
    return total + extraPrice * (extra.quantity || 1);
  }, 0);
};
