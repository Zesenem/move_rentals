export const VEHICLE_TYPE_OPTIONS = [
  { value: "scooter", label: "Scooters" },
  { value: "motorcycle", label: "Motorcycles" },
  { value: "car", label: "Cars" },
  { value: "watercraft", label: "Watercraft" },
];

export const LICENCE_CATEGORY_OPTIONS = [
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "nautical", label: "Nautical licence" },
];

const normaliseText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

const hasStandaloneCode = (value, code) =>
  new RegExp(`(^|[^A-Z0-9])${code}([^A-Z0-9]|$)`).test(value);

const parseCcValue = (value) => {
  const match = String(value || "").match(/([\d.,\s]+)\s*cc\b/i);

  if (!match) {
    return null;
  }

  const parsedValue = Number(match[1].replace(/[^\d]/g, ""));
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const getLegacyQuickGlanceValue = (vehicle, icon) =>
  vehicle.quick_glance?.find((item) => item.icon === icon)?.label || "";

const getVehicleTypeFallback = (vehicle) => {
  if (vehicle.badges?.includes("Anchor") || /sea[- ]?doo|jet ?ski/i.test(vehicle.name)) {
    return "watercraft";
  }

  if (/tesla|\bmodel [0-9a-z]+\b|\bcar\b/i.test(vehicle.name)) {
    return "car";
  }

  if (/bmw|cf\s?moto|s1000|\bmt\b|motorcycle/i.test(vehicle.name)) {
    return "motorcycle";
  }

  return "scooter";
};

const normaliseLicenceCategories = (licences) => {
  const recognisedLicences = new Set();

  licences.forEach((licence) => {
    const value = normaliseText(licence);

    if (/NAUTICAL|NAUTICA|BOAT|MARITIME/.test(value)) {
      recognisedLicences.add("nautical");
    }

    ["A1", "A2", "A", "B"].forEach((code) => {
      if (hasStandaloneCode(value, code)) {
        recognisedLicences.add(code);
      }
    });
  });

  return LICENCE_CATEGORY_OPTIONS.map((option) => option.value).filter((value) =>
    recognisedLicences.has(value),
  );
};

export const getVehicleFilterData = (vehicle) => {
  const legacyLicence = getLegacyQuickGlanceValue(vehicle, "license");
  const explicitDisplacement = Number(vehicle.displacement_cc);

  return {
    type: VEHICLE_TYPE_OPTIONS.some((option) => option.value === vehicle.vehicle_type)
      ? vehicle.vehicle_type
      : getVehicleTypeFallback(vehicle),
    licences: normaliseLicenceCategories(
      Array.isArray(vehicle.licence_categories) && vehicle.licence_categories.length > 0
        ? vehicle.licence_categories
        : [legacyLicence],
    ),
    displacement:
      Number.isFinite(explicitDisplacement) && explicitDisplacement > 0
        ? explicitDisplacement
        : parseCcValue(getLegacyQuickGlanceValue(vehicle, "engine")),
    price: typeof vehicle.price_per_day === "number" && vehicle.price_per_day > 0
      ? vehicle.price_per_day
      : null,
    badges: Array.isArray(vehicle.badges)
      ? vehicle.badges.filter((badge) => badge !== "Luggage Space")
      : [],
  };
};

export const getNumericRange = (values) => {
  const validValues = values.filter((value) => Number.isFinite(value) && value >= 0);

  if (!validValues.length) {
    return null;
  }

  return { min: Math.min(...validValues), max: Math.max(...validValues) };
};

export const getFleetFilterOptions = (vehicles) => {
  const filterData = vehicles.map(getVehicleFilterData);
  const vehicleTypes = new Set(filterData.map((item) => item.type));
  const licences = new Set(filterData.flatMap((item) => item.licences));
  const badges = new Set(filterData.flatMap((item) => item.badges));

  return {
    types: VEHICLE_TYPE_OPTIONS.filter((option) => vehicleTypes.has(option.value)),
    licences: LICENCE_CATEGORY_OPTIONS.filter((option) => licences.has(option.value)),
    badges: [...badges].sort((a, b) => a.localeCompare(b)),
    priceRange: getNumericRange(filterData.map((item) => item.price)),
    displacementRange: getNumericRange(filterData.map((item) => item.displacement)),
  };
};

const includesAny = (values, selections) =>
  selections.length === 0 || selections.some((selection) => values.includes(selection));

export const filterFleetVehicles = (vehicles, filters) =>
  vehicles.filter((vehicle) => {
    const filterData = getVehicleFilterData(vehicle);

    if (filters.types.length > 0 && !filters.types.includes(filterData.type)) {
      return false;
    }

    if (!includesAny(filterData.licences, filters.licences)) {
      return false;
    }

    if (!includesAny(filterData.badges, filters.badges)) {
      return false;
    }

    if (filters.priceRange) {
      if (
        filterData.price === null ||
        filterData.price < filters.priceRange.min ||
        filterData.price > filters.priceRange.max
      ) {
        return false;
      }
    }

    if (filters.displacementRange) {
      if (
        filterData.displacement === null ||
        filterData.displacement < filters.displacementRange.min ||
        filterData.displacement > filters.displacementRange.max
      ) {
        return false;
      }
    }

    return true;
  });

export const hasActiveFleetFilters = (filters, options) =>
  filters.types.length > 0 ||
  filters.licences.length > 0 ||
  filters.badges.length > 0 ||
  (filters.priceRange &&
    options.priceRange &&
    (filters.priceRange.min !== options.priceRange.min ||
      filters.priceRange.max !== options.priceRange.max)) ||
  (filters.displacementRange &&
    options.displacementRange &&
    (filters.displacementRange.min !== options.displacementRange.min ||
      filters.displacementRange.max !== options.displacementRange.max));

export const getActiveFleetFilterCount = (filters, options) => {
  let count = filters.types.length + filters.licences.length + filters.badges.length;

  if (
    filters.priceRange &&
    options.priceRange &&
    (filters.priceRange.min !== options.priceRange.min ||
      filters.priceRange.max !== options.priceRange.max)
  ) {
    count += 1;
  }

  if (
    filters.displacementRange &&
    options.displacementRange &&
    (filters.displacementRange.min !== options.displacementRange.min ||
      filters.displacementRange.max !== options.displacementRange.max)
  ) {
    count += 1;
  }

  return count;
};
