const GA4_MEASUREMENT_ID = "G-HN2V8GR215";

const cleanParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""));

export const trackWhatsAppClick = ({ placement, url, vehicleName } = {}) => {
  if (typeof window === "undefined") {
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

  if (typeof window.gtag === "function") {
    window.gtag("event", "whatsapp_click", eventParams);
  }
};
