import { getFeaturedProducts } from "@/lib/getProducts";
import ProductCard from "./ProductCard";
import React from 'react';
export default async function FeaturedProducts() {
    const products = await getFeaturedProducts();
    return (
        <div className="p-6 flex flex-col items-center justify-center md:mt-3 mt-2">
            <div className="space-y-3 text-start mb-8 flex flex-col items-center">
                {/* Clean, Bright Order Now Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500 text-md font-bold tracking-wider uppercase text-white">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Order Now
                </div>

                {/* Aligned Heading with subtle gradient depth */}
                <h1 className="text-3xl pb-2 sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 bg-clip-text text-transparent">
                    আমাদের পণ্যসমূহ
                </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                {products.map((product) => (
                    <ProductCard key={product._id.toString()} product={product}></ProductCard>
                ))}
            </div>
        </div>
    );
}
