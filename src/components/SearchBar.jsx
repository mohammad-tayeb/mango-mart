"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch, FaTimes } from "react-icons/fa";
import Image from "next/image";

export default function SearchBar() {
    const [open, setOpen] = useState(false);

    const { register, watch, reset } = useForm({
        defaultValues: {
            search: "",
        },
    });

    const search = watch("search");

    const { data: products = [] } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/products");
            return res.json();
        },
    });


    const filteredProducts = search.trim()
        ? products.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    return (
        <>
            {/* Search Icon */}
            <button
                onClick={() => setOpen(true)}
                className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors duration-200 focus:outline-none"
                aria-label="search"
            >
                <FaSearch size={20} />
            </button>

            {/* Search Modal */}
            {open && (
                <div className="fixed w-full inset-0 z-50 bg-black/40 backdrop-blur-sm">
                    <div className="mx-auto mt-6 max-w-4xl px-5">

                        {/* Search Input */}
                        <div className="relative">
                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                            <input
                                {...register("search")}
                                autoFocus
                                placeholder="Search products..."
                                className="h-16 w-full rounded-2xl bg-white pl-14 pr-14 text-lg shadow-xl outline-none"
                            />

                            <button
                                onClick={() => {
                                    reset();
                                    setOpen(false);
                                }}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Results */}
                        {search && (
                            <div className="mt-1.5 max-h-[60vh] overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-lg divide-y divide-gray-50">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product._id}`}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 border-gray-300 px-4 py-2.5 transition-colors hover:bg-gray-50/80"
                                        >
                                            {/* Product Thumbnail */}
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                                                <Image
                                                    src={product.images?.[0] || "/placeholder.png"}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Info Text */}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm font-medium text-gray-800">
                                                    {product.name}
                                                </h3>
                                                <p className="truncate text-xs text-gray-400 mt-0.5">
                                                    {product.category}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-sm text-gray-400 font-medium">
                                        No products found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}