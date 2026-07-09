"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar() {
    const [open, setOpen] = useState(false);

    const { register, watch, reset } = useForm({
        defaultValues: {
            search: "",
        },
    });

    const search = watch("search");

    // Replace with API data
    const products = [
        { id: 1, name: "LED Head Light", category: "Lighting" },
        { id: 2, name: "Bike Horn", category: "Accessories" },
        { id: 3, name: "LED Fog Light", category: "Lighting" },
        { id: 4, name: "Helmet", category: "Safety" },
    ];


    const { data: products2 = [] } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/products");
            return res.json();
        },
    });

    console.log(products2)


    const filteredProducts = products2.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* Search Icon */}
            <button
                onClick={() => setOpen(true)}
                className="btn btn-ghost btn-circle"
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
                            <div className="mt-2 overflow-hidden rounded-2xl bg-white shadow-xl">

                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product._id}`}
                                            onClick={() => setOpen(false)}
                                            className="block border-b last:border-none px-5 py-4 hover:bg-gray-50 transition"
                                        >
                                            <h3 className="font-semibold">
                                                {product.name}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                {product.category}
                                            </p>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500">
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