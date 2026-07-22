"use client";

import { useState } from "react";
import useCartStore from "@/app/store/cartStore";
import Link from "next/link";
import toast from "react-hot-toast";

function ProductCard({ product }) {
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants?.[0] || null
    );

    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        if (!selectedVariant) {
            toast.error("Please select a variant");
            return;
        }

        addToCart(product, 1, selectedVariant);

        toast.success(
            `Added ${product.name} (${selectedVariant.quantity}kg) to cart`
        );
    };

    const discountPercentage =
        selectedVariant?.offerPrice &&
            selectedVariant.price > selectedVariant.offerPrice
            ? Math.round(
                ((selectedVariant.price - selectedVariant.offerPrice) /
                    selectedVariant.price) *
                100
            )
            : null;
    return (
        <div className="group relative border border-gray-200 rounded-lg p-2 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-gray-300">
            {/* Image */}
            <div className="relative w-full aspect-square mb-2 sm:mb-3 overflow-hidden rounded-md bg-gray-50/50">
                <Link href={`/products/${product._id}`} className="block w-full h-full">
                    {discountPercentage && (
                        <div className="absolute top-2 right-2 z-20 rounded-full bg-[#34be82] px-2 py-1 text-[10px] sm:text-xs font-bold text-white shadow-md">
                            Save {discountPercentage}%
                        </div>
                    )}
                    <img
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <Link
                        href={`/products/${product._id}`}
                        className="bg-white text-gray-900 font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs shadow-md transition-transform duration-200 transform translate-y-2 group-hover:translate-y-0 hover:bg-orange-500 hover:text-white"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <h2 className="text-sm pt-1 sm:text-lg font-medium text-slate-800 leading-tight tracking-tight line-clamp-2 min-h-[32px] sm:min-h-[46px]">
                        <Link href={`/products/${product._id}`}>
                            {product.name}
                        </Link>
                    </h2>

                    {/* Unit Price */}
                    {product.unitPricePerKg && (
                        <p className="text-[9px] sm:text-[11px] text-gray-500 mt-0.5">
                            Unit Price: ৳{product.unitPricePerKg}/kg
                        </p>
                    )}

                    {/* Variant Selector */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5 mb-1.5">
                            {product.variants.map((variant, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-medium border rounded-full transition-all ${selectedVariant?.quantity === variant.quantity
                                        ? "border-orange-500 bg-orange-500/10 text-orange-500"
                                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                                        }`}
                                >
                                    {variant.quantity}kg
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Pricing */}
                    <div className="mt-1 mb-2 sm:mb-3 min-h-[22px] sm:min-h-[30px]">
                        {selectedVariant ? (
                            selectedVariant.offerPrice ? (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-base sm:text-xl font-bold text-orange-500">
                                        ৳{selectedVariant.offerPrice}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                                        ৳{selectedVariant.price}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-base sm:text-xl font-bold text-orange-500">
                                    ৳{selectedVariant.price}
                                </span>
                            )
                        ) : (
                            <span className="text-[10px] sm:text-xs text-gray-400">
                                No variant available
                            </span>
                        )}
                    </div>
                </div>

                {product.stock?.status === "out_of_stock" ? (
                    <div className="w-full py-1.5 sm:py-2 rounded-md bg-gray-100 border border-gray-200 text-center">
                        <span className="text-xs sm:text-sm font-semibold text-red-600">
                            Out of Stock
                        </span>
                    </div>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant}
                        className="w-full border border-orange-500 text-orange-500 font-medium pb-1.5 sm:py-2 text-xs sm:text-sm rounded-md hover:bg-orange-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add To Cart
                    </button>
                )}
            </div>
        </div>
    );
}

export default ProductCard;