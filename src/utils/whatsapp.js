export const WHATSAPP_PHONE = "351920016794";
export const WHATSAPP_DISPLAY_PHONE = "+351 920 016 794";

export const buildWhatsAppUrl = (message) => {
  const base = `https://wa.me/${WHATSAPP_PHONE}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
