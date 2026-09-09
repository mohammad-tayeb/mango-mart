"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function CategorySlider({ activeCategory = "all" }) {
    const categories = [
        { id: "all", name: "All", image: "/all.png" },
        { id: "mango", name: "আম", image: "/mango.png" },
        { id: "ghee", name: "ঘি", image: "/ghee.png" },
        { id: "honey", name: "মধু", image: "/honey.png" },
        { id: "dates", name: "খেজুর", image: "/dates.png" },
        { id: "oil", name: "তেল", image: "/oil.png" },
        { id: "nut", name: "বাদাম", image: "/nut.png" },
        { id: "nut mix", name: "মিক্স বাদাম", image: "/mixnuts.png" },
        { id: "rambutan", name: "রামবুটান", image: "/rambutan.png" },
    ];

    const sliderRef = useRef(null);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = () => {
        const slider = sliderRef.current;

        if (!slider) return;

        setCanScrollRight(
            slider.scrollLeft + slider.clientWidth <
            slider.scrollWidth - 5
        );
    };

    useEffect(() => {
        const slider = sliderRef.current;

        if (!slider) return;

        updateScrollState();

        slider.addEventListener("scroll", updateScrollState);
        window.addEventListener("resize", updateScrollState);

        return () => {
            slider.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, []);

    const scrollRight = () => {
        const slider = sliderRef.current;

        if (!slider) return;

        slider.scrollBy({
            left: slider.clientWidth * 0.7,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative mx-auto w-full max-w-2xl px-2 py-2 sm:px-4 sm:py-3">
            {/* Category Slider */}
            <div
                ref={sliderRef}
                className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto rounded-lg border border-gray-100 bg-amber-50/90 px-3 py-2.5 shadow-md scrollbar-none scroll-smooth sm:gap-5 sm:rounded-full sm:px-4"
            >
                {categories.map((category) => {
                    const isActive = activeCategory === category.id;

                    return (
                        <Link
                            key={category.id}
                            href={
                                category.id === "all"
                                    ? "/products"
                                    : `/products?category=${category.id}`
                            }
                            className="group flex shrink-0 flex-col items-center transition-transform duration-200 hover:scale-105 active:scale-95"
                        >
                            {/* Category Image */}
                            <div
                                className={`relative h-9 w-9 overflow-hidden rounded-full transition-all duration-200 ${isActive
                                    ? "ring-2 ring-orange-500 ring-offset-2"
                                    : "group-hover:ring-2 group-hover:ring-orange-500 group-hover:ring-offset-2"
                                    }`}
                            >
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="36px"
                                    className="rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
                                />
                            </div>

                            {/* Category Name */}
                            <span
                                className={`mt-1 whitespace-nowrap text-[10px] font-semibold transition-colors duration-200 sm:text-xs ${isActive
                                    ? "text-orange-500"
                                    : "text-gray-600 group-hover:text-orange-500"
                                    }`}
                            >
                                {category.name}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* More Categories Button */}
            {canScrollRight && (
                <div className="absolute right-2 top-2 bottom-2 flex w-14 items-center justify-end rounded-r-lg bg-gradient-to-l from-amber-50 via-amber-50/90 to-transparent sm:right-4 sm:top-3 sm:bottom-3 sm:rounded-r-full">
                    <button
                        onClick={scrollRight}
                        type="button"
                        aria-label="Show more categories"
                        className="mr-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white/95 text-base font-bold text-orange-500 shadow-sm transition-all hover:scale-110 hover:bg-orange-500 hover:text-white active:scale-95 sm:h-8 sm:w-8 sm:text-lg"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}

