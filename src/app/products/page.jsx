import Pagination from "@/components/Pagination";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/getProducts";
import { Suspense } from "react";

export default async function Products({ searchParams }) {
    const params = await searchParams;      // Read URL query parameters
    const page = Number(params.page) || 1;  // at first the url is "/products" so we are manually setting the  page number 1 and loading the data. "/products?page=2,3,4" this is created when we click the pagination buttons 
    const category = params.category || "";
    const limit = 8;

    const { products, totalPages } = await getProducts(page, limit, category);

    return (
        <div className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                ))}
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                />
            </Suspense>
        </div>
    );
}