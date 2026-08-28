"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CategorySlider({ activeCategory = "all" }) {
    const categories = [
        { id: "all", name: "All", image: "/all.png" },
        { id: "mango", name: "আম", image: "/mango.png" },
        { id: "ghee", name: "ঘি", image: "/ghee.png" },
        { id: "honey", name: "মধু", image: "/honey.png" },
        { id: "dates", name: "খেজুর", image: "/dates.png" },
        { id: "oil", name: "তেল", image: "/oil.png" },
        { id: "nut", name: "বাদাম", image: "/nut.png" },
        { id: "nut mix", name: "বাদাম মিক্স", image: "/nut mix.png" },
        { id: "rambutan", name: "রামবুটান", image: "/rambutan.png" },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto px-1 sm:px-4 py-2 sm:py-3">
            <div className="bg-amber-50/90 rounded-full shadow-md border border-gray-100 px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-1.5 sm:gap-4">
                {categories.map((category) => {
                    const isActive = activeCategory === category.id;

                    return (
                        <Link
                            key={category.id}
                            href={
                                category.id === "all"
                                    ? "/products"
                                    : `/products?category=${encodeURIComponent(category.id)}`
                            }
                            className="flex flex-col items-center shrink-0 group transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            {/* Image */}
                            <div
                                className={`relative w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden transition-all duration-300 ${
                                    isActive
                                        ? "ring-1.5 sm:ring-2 ring-orange-500 ring-offset-1 sm:ring-offset-2"
                                        : "group-hover:ring-1.5 sm:group-hover:ring-2 group-hover:ring-orange-500 group-hover:ring-offset-1 sm:group-hover:ring-offset-2"
                                }`}
                            >
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 640px) 28px, 36px"
                                    className="object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>

                            {/* Text */}
                            <span
                                className={`mt-0.5 sm:mt-1 text-[8px] sm:text-xs font-semibold transition-colors duration-300 ${
                                    isActive
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
        </div>
    );
}