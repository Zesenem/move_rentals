import { createAdminAccessResponse, getAdminAccessState } from "./utils/admin-access.mjs";

export default async (req) => {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const accessState = await getAdminAccessState();

  if (accessState.status !== "authorized") {
    return createAdminAccessResponse(accessState);
  }

  return Response.json({
    user: {
      id: accessState.user.id,
      email: accessState.user.email,
      roles: accessState.user.roles || [],
    },
  });
};
