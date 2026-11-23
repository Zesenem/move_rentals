const GA4_MEASUREMENT_ID = "G-HN2V8GR215";
const GTM_ID = "GTM-TRKV2T3H";
const CONSENT_KEY = "move-rentals-cookie-consent";
let analyticsLoaded = false;

const cleanParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""));

const hasAnalyticsConsent = () => {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
};

export const trackWhatsAppClick = ({ placement, url, vehicleName } = {}) => {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) {
    return;
  }

  const eventParams = cleanParams({
    send_to: GA4_MEASUREMENT_ID,
    link_url: url,
    link_domain: "wa.me",
    placement,
    vehicle_name: vehicleName,
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "whatsapp_click",
    ...eventParams,
  });
};

export const grantAnalyticsConsent = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([
    "consent",
    "update",
    {
      ad_storage: "granted",
      analytics_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    },
  ]);

  if (analyticsLoaded) {
    return;
  }

  analyticsLoaded = true;
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
};

export const revokeAnalyticsConsent = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([
    "consent",
    "update",
    {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  ]);
};

export const initialiseAnalyticsConsent = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (window.localStorage.getItem(CONSENT_KEY) === "accepted") {
      grantAnalyticsConsent();
    }
  } catch {
    // Analytics remains disabled when storage is unavailable.
  }
};
