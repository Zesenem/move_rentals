import { getUser } from "@netlify/identity";

const normalizeEmail = (value = "") => value.trim().toLowerCase();

const getAllowedEmails = () =>
  String(process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);

export const getAdminAccessState = async () => {
  const user = await getUser();

  if (!user) {
    return {
      status: "unauthenticated",
      statusCode: 401,
      message: "You must be logged in to access the admin area.",
      user: null,
    };
  }

  const allowedEmails = getAllowedEmails();
  const normalizedEmail = normalizeEmail(user.email);
  const roles = user.roles || [];
  const isRoleAllowed = roles.includes("admin");
  const isEmailAllowed = allowedEmails.includes(normalizedEmail);

  if (!isRoleAllowed && !isEmailAllowed) {
    return {
      status: "forbidden",
      statusCode: 403,
      message: "This account is not authorized to access the admin area.",
      user,
    };
  }

  return {
    status: "authorized",
    statusCode: 200,
    message: "Authorized.",
    user,
  };
};

export const createAdminAccessResponse = (accessState) =>
  Response.json({ error: accessState.message }, { status: accessState.statusCode });
