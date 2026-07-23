"use client"

import Link from "next/link"
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiPencilAlt } from "react-icons/hi"
import { HiTrash } from "react-icons/hi2"
import { useSearchParams, useRouter } from "next/navigation";

function AdminProductsTable({ products = [], refetch }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const category = searchParams.get("category") || "all";

    const handleCategoryChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "all") {
            params.delete("category");
        } else {
            params.set("category", value);
        }

        router.replace(`?${params.toString()}`);
    };

    const handleProductDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Delete failed");
            }

            toast.success("Product deleted successfully");
            refetch();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const { register, watch } = useForm({
        defaultValues: {
            search: "",
        },
    });

    const search = watch("search");

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory =
                category === "all" ||
                product.category?.toLowerCase() === category;

            const matchesSearch =
                !search.trim() ||
                product.name?.toLowerCase().includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [products, category, search]);

    return (
        <div className="w-full flex flex-col h-[calc(100vh-120px)] min-h-[500px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            {/* 1. FIXED SEARCH BAR AREA */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-100 p-4 shrink-0">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-md w-full">
                        <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                {/* Search icon */}
                            </span>

                            <input
                                {...register("search")}
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="select select-bordered select-sm w-full md:w-40"
                    >
                        <option value="all">All Products</option>
                        <option value="mango">Mango</option>
                        <option value="honey">Honey</option>
                        <option value="ghee">Ghee</option>
                    </select>
                </div>
            </div>

            {/* 2. SCROLLABLE TABLE CONTAINER */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">

                    {/* 3. FIXED TABLE HEADERS */}
                    <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <th className="py-3.5 px-5 font-medium bg-slate-50">PRODUCT</th>
                            <th className="py-3.5 px-5 font-medium bg-slate-50">CATEGORY</th>
                            <th className="py-3.5 px-5 font-medium bg-slate-50">PRICE</th>
                            <th className="py-3.5 px-5 font-medium bg-slate-50">VARIANTS (PRICE)</th>
                            <th className="py-3.5 px-5 font-medium bg-slate-50">STOCK STATUS</th>
                            <th className="py-3.5 px-5 font-medium text-right bg-slate-50">ACTION</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    className="hover:bg-slate-50/50 transition-colors duration-150 group"
                                >
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                            <div className="max-w-[200px] sm:max-w-[250px]">
                                                <p className="font-semibold text-slate-900 truncate">
                                                    {product.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-5 align-middle">
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 uppercase">
                                            {product.category}
                                        </span>
                                    </td>

                                    <td className="py-4 px-5 align-middle font-medium text-slate-900">
                                        ৳{product.unitPricePerKg}
                                    </td>

                                    <td className="py-4 px-5 align-middle">
                                        <div className="flex flex-col gap-1">
                                            {product.variants?.length > 0 ? (
                                                product.variants.map((v, idx) => (
                                                    <div key={idx} className="text-xs text-slate-600">
                                                        <span className="font-semibold text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 mr-1">
                                                            {v.quantity}
                                                        </span>
                                                        {v.offerPrice ? (
                                                            <>
                                                                <span className="text-emerald-600 font-medium">৳{v.offerPrice}</span>
                                                                <span className="text-slate-400 line-through ml-1 text-[10px]">৳{v.price}</span>
                                                            </>
                                                        ) : (
                                                            <span>৳{v.price}</span>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-4 px-5 align-middle">
                                        <div className="flex flex-col items-start gap-1">
                                            {product.stock?.status === 'out_of_stock' ? (
                                                <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                    Out of Stock
                                                </span>
                                            ) : product.stock?.quantity <= product.stock?.lowStockThreshold ? (
                                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/10">
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                                                    In Stock
                                                </span>
                                            )}
                                            <span className="text-[11px] font-medium text-slate-400 pl-1">
                                                {product.stock?.quantity} {product.stock?.unit || 'kg'} বাকি
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-5 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/manageProducts/${product._id}?category=${category}`}
                                                className="p-2 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-150 shadow-sm"
                                                title="Edit Product"
                                            >
                                                <HiPencilAlt className="text-orange-500" />
                                            </Link>
                                            <button
                                                onClick={() => handleProductDelete(product._id)}
                                                className="p-2 rounded-lg border border-red-100 text-red-500 bg-red-50/50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-150 shadow-sm"
                                                title="Delete Product"
                                            >
                                                <HiTrash className="text-base" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-sm text-slate-400 font-medium">
                                    কোনো পণ্য পাওয়া যায়নি।
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminProductsTable