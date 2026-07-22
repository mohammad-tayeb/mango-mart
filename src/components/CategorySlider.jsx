"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function CategorySlider() {
    const categories = [
        { id: 'all', name: 'All', image: '/all.png' },
        { id: 'mango', name: 'আম', image: '/mango.png' },
        { id: 'ghee', name: 'ঘি', image: '/ghee.png' },
        { id: 'honey', name: 'মধু', image: '/honey.png' },
        { id: 'dates', name: 'খেজুর', image: '/dates.png' },
        { id: 'oil', name: 'তেল', image: '/oil.png' },
    ];

    const [activeCategory, setActiveCategory] = useState('all');

    return (
        <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-2 sm:py-3">
            <div className="bg-amber-50/90 rounded-full shadow-md border border-gray-100 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-3 sm:gap-5 overflow-x-auto scrollbar-none">
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
                            onClick={() => setActiveCategory(category.id)}
                            className="flex flex-col items-center shrink-0 group transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            {/* Image */}
                            <div
                                className={`relative w-9 h-9 rounded-full overflow-hidden transition-all duration-300 ${isActive
                                        ? "ring-2 ring-orange-500 ring-offset-2"
                                        : "group-hover:ring-2 group-hover:ring-orange-500 group-hover:ring-offset-2"
                                    }`}
                            >
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="36px"
                                    className="object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>

                            {/* Text */}
                            <span
                                className={`mt-1 text-[10px] sm:text-xs font-semibold transition-colors duration-300 ${isActive
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