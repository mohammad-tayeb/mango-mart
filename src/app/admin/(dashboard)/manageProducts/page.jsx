"use client"
import AdminProductsTable from "@/components/AdminProductsTable";
import { fetchProducts } from "@/lib/productApi";
import { useQuery } from "@tanstack/react-query";


export default function ProductTable() {
    const {
        data: products = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });


    if (isLoading)
        return (
            <div className="max-w-5xl mx-auto w-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 font-medium">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                Loading Products...
            </div>
        );

    if (isLoading) return <div className="max-w-5xl mx-auto w-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 font-medium">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
        Loading Products...
    </div>;

    if (isError) return <p>{error.message}</p>;

    return (
        <>
            <AdminProductsTable products={products} refetch={refetch}></AdminProductsTable>
        </>
    )
}