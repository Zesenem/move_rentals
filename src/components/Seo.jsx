import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://move-rentals.com";
const SITE_NAME = "Move Rentals";
const DEFAULT_IMAGE = `${SITE_URL}/images/og-image.png`;

// Central place for canonical/OG/Twitter tags so every page gets consistent SEO metadata.
function Seo({ title, description, path = "/", image = DEFAULT_IMAGE, noIndex = false }) {
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}

export default Seo;
