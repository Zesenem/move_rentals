import { readFleetMetadata } from "./utils/fleet-metadata-store.mjs";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  try {
    const metadata = await readFleetMetadata(event);

    if (!metadata) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Fleet metadata has not been saved to Blobs yet." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(metadata),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Could not read fleet metadata." }),
    };
  }
};
