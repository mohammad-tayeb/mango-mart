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

    if (isLoading) return <p>Loading...</p>;

    if (isError) return <p>{error.message}</p>;

    return (
        <AdminProductsTable products={products} refetch={refetch}></AdminProductsTable>
    )
}