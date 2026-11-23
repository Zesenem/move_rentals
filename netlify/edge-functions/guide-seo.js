const title = "Lisbon Motorcycle & Scooter Rental Guide | Move Rentals";
const description =
  "Plan a scooter or motorcycle rental in Lisbon with guidance on licences, parking, collection, routes, and choosing the right vehicle.";
const pageUrl = "https://move-rentals.com/lisbon-rental-guide";

const escapeHtml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

const replaceMeta = (html, attribute, property, content) => {
  const pattern = new RegExp(`<meta\\b[^>]*${attribute}="${property}"[^>]*>`, "i");
  return html.replace(pattern, (tag) =>
    tag.replace(/content="[^"]*"/i, `content="${escapeHtml(content)}"`),
  );
};

export default async (_request, context) => {
  const response = await context.next();
  if (response.status !== 200 || !response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  let html = await response.text();
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, "name", "description", description);
  html = replaceMeta(html, "property", "og:title", title);
  html = replaceMeta(html, "property", "og:description", description);
  html = replaceMeta(html, "property", "og:url", pageUrl);
  html = replaceMeta(html, "name", "twitter:title", title);
  html = replaceMeta(html, "name", "twitter:description", description);
  return new Response(html, { status: response.status, headers: response.headers });
};
