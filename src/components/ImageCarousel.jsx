import { useState, useMemo, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CarouselArrow = ({ direction, onClick }) => {
  const isLeft = direction === "left";
  return (
    <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? "left-3" : "right-3"} z-10`}>
      <button
        onClick={onClick}
        aria-label={isLeft ? "Previous Image" : "Next Image"}
        className="rounded-full p-3 bg-phantom/60 text-cloud hover:bg-phantom/90 transition-all duration-300 opacity-100 md:opacity-0 group-hover:opacity-100"
      >
        {isLeft ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    </div>
  );
};

function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const slides = useMemo(() => images.map((src) => ({ src })), [images]);

  const goToPrevious = useCallback(
    (e) => {
      e.stopPropagation();
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    },
    [currentIndex, images.length]
  );

  const goToNext = useCallback(
    (e) => {
      e.stopPropagation();
      const isLastSlide = currentIndex === images.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    },
    [currentIndex, images.length]
  );

  if (!images || images.length === 0) {
    return <div className="w-full h-full rounded-lg bg-phantom animate-pulse"></div>;
  }

  return (
    <>
      <div
        className="relative w-full h-full group cursor-pointer overflow-hidden rounded-lg"
        onClick={() => setOpen(true)}
      >
        <div
          style={{ backgroundImage: `url(${slides[currentIndex].src})` }}
          className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105 shadow-xl"
        ></div>

        <CarouselArrow direction="left" onClick={goToPrevious} />
        <CarouselArrow direction="right" onClick={goToNext} />
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
        on={{ view: ({ index: newIndex }) => setCurrentIndex(newIndex) }}
        styles={{ container: { backgroundColor: "rgba(30, 30, 36, .9)" } }}
      />
    </>
  );
}

export default ImageCarousel;
