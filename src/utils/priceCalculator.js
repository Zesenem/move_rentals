// Helper function to convert various time periods into days
function convertPeriodToDays(period, value) {
  switch (period) {
    case "days":
      return value;
    case "weeks":
      return value * 7;
    case "months":
      // Note: Using 30 days for a month for simplicity.
      // For more accurate calculations across different months,
      // you might need a more sophisticated date library or logic.
      return value * 30;
    default:
      console.warn(`Unknown time period: ${period}. Returning 0 days.`);
      return 0;
  }
}

/**
 * Calculates the tiered price for a rental based on duration and available pricing tiers.
 * If no suitable tiers are found, it defaults to basePricePerDay * numberOfDays.
 *
 * @param {Array<Object>} pricingTiers - An array of pricing tier objects.
 * Each tier object should have:
 * - timePeriod: string ("days", "weeks", "months")
 * - timeValue: number (e.g., 1 for 1 day, 2 for 2 weeks)
 * - price: number (the package price in cents)
 * @param {number} basePricePerDay - The base price per day for the item (e.g., bike).
 * @param {number} numberOfDays - The total number of days for the rental.
 * @returns {number} The calculated total price.
 */
export const calculateTieredPrice = (pricingTiers, basePricePerDay, numberOfDays) => {
  // Ensure pricingTiers is a valid array and numberOfDays is positive
  if (!Array.isArray(pricingTiers) || numberOfDays <= 0) {
    // If input is invalid, return the base price or 0 if numberOfDays is not positive
    return basePricePerDay * numberOfDays;
  }

  // 1. Map tiers to include tierDurationInDays and filter out invalid/unsuitable tiers
  const eligibleTiers = pricingTiers
    .map((tier) => {
      // Basic validation for each tier object to prevent errors
      if (!tier || typeof tier.timePeriod !== 'string' || typeof tier.timeValue === 'undefined' || typeof tier.price === 'undefined') {
        console.warn("Invalid tier object encountered in pricingTiers, skipping:", tier);
        return null; // Return null for invalid tiers
      }
      return {
        ...tier,
        tierDurationInDays: convertPeriodToDays(tier.timePeriod, tier.timeValue),
      };
    })
    .filter((tier) =>
      // Filter out nulls and tiers that don't match the duration criteria
      tier !== null && tier.tierDurationInDays > 0 && tier.tierDurationInDays <= numberOfDays
    );

  // 2. If no eligible tiers are found after filtering, calculate using only base price
  if (eligibleTiers.length === 0) {
    return basePricePerDay * numberOfDays;
  }

  // 3. Sort eligible tiers by tierDurationInDays in descending order
  // This allows us to easily pick the "best" (longest applicable) tier
  eligibleTiers.sort((a, b) => b.tierDurationInDays - a.tierDurationInDays);

  // 4. The 'best' tier is now the first one in the sorted array
  const bestTier = eligibleTiers[0];

  // 5. Calculate the total price based on the best tier and remaining days
  const remainingDays = numberOfDays - bestTier.tierDurationInDays;
  // Convert tier.price from cents to dollars (or your base currency unit)
  const tierPackagePrice = bestTier.price / 100;
  const remainingDaysPrice = remainingDays * basePricePerDay;

  return tierPackagePrice + remainingDaysPrice;
};

/**
 * Calculates the total price of selected extras for a given number of days.
 *
 * @param {Object} selectedExtras - An object where keys are extra IDs and values are extra objects.
 * Each extra object should have:
 * - price_per_day: number (price per day for the extra)
 * - pricingTiers: Array<Object> (optional, if extra has its own tiered pricing)
 * - quantity: number (how many of this extra are selected)
 * @param {number} numberOfDays - The total number of days for the rental.
 * @returns {number} The calculated total price for all extras.
 */
export const calculateExtrasTotal = (selectedExtras, numberOfDays) => {
  if (!selectedExtras || numberOfDays <= 0) {
    return 0;
  }

  return Object.values(selectedExtras).reduce((total, extra) => {
    // Basic validation for each extra object
    if (!extra || typeof extra.price_per_day === 'undefined' || typeof extra.quantity === 'undefined') {
        console.warn("Invalid extra object encountered, skipping:", extra);
        return total;
    }

    // Use calculateTieredPrice for extras if they have their own tiers,
    // otherwise use their base price per day.
    const extraPrice = calculateTieredPrice(
      extra.pricingTiers || [], // Pass an empty array if no specific tiers for extra
      extra.price_per_day / 100, // Assuming extra.price_per_day is in cents
      numberOfDays
    );
    // Ensure quantity is at least 1 if not specified
    return total + extraPrice * (extra.quantity || 1);
  }, 0);
};
