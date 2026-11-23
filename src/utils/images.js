const IMAGE_CDN_PATH = "/.netlify/images";

const canUseImageCdn = () =>
  import.meta.env.PROD &&
  typeof window !== "undefined" &&
  ["move-rentals.com", "www.move-rentals.com"].includes(window.location.hostname);

export const getOptimizedImageUrl = (source, { width, quality = 75, fit = "cover" } = {}) => {
  if (!canUseImageCdn() || !source || !width || !/^https?:\/\//i.test(source)) {
    return source;
  }

  const params = new URLSearchParams({
    url: source,
    w: String(width),
    q: String(quality),
    fm: "webp",
    fit,
  });

  return `${IMAGE_CDN_PATH}?${params.toString()}`;
};

export const getResponsiveImageProps = (source, options) => {
  if (!canUseImageCdn() || !source) {
    return { src: source };
  }

  const widths = options?.widths || [384, 768];
  return {
    src: getOptimizedImageUrl(source, { ...options, width: widths[0] }),
    srcSet: widths
      .map((width) => `${getOptimizedImageUrl(source, { ...options, width })} ${width}w`)
      .join(", "),
  };
};
