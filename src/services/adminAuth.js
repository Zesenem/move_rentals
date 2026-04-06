import netlifyIdentity from "netlify-identity-widget";

const ADMIN_SESSION_URL = "/.netlify/functions/get-admin-session";

let hasInitializedIdentity = false;

export const initAdminIdentity = () => {
  if (hasInitializedIdentity || typeof window === "undefined") {
    return netlifyIdentity;
  }

  netlifyIdentity.init({
    locale: "en",
  });

  hasInitializedIdentity = true;
  return netlifyIdentity;
};

export const onAdminIdentityEvent = (eventName, handler) => {
  netlifyIdentity.on(eventName, handler);

  return () => {
    netlifyIdentity.off(eventName, handler);
  };
};

export const openAdminLogin = () => {
  initAdminIdentity().open("login");
};

export const logoutAdmin = async () => {
  await initAdminIdentity().logout();
};

export const getAdminToken = async () => {
  const identity = initAdminIdentity();
  const currentUser = identity.currentUser();

  if (!currentUser) {
    return null;
  }

  return await identity.refresh();
};

export const fetchAdminSession = async () => {
  const token = await getAdminToken();
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const response = await fetch(ADMIN_SESSION_URL, { headers });
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
