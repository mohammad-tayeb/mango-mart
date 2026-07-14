import { getFeaturedProducts } from "@/lib/getProducts";
import ProductCard from "./ProductCard";
import React from 'react';
export default async function FeaturedProducts() {
    const products = await getFeaturedProducts();
    return (
        <div className="p-6 flex flex-col items-center justify-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight pb-4 mb-4 text-gray-700">
                আমাদের পণ্যসমূহ
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 -mt-3 gap-6 px-6">
                {products.map((product) => (
                    <ProductCard key={product._id.toString()} product={product}></ProductCard>
                ))}
            </div>
        </div>
    );
}
