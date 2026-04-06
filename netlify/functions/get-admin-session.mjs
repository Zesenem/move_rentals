import {
  createAdminAccessResponse,
  getAdminAccessState,
} from "./utils/admin-access.mjs";

export const handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  const accessState = getAdminAccessState(context);

  if (accessState.status !== "authorized") {
    return createAdminAccessResponse(accessState);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      user: {
        id: accessState.user.id,
        email: accessState.user.email,
        roles: accessState.user.roles || accessState.user.app_metadata?.roles || [],
      },
    }),
  };
};
