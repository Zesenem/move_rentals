import React, { useState } from 'react';

function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="w-full h-full rounded-lg bg-phantom animate-pulse"></div>;
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const imageUrl = `${images[currentIndex]}`;

  return (
    <div className="relative w-full h-full group">
      <div
        style={{ backgroundImage: `url(${imageUrl})` }}
        className="w-full h-full rounded-lg bg-center bg-cover transition-all duration-500 shadow-xl"
      ></div>
      
      <div className="absolute top-[50%] -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={goToPrevious} aria-label="Previous Image">&#10094;</button>
      </div>

      <div className="absolute top-[50%] -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={goToNext} aria-label="Next Image">&#10095;</button>
      </div>
    </div>
  );
}

export default ImageCarousel;