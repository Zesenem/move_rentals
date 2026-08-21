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

export default async (req) => {
  if (!["POST", "PUT"].includes(req.method)) {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const accessState = await getAdminAccessState();

  if (accessState.status !== "authorized") {
    return createAdminAccessResponse(accessState);
  }

  try {
    const payload = await req.json();
    const validationError = validateFleetMetadata(payload);

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    const metadata = await writeFleetMetadata(payload);

    return Response.json({
      data: metadata,
      message: "Fleet metadata saved successfully.",
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Could not save fleet metadata." },
      { status: 500 },
    );
  }
};
