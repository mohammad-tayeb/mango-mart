"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

export default function Reviews() {
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const res = await fetch("/api/reviews");
            return res.json();
        },
    });

    const [swiper, setSwiper] = useState(null);

    if (isLoading) return <div className="text-center py-12">Loading...</div>;

    return (
        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans mt-10">
            <div className="max-w-4xl mx-auto text-center">
                {/* Top Tag */}
                <span className="inline-block text-xs font-semibold tracking-wider text-[#FE7704] uppercase bg-[#fef2f2] px-3 py-1 rounded-full border border-[#fecaca] mb-3">
                    Happy Customers
                </span>

                {/* Headings */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1f2937] mb-2">
                    গ্রাহকদের মুখে আমাদের গল্প
                </h2>
                <p className="text-sm sm:text-base text-[#4b5563] mb-8">
                    আপনাদের আস্থা ও সমর্থনেই আমাদের পথচলা।
                </p>

                {/* Swiper Wrapper with Navigation Buttons */}
                <div className="relative px-4 sm:px-20">
                    <Swiper
                        modules={[Pagination]}
                        onSwiper={setSwiper}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={reviews.length > 1}
                        pagination={{
                            clickable: true,
                        }}
                        className="!pb-16 md:w-[600px] w-[240px] mx-auto"// Added max-width here so cards stay crisp, leaving arrows untouched
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review._id || review.id}>
                                <div className="h-full w-full bg-white border-2 border-[#FE7704] rounded-2xl p-6 shadow-sm flex flex-col justify-between text-left">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex gap-0.5 text-[#FE7704]">
                                                {[...Array(review.rating || 5)].map((_, i) => (
                                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm italic leading-relaxed mb-6 font-medium">
                                            &quot;{review.review}&quot;
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                                        <div className="w-10 h-10 rounded-full bg-[#fef2f2] border border-[#fecaca] text-[#FE7704] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                            {review.customer
                                                ? review.customer.split(" ").map((name) => name[0]).join("").slice(0, 2)
                                                : "U"}
                                        </div>

                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                                                {review.customer || "Anonymous"}
                                            </h4>
                                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold mt-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                                Verified Customer
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Left Navigation Arrow (Original position classes restored) */}
                    <button
                        onClick={() => swiper?.slidePrev()}
                        className="absolute top-1/2 left-0 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Navigation Arrow (Original position classes restored) */}
                    <button
                        onClick={() => swiper?.slideNext()}
                        className="absolute top-1/2 right-0 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* "See All Reviews" Button */}
                <Link href="/reviews" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 border border-[#FE7704] text-[#FE7704] rounded-full font-medium text-sm hover:bg-[#fef2f2] transition-colors focus:outline-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    সব রিভিউ দেখুন
                </Link>

                {/* Bottom Banner Section */}
                <div className="mt-14 bg-[#FE7704] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-1">
                            Love Our Products?
                        </h3>
                        <p className="text-sm text-red-100">
                            Share your experience and help others discover our products.
                        </p>
                    </div>
                    <Link href="/reviews" className="whitespace-nowrap px-6 py-2.5 bg-white text-[#FE7704] rounded-full font-semibold text-sm hover:bg-red-50 transition-colors focus:outline-none shadow-sm">
                        Write a Review
                    </Link>
                </div>
            </div>
        </section>
    );
}