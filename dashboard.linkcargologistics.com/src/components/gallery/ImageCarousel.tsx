'use client';

/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ImageCarouselProps {
  images: string[];
}

interface SlideButtonProps {
  onClick: () => void;
  ariaLabel: string;
  direction: "left" | "right";
}

const SlideButton: React.FC<SlideButtonProps> = ({ onClick, ariaLabel, direction }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-3 shadow-md hover:bg-gray-100 transition-all duration-300 ${
      direction === "left" ? "left-4" : "right-4"
    }`}
    aria-label={ariaLabel}
  >
    {direction === "left" ? <FaArrowLeft size={20} /> : <FaArrowRight size={20} />}
  </button>
);

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const goToPrevious = (): void => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (): void => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
  };

  return (
    <div className="max-w-8xl mx-auto mt-6">
      {/* Carrusel Principal */}
      <div className="relative group">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-auto rounded-lg transform transition-transform duration-500 ease-in-out hover:scale-105"
        />
        {/* Botón Izquierdo */}
        <SlideButton onClick={goToPrevious} ariaLabel="Anterior" direction="left" />
        {/* Botón Derecho */}
        <SlideButton onClick={goToNext} ariaLabel="Siguiente" direction="right" />
      </div>

      {/* Miniaturas */}
      <div className="mt-4 flex gap-2 justify-center">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={`cursor-pointer rounded-md border-2 transition-transform duration-300 ${
              currentIndex === index
                ? "border-blue-500 scale-105"
                : "border-gray-200 hover:border-gray-400 hover:scale-105"
            } w-16 h-16 object-cover`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
