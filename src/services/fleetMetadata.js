const REMOTE_FLEET_METADATA_URL = "/.netlify/functions/get-fleet-metadata";
const SAVE_FLEET_METADATA_URL = "/.netlify/functions/save-fleet-metadata";
const LOCAL_FLEET_METADATA_URL = "/db.json";

const fetchLocalFleetMetadata = async () => {
  const response = await fetch(LOCAL_FLEET_METADATA_URL);

  if (!response.ok) {
    throw new Error("Could not fetch the local fleet metadata file.");
  }

  return await response.json();
};

export const fetchFleetMetadata = async () => {
  try {
    const response = await fetch(REMOTE_FLEET_METADATA_URL);

    if (response.ok) {
      return await response.json();
    }

    if (response.status !== 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Could not fetch the fleet metadata from Netlify.");
    }
  } catch (error) {
    console.error("Failed to fetch fleet metadata from Netlify:", error);
  }

  try {
    return await fetchLocalFleetMetadata();
  } catch (error) {
    console.error("Failed to fetch local fleet metadata:", error);
    throw error;
  }
};

export const fetchCommonFleetData = async () => {
  const metadata = await fetchFleetMetadata();
  return metadata.common_data || { requirements: [], included: [] };
};

export const fetchVehicleMetadataEntries = async () => {
  const metadata = await fetchFleetMetadata();
  return metadata.motorcycles_static_data || [];
};

// The session's cookie is sent automatically for this same-origin request.
export const saveFleetMetadata = async (metadata) => {
  try {
    const response = await fetch(SAVE_FLEET_METADATA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || "Could not save fleet metadata.");
    }

    return payload.data;
  } catch (error) {
    console.error("Failed to save fleet metadata:", error);
    throw error;
  }
};
