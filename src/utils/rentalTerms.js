const DEFAULT_JET_SKI_RENTAL_TERMS = {
  daily: {
    hours: 7,
    time_range: "10:00–17:00",
    fuel_included: false,
  },
  hourly: {
    minimum_hours: 3,
    price_from: 120,
    price_to: 180,
    fuel_included: true,
    security_deposit_required: false,
    availability_note: "Subject to availability and season.",
  },
};

export const isJetSki = (vehicle = {}) => /sea[- ]?doo|see?doo/i.test(vehicle.name || "");

const cloneRentalTerms = (terms) => ({
  ...(terms.daily && { daily: { ...terms.daily } }),
  ...(terms.hourly && { hourly: { ...terms.hourly } }),
});

export const getEffectiveRentalTerms = (vehicle = {}) => {
  const savedTerms = vehicle.rental_terms;

  if (!isJetSki(vehicle)) {
    return savedTerms ? cloneRentalTerms(savedTerms) : null;
  }

  return {
    daily: {
      ...DEFAULT_JET_SKI_RENTAL_TERMS.daily,
      ...(savedTerms?.daily || {}),
    },
    hourly: {
      ...DEFAULT_JET_SKI_RENTAL_TERMS.hourly,
      ...(savedTerms?.hourly || {}),
    },
  };
};

export const removeLegacyJetSkiRentalNotes = (vehicle, notes) => {
  if (!isJetSki(vehicle) || !Array.isArray(notes)) {
    return notes || [];
  }

  return notes.filter(
    (note) =>
      !/fuel is not included in the listed rates|minimum rental duration/i.test(note?.item || ""),
  );
};
