export const normalizeString = (value = "") => value.trim().toLowerCase();

export const slugify = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getVehicleMetadataKey = (vehicle = {}) =>
  vehicle.id || vehicle.slug || `name:${normalizeString(vehicle.name)}`;

export const matchesVehicleMetadata = (metadataVehicle, liveVehicle) => {
  if (metadataVehicle.id && metadataVehicle.id === liveVehicle.id) {
    return true;
  }

  if (metadataVehicle.slug && metadataVehicle.slug === liveVehicle.slug) {
    return true;
  }

  const directNameMatch =
    Boolean(metadataVehicle.name) &&
    (normalizeString(metadataVehicle.name) === normalizeString(liveVehicle.name) ||
      slugify(metadataVehicle.name) === slugify(liveVehicle.name));

  if (directNameMatch) {
    return true;
  }

  return metadataVehicle.match_names?.some(
    (name) =>
      normalizeString(name) === normalizeString(liveVehicle.name) ||
      slugify(name) === slugify(liveVehicle.name)
  );
};
