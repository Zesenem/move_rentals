import { connectLambda, getStore } from "@netlify/blobs";

export const FLEET_METADATA_STORE_NAME = "fleet-metadata";
export const FLEET_METADATA_KEY = "current";
export const FLEET_METADATA_HISTORY_KEY = "history";

// Lambda-compatible (v1) functions need connectLambda to bridge the blobs context.
export const readFleetMetadata = async (event) => {
  connectLambda(event);
  const store = getStore(FLEET_METADATA_STORE_NAME);
  return await store.get(FLEET_METADATA_KEY, { type: "json" });
};

// v2 functions auto-detect the blobs context; connectLambda must not be called here.
export const writeFleetMetadata = async (metadata, { expectedRevision = 0, userEmail = "" } = {}) => {
  const store = getStore(FLEET_METADATA_STORE_NAME);
  const currentMetadata = (await store.get(FLEET_METADATA_KEY, { type: "json" })) || {};
  const currentRevision = Number(currentMetadata.revision) || 0;

  if (expectedRevision !== currentRevision) {
    const error = new Error(
      `Fleet metadata changed from revision ${expectedRevision} to ${currentRevision}.`,
    );
    error.code = "METADATA_CONFLICT";
    error.currentMetadata = currentMetadata;
    throw error;
  }

  const previousHistory = (await store.get(FLEET_METADATA_HISTORY_KEY, { type: "json" })) || [];
  const updatedAt = new Date().toISOString();
  const nextMetadata = {
    ...metadata,
    revision: currentRevision + 1,
    updated_at: updatedAt,
    updated_by: userEmail,
  };
  const historyEntry = {
    revision: nextMetadata.revision,
    updated_at: updatedAt,
    updated_by: userEmail,
    vehicle_count: Array.isArray(metadata.motorcycles_static_data)
      ? metadata.motorcycles_static_data.length
      : 0,
  };

  await store.setJSON(FLEET_METADATA_KEY, nextMetadata);
  await store.setJSON(FLEET_METADATA_HISTORY_KEY, [historyEntry, ...previousHistory].slice(0, 20));
  return nextMetadata;
};

export const readFleetMetadataHistory = async () => {
  const store = getStore(FLEET_METADATA_STORE_NAME);
  return (await store.get(FLEET_METADATA_HISTORY_KEY, { type: "json" })) || [];
};
