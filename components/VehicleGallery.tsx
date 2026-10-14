"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type VehicleGalleryProps = {
  images: string[];
  vehicleName: string;
};

export function VehicleGallery({
  images,
  vehicleName,
}: VehicleGalleryProps) {
  const galleryImages = images.filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);
const touchStartY = useRef<number | null>(null);

function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
  const touch = event.touches[0];

  touchStartX.current = touch.clientX;
  touchStartY.current = touch.clientY;
}

function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
  if (touchStartX.current === null || touchStartY.current === null) {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX.current;
  const deltaY = touch.clientY - touchStartY.current;

  touchStartX.current = null;
  touchStartY.current = null;

  // Ignore taps, short movements, and primarily vertical gestures.
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
    return;
  }

  if (deltaX < 0) {
    showNext();
  } else {
    showPrevious();
  }
}

  if (galleryImages.length === 0) {
    return null;
  }

  const activeImage = galleryImages[activeIndex];

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0
        ? galleryImages.length - 1
        : current - 1
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === galleryImages.length - 1
        ? 0
        : current + 1
    );
  }

  function openLightbox() {
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <>
     
      <section className="bg-white px-5 py-12 md:px-10 md:py-28">
 
        <div className="mx-auto max-w-[1300px]">

          {/* Section heading */}
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-black/75">
                Vehicle gallery
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-[0.92] tracking-[-0.045em] text-black md:text-6xl">
                Every detail.
              </h2>
            </div>

            <p className="hidden text-[9px] font-medium uppercase tracking-[0.2em] text-black/40 sm:block">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(galleryImages.length).padStart(2, "0")}
            </p>
          </div>

          {/* Main image */}
          <div className="group relative aspect-[16/10] overflow-hidden bg-[#f3f3f1]">

            {/* Full image click target */}
            <button
              type="button"
              onClick={openLightbox}
              aria-label="Open vehicle image fullscreen"
              className="absolute inset-0 z-10 cursor-zoom-in"
            />

            <Image
              key={activeImage}
              src={activeImage}
              alt={`${vehicleName} — image ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 1300px"
              unoptimized
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.012]"
            />

            {/* Very subtle image protection — no dark overlay */}
            <div className="pointer-events-none absolute inset-0 bg-black/[0.02]" />

            {/* Fullscreen button */}
            <div className="pointer-events-none absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center border border-black/15 bg-white/90 text-black backdrop-blur-sm">
              <Maximize2
                size={15}
                strokeWidth={1.2}
              />
            </div>

            {/* Counter */}
            <div className="pointer-events-none absolute bottom-5 left-5 z-20 border border-black/15 bg-white/90 px-3 py-2 backdrop-blur-sm">
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-black/70">
                {String(activeIndex + 1).padStart(2, "0")}{" "}
                /{" "}
                {String(galleryImages.length).padStart(2, "0")}
              </span>
            </div>

            {/* Navigation */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-5 right-5 z-20 flex gap-1">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showPrevious();
                  }}
                  aria-label="Previous image"
                  className="flex h-10 w-10 items-center justify-center border border-black/15 bg-white/90 text-black transition hover:bg-black hover:text-white"
                >
                  <ChevronLeft
                    size={17}
                    strokeWidth={1.2}
                  />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showNext();
                  }}
                  aria-label="Next image"
                  className="flex h-10 w-10 items-center justify-center border border-black/15 bg-white/90 text-black transition hover:bg-black hover:text-white"
                >
                  <ChevronRight
                    size={17}
                    strokeWidth={1.2}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7 md:gap-3">
              {galleryImages.map((image, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={isActive}
                    className={`group relative aspect-[4/3] overflow-hidden bg-[#f3f3f1] transition ${
                      isActive
                        ? "ring-1 ring-black"
                        : "opacity-55 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${vehicleName} thumbnail ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 180px"
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-[1.035]"
                    />

                    {/* Thumbnail number */}
                    <span
                      className={`absolute bottom-2 left-2 text-[8px] font-medium tracking-[0.15em] ${
                        isActive
                          ? "text-white drop-shadow-md"
                          : "text-white drop-shadow-md"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Active border */}
                    {isActive && (
                      <span className="absolute inset-0 border border-black" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${vehicleName} image viewer`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center border border-white/20 bg-white text-black transition hover:bg-black hover:text-white hover:border-white/40 md:right-8 md:top-8"
          >
            <X
              size={19}
              strokeWidth={1.2}
            />
          </button>

          {/* Counter */}
          <div className="absolute left-5 top-6 z-30 text-[9px] font-medium uppercase tracking-[0.22em] text-white/60 md:left-8 md:top-9">
            {String(activeIndex + 1).padStart(2, "0")}{" "}
            /{" "}
            {String(galleryImages.length).padStart(2, "0")}
          </div>


          {/* Image */}
          <div className="relative h-full w-full max-w-[1500px]">
            <Image
              key={activeImage}
              src={activeImage}
              alt={`${vehicleName} — image ${activeIndex + 1}`}
              fill
              sizes="100vw"
              unoptimized
              className="object-contain"
              priority
            />
          </div>

              {/* Swipe hint */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.2em] text-white/45">
                  <span aria-hidden="true">←</span>
                  <span>Swipe to explore</span>
                  <span aria-hidden="true">→</span>
                </div>
              )}


        </div>
      )}
    </>
  );
}