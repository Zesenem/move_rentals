import { normalizeString, slugify } from "../../services/fleetMatching.js";
import { getEffectiveRentalTerms } from "../../utils/rentalTerms.js";
import { EMPTY_FEATURE_ITEM, EMPTY_LIST_ITEM, EMPTY_QUICK_GLANCE_ITEM } from "./constants.js";

export const getEntryKey = (vehicle, index = 0) =>
  vehicle.id || vehicle.slug || vehicle.name || `metadata-entry-${index}`;

export const hasOwnKey = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

export const cloneStringList = (items) => (Array.isArray(items) ? [...items] : []);

export const cloneObjectList = (items, template) =>
  Array.isArray(items) ? items.map((item) => ({ ...template, ...item })) : [];

export const createVehicleDraft = (vehicle = {}) => {
  const rentalTerms = getEffectiveRentalTerms(vehicle);
  const dailyRental = rentalTerms?.daily || {};
  const hourlyRental = rentalTerms?.hourly || {};

  return {
    id: vehicle.id || "",
    slug: vehicle.slug || "",
    source: vehicle.source || "",
    name: vehicle.name || "",
    status: vehicle.status || "",
    availabilityLabel: vehicle.availability_label || "",
    description: vehicle.description || "",
    vehicleType: vehicle.vehicle_type || "",
    licenceCategories: cloneStringList(vehicle.licence_categories),
    displacementCc:
      vehicle.displacement_cc === undefined || vehicle.displacement_cc === null
        ? ""
        : String(vehicle.displacement_cc),
    luggageCapacity:
      vehicle.luggage_capacity_l === undefined || vehicle.luggage_capacity_l === null
        ? ""
        : String(vehicle.luggage_capacity_l),
    securityDeposit:
      vehicle.security_deposit === undefined || vehicle.security_deposit === null
        ? ""
        : String(vehicle.security_deposit),
    dailyRentalHours: dailyRental.hours ? String(dailyRental.hours) : "",
    dailyRentalTimeRange: dailyRental.time_range || "",
    dailyFuelNotIncluded: dailyRental.fuel_included === false,
    hourlyRentalMinimumHours: hourlyRental.minimum_hours ? String(hourlyRental.minimum_hours) : "",
    hourlyRentalPriceFrom: hourlyRental.price_from ? String(hourlyRental.price_from) : "",
    hourlyRentalPriceTo: hourlyRental.price_to ? String(hourlyRental.price_to) : "",
    hourlyFuelIncluded: hourlyRental.fuel_included === true,
    hourlyNoSecurityDeposit: hourlyRental.security_deposit_required === false,
    hourlyAvailabilityNote: hourlyRental.availability_note || "",
    badges: cloneStringList(vehicle.badges).filter((badge) => badge !== "Luggage Space"),
    matchNames: cloneStringList(vehicle.match_names),
    quickGlance: cloneObjectList(vehicle.quick_glance, EMPTY_QUICK_GLANCE_ITEM),
    technicalFeatures: cloneObjectList(vehicle.technical_features, EMPTY_FEATURE_ITEM),
    hasIncludedOverride: hasOwnKey(vehicle, "included"),
    included: cloneObjectList(vehicle.included, EMPTY_LIST_ITEM),
    hasRequirementsOverride: hasOwnKey(vehicle, "requirements"),
    requirements: cloneObjectList(vehicle.requirements, EMPTY_LIST_ITEM),
    importantNotes: cloneObjectList(vehicle.important_notes, EMPTY_LIST_ITEM),
  };
};

export const createLiveVehicleMetadataTemplate = (vehicle = {}) => ({
  id: vehicle.id || "",
  slug: vehicle.slug || slugify(vehicle.name || ""),
  name: vehicle.name || "",
  description: vehicle.description || "",
  vehicle_type: "",
  licence_categories: [],
  displacement_cc: null,
  luggage_capacity_l: null,
  rental_terms: null,
  badges: [],
  quick_glance: [],
  technical_features: [],
  important_notes: [],
});

export const createStaticVehicleMetadataTemplate = () => ({
  source: "static",
  status: "available",
  name: "",
  slug: "",
  description: "",
  vehicle_type: "",
  licence_categories: [],
  displacement_cc: null,
  luggage_capacity_l: null,
  rental_terms: null,
  badges: [],
  quick_glance: [],
  technical_features: [],
  important_notes: [],
});

export const createCommonDataDraft = (commonData = {}) => ({
  requirements: cloneObjectList(commonData.requirements, EMPTY_LIST_ITEM),
  included: cloneObjectList(commonData.included, EMPTY_LIST_ITEM),
});

export const sanitizeStringList = (items) => items.map((item) => item.trim()).filter(Boolean);

export const sanitizeQuickGlance = (items) =>
  items
    .map((item) => ({
      label: item.label.trim(),
      icon: item.icon || "engine",
    }))
    .filter((item) => item.label)
    .slice(0, 4);

export const sanitizeTechnicalFeatures = (items) =>
  items
    .map((item) => ({
      label: item.label.trim(),
      value: item.value.trim(),
    }))
    .filter((item) => item.label && item.value);

export const sanitizeIconListItems = (items) =>
  items
    .map((item) => ({
      item: item.item.trim(),
      icon: item.icon || "default-check",
    }))
    .filter((item) => item.item);

export const buildUpdatedCommonData = (draft) => ({
  requirements: sanitizeIconListItems(draft.requirements),
  included: sanitizeIconListItems(draft.included),
});

export const parseSecurityDeposit = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const normalizedNumber = Number(trimmedValue);

  if (!Number.isNaN(normalizedNumber) && trimmedValue === String(normalizedNumber)) {
    return normalizedNumber;
  }

  return trimmedValue;
};

export const setOptionalString = (target, key, value) => {
  const trimmedValue = value.trim();

  if (trimmedValue) {
    target[key] = trimmedValue;
    return;
  }

  delete target[key];
};

export const hasVehicleEntryConflict = (entryA, entryB) => {
  if (entryA.id && entryB.id && entryA.id === entryB.id) {
    return true;
  }

  if (entryA.slug && entryB.slug && entryA.slug === entryB.slug) {
    return true;
  }

  return (
    Boolean(entryA.name) &&
    Boolean(entryB.name) &&
    normalizeString(entryA.name) === normalizeString(entryB.name)
  );
};

export const buildUpdatedVehicleEntry = (currentVehicle, draft) => {
  const name = draft.name.trim();

  if (!name) {
    throw new Error("Vehicle name is required.");
  }

  const nextVehicle = {
    ...currentVehicle,
    name,
  };

  setOptionalString(nextVehicle, "id", draft.id);
  setOptionalString(nextVehicle, "slug", draft.slug);
  setOptionalString(nextVehicle, "source", draft.source);
  setOptionalString(nextVehicle, "status", draft.status);
  setOptionalString(nextVehicle, "availability_label", draft.availabilityLabel);
  setOptionalString(nextVehicle, "description", draft.description);
  setOptionalString(nextVehicle, "vehicle_type", draft.vehicleType);

  const licenceCategories = sanitizeStringList(draft.licenceCategories);

  if (licenceCategories.length > 0) {
    nextVehicle.licence_categories = licenceCategories;
  } else {
    delete nextVehicle.licence_categories;
  }

  const displacementValue = draft.displacementCc.trim();

  if (displacementValue) {
    const displacementCc = Number(displacementValue);

    if (!Number.isFinite(displacementCc) || displacementCc <= 0) {
      throw new Error("Indique uma cilindrada válida em cc, ou deixe o campo vazio.");
    }

    nextVehicle.displacement_cc = displacementCc;
  } else {
    delete nextVehicle.displacement_cc;
  }

  const luggageCapacityValue = draft.luggageCapacity.trim();

  if (luggageCapacityValue) {
    const luggageCapacity = Number(luggageCapacityValue);

    if (!Number.isFinite(luggageCapacity) || luggageCapacity < 0) {
      throw new Error("Indique uma capacidade de bagagem válida em litros, ou deixe o campo vazio.");
    }

    nextVehicle.luggage_capacity_l = luggageCapacity;
  } else {
    delete nextVehicle.luggage_capacity_l;
  }

  const dailyRentalHoursValue = draft.dailyRentalHours.trim();
  const dailyRentalHours = Number(dailyRentalHoursValue);
  const dailyRentalTimeRange = draft.dailyRentalTimeRange.trim();
  const hasDailyRentalInput =
    Boolean(dailyRentalHoursValue) || Boolean(dailyRentalTimeRange) || draft.dailyFuelNotIncluded;

  if (hasDailyRentalInput && (!Number.isFinite(dailyRentalHours) || dailyRentalHours <= 0)) {
    throw new Error("Indique a duração válida do aluguer diário, ou deixe os campos diários vazios.");
  }

  const hourlyMinimumHoursValue = draft.hourlyRentalMinimumHours.trim();
  const hourlyPriceFromValue = draft.hourlyRentalPriceFrom.trim();
  const hourlyPriceToValue = draft.hourlyRentalPriceTo.trim();
  const hourlyMinimumHours = Number(hourlyMinimumHoursValue);
  const hourlyPriceFrom = Number(hourlyPriceFromValue);
  const hourlyPriceTo = Number(hourlyPriceToValue);
  const hasHourlyRentalInput =
    Boolean(hourlyMinimumHoursValue) ||
    Boolean(hourlyPriceFromValue) ||
    Boolean(hourlyPriceToValue) ||
    draft.hourlyFuelIncluded ||
    draft.hourlyNoSecurityDeposit ||
    Boolean(draft.hourlyAvailabilityNote.trim());

  if (
    hasHourlyRentalInput &&
    (!Number.isFinite(hourlyMinimumHours) ||
      hourlyMinimumHours <= 0 ||
      !Number.isFinite(hourlyPriceFrom) ||
      hourlyPriceFrom <= 0 ||
      !Number.isFinite(hourlyPriceTo) ||
      hourlyPriceTo < hourlyPriceFrom)
  ) {
    throw new Error("Preencha uma duração mínima e um intervalo de preço/hora válido, ou deixe os campos horários vazios.");
  }

  if (hasDailyRentalInput || hasHourlyRentalInput) {
    nextVehicle.rental_terms = {
      ...(hasDailyRentalInput && {
        daily: {
          hours: dailyRentalHours,
          ...(dailyRentalTimeRange && { time_range: dailyRentalTimeRange }),
          fuel_included: !draft.dailyFuelNotIncluded,
        },
      }),
      ...(hasHourlyRentalInput && {
        hourly: {
          minimum_hours: hourlyMinimumHours,
          price_from: hourlyPriceFrom,
          price_to: hourlyPriceTo,
          fuel_included: draft.hourlyFuelIncluded,
          security_deposit_required: !draft.hourlyNoSecurityDeposit,
          ...(draft.hourlyAvailabilityNote.trim() && {
            availability_note: draft.hourlyAvailabilityNote.trim(),
          }),
        },
      }),
    };
  } else {
    delete nextVehicle.rental_terms;
  }

  delete nextVehicle.minimum_rental;

  const badges = sanitizeStringList(draft.badges).filter((badge) => badge !== "Luggage Space");
  const matchNames = sanitizeStringList(draft.matchNames);

  nextVehicle.badges = badges;

  if (matchNames.length > 0) {
    nextVehicle.match_names = matchNames;
  } else {
    delete nextVehicle.match_names;
  }

  const securityDeposit = parseSecurityDeposit(draft.securityDeposit);

  if (securityDeposit === undefined) {
    delete nextVehicle.security_deposit;
  } else {
    nextVehicle.security_deposit = securityDeposit;
  }

  nextVehicle.quick_glance = sanitizeQuickGlance(draft.quickGlance);
  nextVehicle.technical_features = sanitizeTechnicalFeatures(draft.technicalFeatures);
  nextVehicle.important_notes = sanitizeIconListItems(draft.importantNotes);

  if (draft.hasIncludedOverride) {
    nextVehicle.included = sanitizeIconListItems(draft.included);
  } else {
    delete nextVehicle.included;
  }

  if (draft.hasRequirementsOverride) {
    nextVehicle.requirements = sanitizeIconListItems(draft.requirements);
  } else {
    delete nextVehicle.requirements;
  }

  return nextVehicle;
};

export const describeCustomList = (items, usesSharedFallback = false) => {
  if (usesSharedFallback) {
    return "Lista geral";
  }

  const itemCount = items?.length || 0;
  return `${itemCount} ${itemCount === 1 ? "item personalizado" : "itens personalizados"}`;
};
