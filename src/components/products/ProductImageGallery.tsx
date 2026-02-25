"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = Array.isArray(images) && images.length > 0;
  const currentImage = hasImages ? images[activeIndex] : null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="group bg-gray-50 rounded-lg aspect-square flex items-center justify-center overflow-hidden border border-gray-100 relative">
        {hasImages ? (
          <>
            <Image
              src={currentImage!}
              alt={`${productName} - View ${activeIndex + 1}`}
              fill
              className="object-contain p-4 transition-all duration-300"
              priority
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Pagination Dots (Optional for mobile feel) */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === idx ? "bg-blue-600 w-4" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <ImageIcon className="h-16 w-16 mb-2 opacity-20" />
            <span className="text-sm font-medium">No image available</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`aspect-square relative rounded-md border-2 overflow-hidden bg-gray-50 transition-all duration-200 ${
                activeIndex === idx
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <Image
                src={url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  activeIndex === idx
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
