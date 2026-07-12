import { getFeaturedProducts } from "@/lib/getProducts";
import ProductCard from "./ProductCard";
import React from 'react';
import Image from "next/image";
export default async function FeaturedProducts() {
    const products = await getFeaturedProducts();
    return (
        <div className="p-6 flex flex-col items-center justify-center">
            <div className="space-y-1 text-start mb-8 flex flex-col items-center">
                {/* Clean, Bright Order Now Badge */}
                <div className="mb-6">
                    <Image
                        src="/order.png"
                        alt="Mango Lovers Logo"
                        width={600}
                        height={600}
                        className="w-36 sm:w-44 md:w-52 lg:w-64 xl:w-72 h-auto object-contain"
                    />
                </div>

                {/* Aligned Heading with subtle gradient depth */}
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r pb-4 from-slate-900 via-orange-950 to-slate-900 bg-clip-text text-transparent">
                    আমাদের পণ্যসমূহ
                </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 -mt-3 gap-6 px-6">
                {products.map((product) => (
                    <ProductCard key={product._id.toString()} product={product}></ProductCard>
                ))}
            </div>
        </div>
    );
}
