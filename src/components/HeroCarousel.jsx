"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/lib/getBanners";

const HeroCarousel = () => {
  const {
    data: slides = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });
  if (isLoading) {
    return (
      <div className="w-full h-[180px] sm:h-[280px] md:h-[400px] lg:h-[500px] bg-gray-200 animate-pulse rounded-lg" />
    );
  }
  if (isError) {
    return <p>Failed to load banners.</p>;
  }
  return (
    <div className="relative w-full md:max-w-7xl mx-auto aspect-[12/5] h-[180px] sm:h-[280px] md:h-[400px] lg:h-[500px] overflow-hidden bg-black">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={600}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className} custom-bullet"></span>`,
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id} className="relative w-full h-full">
            <Image
              src={slide.image}
              alt="banner images"
              fill
              priority={slide._id === 1}
              className="object-cover object-center"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Previous Button - Hidden on mobile, flex on desktop */}
      <button
        className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm w-9 h-12 md:w-12 md:h-16 hidden md:flex items-center justify-center rounded-r-md shadow-lg hover:scale-105 active:scale-95 transition z-30 cursor-pointer"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-orange-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      {/* Next Button - Hidden on mobile, flex on desktop */}
      <button
        className="custom-next absolute right-0 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm w-9 h-12 md:w-12 md:h-16 hidden md:flex items-center justify-center rounded-l-md shadow-lg hover:scale-105 active:scale-95 transition z-30 cursor-pointer"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-orange-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </button>

      {/* Pagination Container */}
      <div className="custom-pagination" />

      {/* Global Style Tags Enhancement */}
      <style jsx global>{`
        .custom-pagination {
          position: absolute !important;
          bottom: 12px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: auto !important;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 40;
        }

        /* Desktop responsiveness optimization for navigation bullets positioning */
        @media (min-width: 768px) {
          .custom-pagination {
            bottom: 24px !important;
            left: 32px !important;
            transform: none !important;
            gap: 8px;
          }
        }

        .custom-bullet {
          width: 6px !important;
          height: 6px !important;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .custom-bullet {
            width: 8px !important;
            height: 8px !important;
          }
        }

        .swiper-pagination-bullet-active.custom-bullet {
          width: 14px !important;
          height: 6px !important;
          border-radius: 4px;
          background: #fe7704 !important;
        }

        @media (min-width: 768px) {
          .swiper-pagination-bullet-active.custom-bullet {
            width: 18px !important;
            height: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;