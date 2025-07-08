import React, { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (!images || images.length === 0) {
    return <div className="w-full h-full rounded-lg bg-phantom animate-pulse"></div>;
  }

  const goToPrevious = (e) => {
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e) => {
    e.stopPropagation(); 
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const slides = images.map(url => ({ src: `${url}` }));

  return (
    <>
      <div 
        className="relative w-full h-full group cursor-pointer" 
        onClick={() => setOpen(true)} 
      >
        <div
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
          className="w-full h-full rounded-lg bg-center bg-cover transition-all duration-500 shadow-xl"
        ></div>
        
        <div className="absolute top-[50%] -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={goToPrevious} aria-label="Previous Image">&#10094;</button>
        </div>

        <div className="absolute top-[50%] -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={goToNext} aria-label="Next Image">&#10095;</button>
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
        on={{ view: ({ index: newIndex }) => setCurrentIndex(newIndex) }}
      />
    </>
  );
}

export default ImageCarousel;