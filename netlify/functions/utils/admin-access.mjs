const normalizeEmail = (value = "") => value.trim().toLowerCase();

const getAllowedEmails = () =>
  String(process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);

const getUserRoles = (user = {}) => {
  if (Array.isArray(user.roles)) {
    return user.roles;
  }

  if (Array.isArray(user.app_metadata?.roles)) {
    return user.app_metadata.roles;
  }

  return [];
};

export const getAdminAccessState = (context) => {
  const user = context?.clientContext?.user || null;

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
  const roles = getUserRoles(user);
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

export const createAdminAccessResponse = (accessState) => ({
  statusCode: accessState.statusCode,
  body: JSON.stringify({ error: accessState.message }),
});
