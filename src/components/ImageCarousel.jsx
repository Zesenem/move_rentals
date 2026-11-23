import { lazy, Suspense, useState, useMemo, useCallback, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getResponsiveImageProps } from "../utils/images.js";

const EMPTY_IMAGES = [];
const Lightbox = lazy(async () => {
  const [lightbox] = await Promise.all([
    import("yet-another-react-lightbox"),
    import("yet-another-react-lightbox/styles.css"),
  ]);
  return lightbox;
});
const getImageAlt = (vehicleName, index) => `${vehicleName} rental in Lisbon — image ${index + 1}`;

const CarouselArrow = ({ direction, onClick }) => {
  const isLeft = direction === "left";
  return (
    <div className={`absolute top-1/2 z-10 -translate-y-1/2 ${isLeft ? "left-3" : "right-3"}`}>
      <button
        onClick={onClick}
        aria-label={isLeft ? "Previous Image" : "Next Image"}
        className="rounded-full bg-phantom/60 p-3 text-cloud opacity-100 backdrop-blur-sm transition-all duration-300 hover:bg-phantom/90 md:opacity-0 group-hover:opacity-100"
      >
        {isLeft ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    </div>
  );
};

function ImageCarousel({ images, vehicleName }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const vehicleImages = useMemo(
    () =>
      Array.isArray(images)
        ? [...new Set(images.filter((image) => typeof image === "string" && image.trim()))]
        : EMPTY_IMAGES,
    [images],
  );
  const displayName =
    typeof vehicleName === "string" && vehicleName.trim()
      ? vehicleName.trim()
      : "Move Rentals vehicle";

  const slides = useMemo(
    () => vehicleImages.map((src, index) => ({ src, alt: getImageAlt(displayName, index) })),
    [vehicleImages, displayName]
  );

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, Math.max(vehicleImages.length - 1, 0)));
  }, [vehicleImages.length]);

  const goToPrevious = useCallback(
    (e) => {
      e.stopPropagation();
      const newIndex = currentIndex === 0 ? vehicleImages.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    },
    [currentIndex, vehicleImages.length]
  );

  const goToNext = useCallback(
    (e) => {
      e.stopPropagation();
      const newIndex = currentIndex === vehicleImages.length - 1 ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    },
    [currentIndex, vehicleImages.length]
  );

  if (vehicleImages.length === 0) {
    return <div className="w-full aspect-video animate-pulse rounded-lg bg-phantom"></div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div
          className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setOpen(true)}
        >
          <img
            {...getResponsiveImageProps(vehicleImages[currentIndex], {
              widths: [640, 1200, 1600],
              quality: 80,
              fit: "contain",
            })}
            alt={getImageAlt(displayName, currentIndex)}
            width="1200"
            height="675"
            sizes="(min-width: 1024px) 720px, 100vw"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[1.03] object-contain shadow-xl"
          />
          {vehicleImages.length > 1 && (
            <>
              <CarouselArrow direction="left" onClick={goToPrevious} />
              <CarouselArrow direction="right" onClick={goToNext} />
            </>
          )}
        </div>
        {vehicleImages.length > 1 && (
          <div className="grid grid-cols-5 gap-3">
            {vehicleImages.map((src, index) => (
              <button
                key={`thumb-${src}`}
                onClick={() => setCurrentIndex(index)}
                className={`aspect-video w-full rounded-md border-2 bg-cover bg-center transition-all
                  ${
                    index === currentIndex
                      ? "border-cloud ring-2 ring-cloud/50"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }
                `}
                aria-label={`View ${displayName} image ${index + 1}`}
              >
                <img
                  {...getResponsiveImageProps(src, {
                    widths: [160, 320],
                    quality: 70,
                    fit: "contain",
                  })}
                  alt=""
                  width="160"
                  height="90"
                  sizes="(min-width: 768px) 128px, 18vw"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full scale-[1.04] object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <Suspense fallback={null}>
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={slides}
            index={currentIndex}
            on={{ view: ({ index: newIndex }) => setCurrentIndex(newIndex) }}
            styles={{ container: { backgroundColor: "rgba(30, 30, 36, .9)" } }}
          />
        </Suspense>
      )}
    </>
  );
}

export default ImageCarousel;
