"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TrackParcel() {
    const [loading, setLoading] = useState(false);
    const [trackingData, setTrackingData] = useState(null);

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
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 px-4">
            <div className="bg-white rounded-2xl shadow-xl border p-6">

                <h2 className="text-2xl font-bold mb-2">
                    Track Your Order
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    Enter your Tracking ID or Phone Number.
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <input
                        {...register("query", {
                            required: "Tracking ID or Phone Number is required",
                        })}
                        placeholder="Tracking ID or Phone Number"
                        className={`w-full rounded-xl border px-4 py-3 ${
                            errors.query
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />

                    {errors.query && (
                        <p className="text-red-500 text-sm">
                            {errors.query.message}
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl"
                    >
                        {loading ? "Tracking..." : "Track Order"}
                    </button>
                </form>

                {trackingData && (
                    <div className="mt-8">

                        {/* Order Info */}

                        <div className="bg-orange-50 rounded-xl p-4 mb-6 space-y-2">

                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Tracking ID
                                </span>

                                <span>
                                    {trackingData.trackingId}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Customer
                                </span>

                                <span>
                                    {trackingData.customer.fullName}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Current Status
                                </span>

                                <span className="font-semibold text-orange-600">
                                    {trackingData.orderStatus}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Paid</span>

                                <span>
                                    ৳{trackingData.payment.amountPaid}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Due</span>

                                <span>
                                    ৳{trackingData.payment.amountDue}
                                </span>
                            </div>

                        </div>

                        {/* Timeline */}

                        <h3 className="font-bold mb-4">
                            Order Timeline
                        </h3>

                        {trackingData.orderHistory.map((item, index) => (
                            <div
                                key={index}
                                className="flex"
                            >
                                <div className="flex flex-col items-center mr-4">

                                    <div className="w-5 h-5 rounded-full bg-green-500" />

                                    {index !==
                                        trackingData.orderHistory.length - 1 && (
                                        <div className="w-1 h-12 bg-green-500" />
                                    )}

                                </div>

                                <div className="pb-8">

                                    <h4 className="font-semibold">
                                        {item.status}
                                    </h4>

                                    <p className="text-sm text-gray-500">
                                        {new Date(item.time).toLocaleString()}
                                    </p>

                                    {item.note && (
                                        <p className="text-xs text-gray-400">
                                            {item.note}
                                        </p>
                                    )}

                                    {item.updatedBy && (
                                        <p className="text-xs text-gray-400">
                                            Updated by: {item.updatedBy}
                                        </p>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}