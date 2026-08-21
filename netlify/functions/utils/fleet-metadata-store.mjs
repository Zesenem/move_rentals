import { connectLambda, getStore } from "@netlify/blobs";

export const FLEET_METADATA_STORE_NAME = "fleet-metadata";
export const FLEET_METADATA_KEY = "current";

// Lambda-compatible (v1) functions need connectLambda to bridge the blobs context.
export const readFleetMetadata = async (event) => {
  connectLambda(event);
  const store = getStore(FLEET_METADATA_STORE_NAME);
  return await store.get(FLEET_METADATA_KEY, { type: "json" });
};

// v2 functions auto-detect the blobs context; connectLambda must not be called here.
export const writeFleetMetadata = async (metadata) => {
  const store = getStore(FLEET_METADATA_STORE_NAME);
  await store.setJSON(FLEET_METADATA_KEY, metadata);
  return metadata;
};
