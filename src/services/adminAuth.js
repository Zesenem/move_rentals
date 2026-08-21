import {
  acceptInvite,
  handleAuthCallback,
  login,
  logout,
  requestPasswordRecovery,
  updateUser,
} from "@netlify/identity";

const ADMIN_SESSION_URL = "/.netlify/functions/get-admin-session";

export const loginAdmin = (email, password) => login(email, password);

export const logoutAdmin = () => logout();

export const processAdminAuthCallback = () => handleAuthCallback();

export const requestAdminPasswordRecovery = (email) => requestPasswordRecovery(email);

export const acceptAdminInvite = (token, password) => acceptInvite(token, password);

export const setAdminPassword = (password) => updateUser({ password });

// The session's cookie is sent automatically for this same-origin request.
export const fetchAdminSession = async () => {
  const response = await fetch(ADMIN_SESSION_URL);
  const payload = await response.json().catch(() => ({}));

  if (response.ok) {
    return {
      authenticated: true,
      user: payload.user,
      error: "",
    };
  }

  if (response.status === 401 || response.status === 403) {
    return {
      authenticated: false,
      user: null,
      error: payload.error || "You do not have access to the admin area.",
    };
  }

  throw new Error(payload.error || "Could not verify the admin session.");
};
