export const revalidate = 60;
import { FaBoxOpen } from "react-icons/fa6";
import Pagination from "@/components/Pagination";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/getProducts";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CategorySlider from "@/components/CategorySlider";

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const category = params.category || "Products";
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    return {
        title: `Premium ${formattedCategory} | Mango Mart BD`,
        description: `Buy fresh ${formattedCategory} online in Bangladesh. Best quality guaranteed.`,
    };
}

export default async function Products({ searchParams }) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const category = params.category || "";
    const limit = 8;

    const { products, totalPages } = await getProducts(page, limit, category);

    return (
        <>
            <div>
                <div className="sticky md:top-12 top-14 z-40 w-full">
                    <CategorySlider />
                </div>
                <Breadcrumb category={category} />
                <div className="mb-10">
                    {products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 mt-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 gap-4 sm:px-6 px-3">
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
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 mt-10 px-6 text-center">
                            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                                <FaBoxOpen className="text-4xl text-orange-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                No Products Found
                            </h2>

                            <p className="mt-2 max-w-md text-gray-500">
                                Products will be available soon. Please check back later for our
                                latest collection.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}