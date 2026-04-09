import { writeFleetMetadata } from "./utils/fleet-metadata-store.mjs";
import { createAdminAccessResponse, getAdminAccessState } from "./utils/admin-access.mjs";

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const validateFleetMetadata = (payload) => {
  if (!isObject(payload)) {
    return "Payload must be a JSON object.";
  }

  if (!isObject(payload.common_data)) {
    return "Payload.common_data must be an object.";
  }

  if (!Array.isArray(payload.common_data.requirements)) {
    return "Payload.common_data.requirements must be an array.";
  }

  if (!Array.isArray(payload.common_data.included)) {
    return "Payload.common_data.included must be an array.";
  }

  if (!Array.isArray(payload.motorcycles_static_data)) {
    return "Payload.motorcycles_static_data must be an array.";
  }

  return null;
};

export const handler = async (event, context) => {
  if (!["POST", "PUT"].includes(event.httpMethod)) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  const accessState = getAdminAccessState(context);

  if (accessState.status !== "authorized") {
    return createAdminAccessResponse(accessState);
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const validationError = validateFleetMetadata(payload);

    if (validationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validationError }),
      };
    }

    const metadata = await writeFleetMetadata(event, payload);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: metadata,
        message: "Fleet metadata saved successfully.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Could not save fleet metadata." }),
    };
  }
};
