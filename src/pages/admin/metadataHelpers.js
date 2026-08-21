import { normalizeString, slugify } from "../../services/fleetMatching.js";
import { EMPTY_FEATURE_ITEM, EMPTY_LIST_ITEM, EMPTY_QUICK_GLANCE_ITEM } from "./constants.js";

export const getEntryKey = (vehicle, index = 0) =>
  vehicle.id || vehicle.slug || vehicle.name || `metadata-entry-${index}`;

export const hasOwnKey = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

export const cloneStringList = (items) => (Array.isArray(items) ? [...items] : []);

export const cloneObjectList = (items, template) =>
  Array.isArray(items) ? items.map((item) => ({ ...template, ...item })) : [];

export const createVehicleDraft = (vehicle = {}) => ({
  id: vehicle.id || "",
  slug: vehicle.slug || "",
  source: vehicle.source || "",
  name: vehicle.name || "",
  status: vehicle.status || "",
  availabilityLabel: vehicle.availability_label || "",
  description: vehicle.description || "",
  securityDeposit:
    vehicle.security_deposit === undefined || vehicle.security_deposit === null
      ? ""
      : String(vehicle.security_deposit),
  badges: cloneStringList(vehicle.badges),
  matchNames: cloneStringList(vehicle.match_names),
  quickGlance: cloneObjectList(vehicle.quick_glance, EMPTY_QUICK_GLANCE_ITEM),
  technicalFeatures: cloneObjectList(vehicle.technical_features, EMPTY_FEATURE_ITEM),
  hasIncludedOverride: hasOwnKey(vehicle, "included"),
  included: cloneObjectList(vehicle.included, EMPTY_LIST_ITEM),
  hasRequirementsOverride: hasOwnKey(vehicle, "requirements"),
  requirements: cloneObjectList(vehicle.requirements, EMPTY_LIST_ITEM),
  importantNotes: cloneObjectList(vehicle.important_notes, EMPTY_LIST_ITEM),
});

export const createLiveVehicleMetadataTemplate = (vehicle = {}) => ({
  id: vehicle.id || "",
  slug: vehicle.slug || slugify(vehicle.name || ""),
  name: vehicle.name || "",
  description: vehicle.description || "",
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
    .filter((item) => item.label);

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

  const badges = sanitizeStringList(draft.badges);
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
    return "Shared list";
  }

  const itemCount = items?.length || 0;
  return `${itemCount} custom ${itemCount === 1 ? "item" : "items"}`;
};
