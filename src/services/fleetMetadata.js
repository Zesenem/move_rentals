const REMOTE_FLEET_METADATA_URL = "/.netlify/functions/get-fleet-metadata";
const SAVE_FLEET_METADATA_URL = "/.netlify/functions/save-fleet-metadata";
const FLEET_METADATA_HISTORY_URL = "/.netlify/functions/get-fleet-metadata-history";
const LOCAL_FLEET_METADATA_URL = "/db.json";
let metadataRequest = null;

const fetchLocalFleetMetadata = async () => {
  const response = await fetch(LOCAL_FLEET_METADATA_URL);

  if (!response.ok) {
    throw new Error("Could not fetch the local fleet metadata file.");
  }

  return await response.json();
};

export const fetchFleetMetadata = async () => {
  if (metadataRequest) {
    return metadataRequest;
  }

  metadataRequest = fetchFleetMetadataFromSource();

  try {
    return await metadataRequest;
  } finally {
    metadataRequest = null;
  }
};

const fetchFleetMetadataFromSource = async () => {
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

// The session's cookie is sent automatically for this same-origin request.
export const saveFleetMetadata = async (metadata) => {
  try {
    const response = await fetch(SAVE_FLEET_METADATA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...metadata, expected_revision: Number(metadata.revision) || 0 }),
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

export const fetchFleetMetadataHistory = async () => {
  const response = await fetch(FLEET_METADATA_HISTORY_URL);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Could not fetch fleet metadata history.");
  }

  return payload.data || [];
};
