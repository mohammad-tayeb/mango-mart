"use client";

import { useQuery } from "@tanstack/react-query";
import { FiTruck } from "react-icons/fi";


export default function ManageDeliveryPrices() {
    const {
        data: deliveryPrices = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["deliveryPrices"],
        queryFn: async () => {
            const res = await fetch("/api/admin/delivery-prices");

            if (!res.ok) {
                throw new Error("Failed to fetch delivery prices");
            }

            return res.json();
        },
    });


    const handleEdit = async (item) => {
        const price = window.prompt(
            `Enter delivery price for ${item.category}:`,
            item.price
        );

        if (price === null) return;

        if (price.trim() === "" || Number(price) < 0 || isNaN(Number(price))) {
            alert("Please enter a valid price.");
            return;
        }

        try {
            const res = await fetch("/api/admin/delivery-prices", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: item._id,
                    price: Number(price),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update price");
            }

            alert("✅ Delivery price updated successfully!");
            refetch();
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong.");
        }
    };

    if (isLoading) {
        return (
            <div className="w-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 font-medium">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                Loading Categories...
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-10 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-center">
                {error.message || "কোনো একটি সমস্যা হয়েছে!"}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/75 border-b border-gray-100">
                                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                    Category
                                </th>
                                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                    Delivery Price
                                </th>
                                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                            {deliveryPrices.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                                        {item.category}
                                    </td>

                                    <td className="px-5 py-3.5">
                                        {Number(item.price) === 0 ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                                Free Delivery
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-gray-900">
                                                ৳ {item.price}
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-4 bg-orange-50/60 border border-orange-200/60 rounded-xl p-4">
                <div className="flex gap-3 items-start">
                    <FiTruck className="text-orange-500 text-base mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-orange-900">
                            Delivery Rule
                        </p>
                        <p className="text-xs text-orange-800/80 mt-1 leading-relaxed">For free delivery, set the delivery price to ৳0.</p>
                        <p className="text-xs text-orange-800/80 mt-1 leading-relaxed">
                            When an order contains products from only one category, that
                            category`&apos;`s delivery price is used. When an order contains
                            products from multiple categories, the delivery charge is ৳100.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}