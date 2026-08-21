import { lazy, Suspense, useState, useMemo, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  const vehicleImages = Array.isArray(images) ? images : EMPTY_IMAGES;
  const displayName =
    typeof vehicleName === "string" && vehicleName.trim()
      ? vehicleName.trim()
      : "Move Rentals vehicle";

  const slides = useMemo(
    () => vehicleImages.map((src, index) => ({ src, alt: getImageAlt(displayName, index) })),
    [vehicleImages, displayName]
  );

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
          {vehicleImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={getImageAlt(displayName, index)}
              loading="lazy"
              className={`
                absolute inset-0 h-full w-full object-cover shadow-xl 
                transition-opacity duration-500 ease-in-out
                ${index === currentIndex ? "opacity-100" : "opacity-0"}
              `}
            />
          ))}
          <CarouselArrow direction="left" onClick={goToPrevious} />
          <CarouselArrow direction="right" onClick={goToNext} />
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
                style={{ backgroundImage: `url(${src})` }}
                aria-label={`View ${displayName} image ${index + 1}`}
              />
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
