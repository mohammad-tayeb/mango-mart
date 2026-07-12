"use client"

import { useState } from "react";
import useCartStore from "@/app/store/cartStore";
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast";

function ProductCard({ product }) {
    // Default to the first variant in the array if variants exist
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        if (!selectedVariant) {
            toast.error("Please select a variant");
            return;
        }

        addToCart(
            product,
            1, // default quantity
            selectedVariant
        );

        toast.success(`Added ${product.name} (${selectedVariant.quantity}) to cart`);
    };

    return (
        <div
            className="group relative border border-gray-200 rounded-lg p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-gray-300"
        >
            {/* Image */}
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-md flex items-center justify-center bg-gray-50/50">
                <Link href={`/products/${product._id}`}>
                    <Image
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={product.name}
                        width={260}
                        height={260}
                        className="object-contain max-h-[220px] transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <Link
                        href={`/products/${product._id}`}
                        className="bg-white text-gray-900 font-medium px-5 py-2.5 rounded-md text-sm shadow-md transition-transform duration-200 transform translate-y-2 group-hover:translate-y-0 hover:bg-orange-500 hover:text-white"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <h2 className="text-[21px] font-medium text-slate-800 leading-snug tracking-tight line-clamp-2 min-h-[58px]">
                        <Link href={`/products/${product._id}`}>{product.name}</Link>
                    </h2>

                    {/* Unit Price Info */}
                    {product.unitPricePerKg && (
                        <p className="text-xs text-gray-500 mt-1">
                            Unit Price: ৳{product.unitPricePerKg}/kg
                        </p>
                    )}

                    {/* Variant Selector Tabs */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 mb-3">
                            {product.variants.map((variant, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-3 py-1 text-xs font-medium border rounded-full transition-all ${selectedVariant?.quantity === variant.quantity
                                        ? "border-orange-500 bg-orange-500/10 text-orange-500"
                                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                                        }`}
                                >
                                    {variant.quantity}kg
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Pricing based on chosen Variant */}
                    <div className="mt-2 mb-5 min-h-[36px]">
                        {selectedVariant ? (
                            selectedVariant.offerPrice ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-orange-500">
                                        ৳{selectedVariant.offerPrice}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                        ৳{selectedVariant.price}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold text-orange-500">
                                    ৳{selectedVariant.price}
                                </span>
                            )
                        ) : (
                            <span className="text-sm text-gray-400">No variant available</span>
                        )}
                    </div>
                </div>

                {product.stock?.status === "out_of_stock" ? (
                    <div className="w-full py-3 rounded-md bg-gray-100 border border-gray-200 text-center">
                        <span className="font-semibold text-red-600">
                            Out of Stock
                        </span>
                    </div>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant}
                        className="w-full border border-orange-500 text-orange-500 font-medium py-3 rounded-md hover:bg-orange-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add To Cart
                    </button>
                )}
            </div>
        </div>
    )
}

export default ProductCard