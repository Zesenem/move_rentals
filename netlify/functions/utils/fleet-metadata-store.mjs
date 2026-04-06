import { connectLambda, getStore } from "@netlify/blobs";

export const FLEET_METADATA_STORE_NAME = "fleet-metadata";
export const FLEET_METADATA_KEY = "current";

const getFleetMetadataStore = (event) => {
  connectLambda(event);
  return getStore(FLEET_METADATA_STORE_NAME);
};

export const readFleetMetadata = async (event) => {
  const store = getFleetMetadataStore(event);
  return await store.get(FLEET_METADATA_KEY, { type: "json" });
};

export const writeFleetMetadata = async (event, metadata) => {
  const store = getFleetMetadataStore(event);
  await store.setJSON(FLEET_METADATA_KEY, metadata);
  return metadata;
};
