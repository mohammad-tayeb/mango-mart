"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import Timeline from "@/components/Timeline";

export default function TrackParcel() {
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState(null);
    const [expandedTrackingId, setExpandedTrackingId] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setTrackingData(null);

        try {
            const res = await fetch("/api/orders/track", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }
            setTrackingData(result);
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md min-h-screen mx-auto my-12 px-4 space-y-6">
            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Track Your Order
                </h2>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                    Enter your Tracking ID or Phone Number to view progress.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            {...register("query", {
                                required: "Tracking ID or Phone Number is required",
                            })}
                            placeholder="Tracking ID or Phone Number"
                            className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
                                errors.query
                                    ? "border-red-500 focus:ring-red-100"
                                    : "border-gray-200 focus:border-orange-500 focus:ring-orange-500/10"
                            }`}
                        />
                        {errors.query && (
                            <p className="text-red-500 text-xs font-medium mt-1.5 px-1">
                                {errors.query.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 text-white font-medium text-sm py-3 rounded-xl transition-colors shadow-sm shadow-orange-500/10"
                    >
                        {loading ? "Tracking..." : "Track Order"}
                    </button>
                </form>
            </div>

            {/* Tracking Results Area */}
            {trackingData && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* SINGLE RESULT LAYOUT */}
                    {trackingData?.type === "single" && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
                            {/* Summary Box */}
                            <div className="bg-gray-50/60 border border-gray-100 rounded-xl p-4 space-y-2.5 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Tracking ID</span>
                                    <span className="font-mono font-medium text-gray-900">{trackingData.order.trackingId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Customer</span>
                                    <span className="font-medium text-gray-900">{trackingData.order.customer.fullName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Paid</span>
                                    <span className="font-medium text-gray-900">৳{trackingData.order.payment.amountPaid}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Due</span>
                                    <span className="font-medium text-gray-900">৳{trackingData.order.payment.amountDue}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Current Status</span>
                                    <span className="inline-flex items-center rounded-md bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 border border-orange-100">
                                        {trackingData.order.orderStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Timeline container */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 px-1">Order Timeline</h3>
                                <Timeline history={trackingData.order.orderHistory} />
                            </div>
                        </div>
                    )}

                    {/* MULTIPLE RESULTS LAYOUT */}
                    {trackingData?.type === "multiple" && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
                                Multiple Orders Found ({trackingData.orders.length})
                            </h3>
                            
                            {trackingData.orders.map((order,index) => {
                                const isExpanded = expandedTrackingId === order.trackingId;
                                return (
                                    <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                        <div className="p-4 flex items-center justify-between gap-4 text-sm">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-medium text-gray-900 truncate">{order.trackingId}</span>
                                                    <span className="inline-flex items-center rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5 truncate">{order.customer.fullName}</p>
                                            </div>

                                            <button
                                                onClick={() => setExpandedTrackingId(isExpanded ? null : order.trackingId)}
                                                className="shrink-0 text-xs font-semibold text-orange-500 hover:text-orange-600 border border-gray-100 hover:border-orange-100 rounded-lg px-3 py-1.5 bg-gray-50/50 hover:bg-orange-50/20 transition-all"
                                            >
                                                {isExpanded ? "Hide Details" : "View Details"}
                                            </button>
                                        </div>

                                        {isExpanded && (
                                            <div className="border-t border-gray-50 bg-gray-50/30 px-5 py-5 space-y-4">
                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-white p-3 rounded-xl border border-gray-100">
                                                    <div>Paid: <span className="font-medium text-gray-800">৳{order.payment.amountPaid}</span></div>
                                                    <div>Due: <span className="font-medium text-gray-800">৳{order.payment.amountDue}</span></div>
                                                </div>
                                                <Timeline history={order.orderHistory} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}