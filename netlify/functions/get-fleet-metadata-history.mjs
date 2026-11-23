import { createAdminAccessResponse, getAdminAccessState } from "./utils/admin-access.mjs";
import { readFleetMetadataHistory } from "./utils/fleet-metadata-store.mjs";

export default async (req) => {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const accessState = await getAdminAccessState();
  if (accessState.status !== "authorized") {
    return createAdminAccessResponse(accessState);
  }

  return Response.json({ data: await readFleetMetadataHistory() });
};
