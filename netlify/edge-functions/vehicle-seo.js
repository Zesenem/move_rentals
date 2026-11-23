const SITE_URL = "https://move-rentals.com";

const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const normalize = (value = "") => value.trim().toLowerCase();

const matchesMetadata = (metadata, vehicle) =>
  (metadata.id && metadata.id === vehicle.id) ||
  (metadata.slug && metadata.slug === vehicle.slug) ||
  (metadata.name && normalize(metadata.name) === normalize(vehicle.name));

const replaceMeta = (html, attribute, property, content) => {
  const tagPattern = new RegExp(`<meta\\b[^>]*${attribute}="${property}"[^>]*>`, "i");
  return html.replace(tagPattern, (tag) =>
    tag.replace(/content="[^"]*"/i, `content="${escapeHtml(content)}"`),
  );
};

export default async (request, context) => {
  const response = await context.next();
  if (response.status !== 200 || !response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  const slug = decodeURIComponent(new URL(request.url).pathname.split("/").filter(Boolean).at(-1));
  const origin = new URL(request.url).origin;

  try {
    const [metadataResponse, productsResponse] = await Promise.all([
      fetch(`${origin}/.netlify/functions/get-fleet-metadata`),
      fetch(`${origin}/.netlify/functions/fetch-products`),
    ]);
    const metadata = metadataResponse.ok ? await metadataResponse.json() : {};
    const productsPayload = productsResponse.ok ? await productsResponse.json() : { data: [] };
    const staticVehicle = (metadata.motorcycles_static_data || []).find(
      (vehicle) => vehicle.slug === slug || vehicle.id === slug,
    );
    const liveVehicle = (productsPayload.data || []).find((vehicle) => {
      const mappedVehicle = {
        id: vehicle.id,
        slug: vehicle.slug || vehicle.id,
        name: vehicle.name?.en || vehicle.name?.def || "",
      };
      return (
        mappedVehicle.slug === slug ||
        mappedVehicle.id === slug ||
        (staticVehicle && matchesMetadata(staticVehicle, mappedVehicle))
      );
    });

    if (!staticVehicle && !liveVehicle) {
      return response;
    }

    const name = staticVehicle?.name || liveVehicle?.name?.en || liveVehicle?.name?.def;
    const description =
      staticVehicle?.description ||
      liveVehicle?.description?.en ||
      liveVehicle?.description?.def ||
      `Rent the ${name} from Move Rentals in Lisbon.`;
    const image =
      staticVehicle?.image_urls?.[0] ||
      liveVehicle?.images?.[0] ||
      `${SITE_URL}/images/og-image.png`;
    const pageUrl = `${SITE_URL}/motorcycle/${encodeURIComponent(slug)}`;
    const title = `${name} | Move Rentals`;
    let html = await response.text();

    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
    html = replaceMeta(html, "name", "description", description);
    html = replaceMeta(html, "property", "og:title", title);
    html = replaceMeta(html, "property", "og:description", description);
    html = replaceMeta(html, "property", "og:url", pageUrl);
    html = replaceMeta(html, "property", "og:image", image);
    html = replaceMeta(html, "name", "twitter:title", title);
    html = replaceMeta(html, "name", "twitter:description", description);
    html = replaceMeta(html, "name", "twitter:image", image);

    return new Response(html, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Could not render vehicle SEO metadata:", error);
    return response;
  }
};
