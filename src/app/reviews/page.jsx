"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";

export default function Page() {
    const [visible, setVisible] = useState(6);
    const [rating, setRating] = useState(0);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            customer: "",
            product: "",
            review: "",
            rating: 0,
        },
    });

    const onSubmit = async (data) => {
        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.insertedId || result.success) {
            toast.success("Thank you for your feedback!");
            reset();
            setRating(0);
            document.getElementById("review_modal").close();
        } else {
            toast.error("Failed to submit review.");
        }
    };
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const res = await fetch("/api/reviews");
            return res.json();
        },
    });

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
                reviews.length
            ).toFixed(1)
            : 0;
    const visibleReviews = reviews.slice(0, visible);

    return (
        <div>
            <section className="w-full bg-gradient-to-r from-orange-500 via-[#f3780c] to-[#fa7a0a] text-white py-12 px-4 text-center select-none font-sans">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    {/* Main Heading */}
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                        Customer Reviews
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-red-100/90 font-medium max-w-xl mb-8">
                        Real feedback from real customers who love our products
                    </p>

                    {/* Stats Grid */}
                    <div className="flex items-center justify-center gap-6 sm:gap-12 mb-8">
                        {/* Reviews Counter */}
                        <div className="text-center min-w-[70px]">
                            <div className="text-xl sm:text-2xl font-bold">{reviews.length}</div>
                            <div className="text-[10px] sm:text-xs font-bold tracking-wider text-red-200 uppercase mt-1">
                                Reviews
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-[1px] bg-red-400/50" />

                        {/* Average Rating */}
                        <div className="text-center min-w-[90px]">
                            <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-bold">
                                {/* Star Icon */}
                                <svg
                                    className="w-5 h-5 fill-[#facc15] text-[#facc15]"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>{averageRating}</span>
                            </div>
                            <div className="text-[10px] sm:text-xs font-bold tracking-wider text-red-200 uppercase mt-1">
                                Average Rating
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-[1px] bg-red-400/50" />

                        {/* Verified Counter */}
                        <div className="text-center min-w-[70px]">
                            <div className="text-xl sm:text-2xl font-bold">100%</div>
                            <div className="text-[10px] sm:text-xs font-bold tracking-wider text-red-200 uppercase mt-1">
                                Verified
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => document.getElementById("review_modal").showModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/50 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full font-bold text-sm tracking-wide transition-all focus:outline-none shadow-sm backdrop-blur-sm group">
                        {/* Edit/Pencil Icon */}
                        <svg
                            className="w-4 h-4 text-white group-hover:scale-105 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                        </svg>
                        Share Your Experience
                    </button>
                </div>
            </section>

            {!isLoading ? (<section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {visibleReviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white border-2 border-orange-500 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex gap-0.5 text-orange-500">
                                        {[...Array(review.rating)].map((_, i) => (
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
                                <div className="w-10 h-10 rounded-full bg-[#fef2f2] border border-[#fecaca] text-orange-500 flex items-center justify-center font-bold text-xs uppercase">
                                    {review.customer
                                        .split(" ")
                                        .map((name) => name[0])
                                        .join("")
                                        .slice(0, 2)}
                                </div>

                                <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                                        {review.customer}
                                    </h4>

                                    <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                        Verified Customer
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {visible < reviews.length && (
                    <div className="flex justify-center mt-6 mb-10">
                        <button
                            onClick={() => setVisible((prev) => prev + 6)}
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-[#ff8c27] transition"
                        >
                            View More
                        </button>
                    </div>
                )}
            </section>) : (
                (<section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 rounded bg-gray-200"
                                        />
                                    ))}
                                </div>

                                {/* Review Text */}
                                <div className="space-y-3 mb-8">
                                    <div className="h-3 rounded bg-gray-200 w-full"></div>
                                    <div className="h-3 rounded bg-gray-200 w-11/12"></div>
                                    <div className="h-3 rounded bg-gray-200 w-10/12"></div>
                                    <div className="h-3 rounded bg-gray-200 w-8/12"></div>
                                </div>

                                {/* Customer */}
                                <div className="flex items-center gap-3 border-t pt-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>

                                    <div className="flex-1">
                                        <div className="h-3 w-24 rounded bg-gray-200 mb-2"></div>
                                        <div className="h-2 w-20 rounded bg-gray-100"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>)
            )}
            <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-xl p-6 relative rounded-2xl shadow-xl bg-base-100">

                    {/* Top-Right Close Button */}
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
                        onClick={() => {
                            reset();
                            setRating(0);
                            document.getElementById("review_modal").close();
                        }}
                    >
                        ✕
                    </button>

                    {/* Header Section */}
                    <div className="mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-1">
                            Share Your Feedback
                        </h3>
                        <p className="text-sm text-base-content/70">
                            Your experience matters deeply to us. Your feedback helps us constantly improve our products and services.
                        </p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Name Input */}
                        <div className="form-control w-full">
                            <label className="label py-1">
                                <span className="label-text font-medium text-base-content/80">Full Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${errors.name ? 'input-error' : ''}`}
                                {...register("customer", { required: "Name is required" })}
                            />
                            {errors.customer && (
                                <p className="mt-1.5 text-xs text-error font-medium flex items-center gap-1">
                                    {errors.customer.message}
                                </p>
                            )}
                        </div>

                        {/* Product Input */}
                        <div className="form-control w-full">
                            <label className="label py-1">
                                <span className="label-text font-medium text-base-content/80">Product Purchased (optional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter the product name"
                                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${errors.product ? 'input-error' : ''}`}
                                {...register("product")}
                            />
                            {errors.product && (
                                <p className="mt-1.5 text-xs text-error font-medium flex items-center gap-1">
                                    {errors.product.message}
                                </p>
                            )}
                        </div>

                        {/* Rating Section */}
                        <div className="form-control w-full">
                            <label className="label py-1">
                                <span className="label-text font-medium text-base-content/80">Your Rating</span>
                            </label>
                            <input
                                type="hidden"
                                {...register("rating", {
                                    validate: (value) =>
                                        Number(value) > 0 || "Please select a rating",
                                })}
                            />
                            <div className="flex gap-2 p-1 items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="hover:scale-110 transition-transform duration-150 focus:outline-none"
                                        onClick={() => {
                                            setRating(star);
                                            setValue("rating", star, { shouldValidate: true });
                                        }}
                                    >
                                        <FaStar
                                            size={32}
                                            className={`transition-colors duration-200 cursor-pointer ${star <= rating ? "text-amber-400" : "text-base-content/20"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {errors.rating && (
                                <p className="mt-1.5 text-xs text-error font-medium flex items-center gap-1">
                                    {errors.rating.message}
                                </p>
                            )}
                        </div>

                        {/* Review Textarea */}
                        <div className="form-control w-full">
                            <label className="label py-1">
                                <span className="label-text font-medium text-base-content/80">Review Comments</span>
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Write about your experience with this product..."
                                className={`textarea textarea-bordered w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 leading-relaxed ${errors.review ? 'textarea-error' : ''}`}
                                {...register("review", { required: "Review message is required" })}
                            />
                            {errors.review && (
                                <p className="mt-1.5 text-xs text-error font-medium flex items-center gap-1">
                                    {errors.review.message}
                                </p>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="modal-action pt-2 flex gap-3 justify-end">
                            <button
                                type="button"
                                className="btn btn-outline btn-sm sm:btn-md min-w-[100px] border-base-content/20 hover:bg-base-200 hover:text-base-content"
                                onClick={() => {
                                    reset();
                                    setRating(0);
                                    document.getElementById("review_modal").close();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn bg-orange-500 btn-sm sm:btn-md min-w-[140px] text-white tracking-wide shadow-md"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    "Submit Review"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Backdrop click to close overlay */}
                <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-sm">
                    <button onClick={() => { reset(); setRating(0); }}>close</button>
                </form>
            </dialog>
        </div>
    )
}
