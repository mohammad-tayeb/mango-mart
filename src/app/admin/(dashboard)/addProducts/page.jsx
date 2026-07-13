"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiPlus, FiTrash2, FiLayers, FiImage, FiSettings, FiInfo, FiFileText, FiUploadCloud, FiCheckCircle } from "react-icons/fi";

export default function AddProduct() {
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: "",
            unitPricePerKg: "",
            category: "",
            variants: [{ quantity: "", price: "", offerPrice: "" }],
            images: [{ url: "" }],
            description: "", // অবজেক্ট থেকে একক স্ট্রিং-এ পরিবর্তন
            stock: {
                quantity: "",
                unit: "kg",
                status: "in_stock",
                lowStockThreshold: ""
            }
        },
    });

    // ডাইনামিক ইমেজ ইনপুট কন্ট্রোল
    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage
    } = useFieldArray({
        control,
        name: "images",
    });

    // ডাইনামিক ভেরিয়েন্ট (প্যাকেজ) ইনপুট কন্ট্রোল
    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant
    } = useFieldArray({
        control,
        name: "variants",
    });

    const onSubmit = async (data) => {
        const confirmed = window.confirm(
            "Are you sure you want to Add this product?"
        );
        if (!confirmed) return;
        // ব্যাকএন্ডে পাঠানোর জন্য ডাটা ফরম্যাটিং করা হচ্ছে
        const product = {
            name: data.name,
            unitPricePerKg: Number(data.unitPricePerKg),
            category: data.category,
            variants: data.variants.map(v => ({
                quantity: isNaN(Number(v.quantity)) ? v.quantity : Number(v.quantity),
                price: Number(v.price),
                offerPrice: v.offerPrice ? Number(v.offerPrice) : null
            })),
            images: data.images
                .map((img) => img.url)
                .filter((url) => url.trim() !== ""),
            description: data.description, // সরাসরি স্ট্রিং ডাটা পাঠানো হচ্ছে
            stock: {
                quantity: Number(data.stock.quantity),
                unit: data.stock.unit,
                status: data.stock.status,
                lowStockThreshold: Number(data.stock.lowStockThreshold)
            }
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            const result = await res.json();

            if (res.ok) {
                alert("✅ Product added successfully!");
                reset();
            } else {
                alert(result.message || "Failed to add product");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    };

    const handleImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingIndex(index);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (data.success) {
                setValue(`images.${index}.url`, data.data.url);
            } else {
                alert("Upload Failed");
            }
        } catch (err) {
            console.log(err);
        } finally {
            setUploadingIndex(null);
        }
    };
    return (
        // <div></div>
        <div className="max-w-6xl mx-auto border border-gray-100 rounded-xl shadow-xl p-6 md:p-8 font-sans">
            {/* ফর্ম হেডার */}
            <div className="pb-2 -mt-4">
                <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* ১. প্রাথমিক তথ্য (Basic Info) */}
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <FiInfo className="text-orange-500" /> Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., আম্রপালি আম | Amrapali Mango"
                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none ${errors.name ? "border-red-500" : "border-gray-200 focus:border-orange-500"}`}
                                {...register("name", { required: "Product name is required" })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
                            <input
                                type="text"
                                placeholder="e.g., mango"
                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none ${errors.category ? "border-red-500" : "border-gray-200 focus:border-orange-500"}`}
                                {...register("category", { required: "Category is required" })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Unit Price Per Kg *</label>
                            <input
                                type="number"
                                placeholder="৳ 550"
                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none ${errors.unitPricePerKg ? "border-red-500" : "border-gray-200 focus:border-orange-500"}`}
                                {...register("unitPricePerKg", { required: "Unit price is required" })}
                            />
                        </div>
                    </div>
                </div>

                {/* ২. ডাইনামিক ভেরিয়েন্ট (Variants Array) */}
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                            <FiLayers className="text-orange-500" /> Custom Pack Variants
                        </h2>
                        <button
                            type="button"
                            onClick={() => appendVariant({ quantity: "", price: "", offerPrice: "" })}
                            className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline"
                        >
                            <FiPlus /> Add Variant
                        </button>
                    </div>

                    <div className="space-y-3">
                        {variantFields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3 border border-gray-200 rounded-lg items-end shadow-sm">
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Quantity (e.g., 5)</label>
                                    <input
                                        type="text"
                                        placeholder="5"
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-orange-500"
                                        {...register(`variants.${index}.quantity`, { required: true })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Regular Price *</label>
                                    <input
                                        type="number"
                                        placeholder="1200"
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-orange-500"
                                        {...register(`variants.${index}.price`, { required: true })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Offer Price</label>
                                    <input
                                        type="number"
                                        placeholder="1050"
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-orange-500"
                                        {...register(`variants.${index}.offerPrice`)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => (variantFields.length > 1 ? removeVariant(index) : null)}
                                    className="w-full py-2 bg-red-50 text-red-500 border border-red-100 rounded-md text-xs font-semibold hover:bg-red-100 transition-colors"
                                >
                                    Delete Variant
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ৩. ডাইনামিক ইমেজ লিংক (Images Array) */}
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                            <FiImage className="text-orange-500" /> Product Images (URLs)
                        </h2>
                        <button
                            type="button"
                            onClick={() => appendImage({ url: "" })}
                            className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline"
                        >
                            <FiPlus /> Add Image
                        </button>
                    </div>

                    <div className="space-y-3">
                        {imageFields.map((field, index) => (
                            <div
                                key={field.id}
                                className="border border-gray-200 rounded-lg p-4 bg-white space-y-3"
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, index)}
                                        className="file-input file-input-bordered w-full"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            imageFields.length > 1 ? removeImage(index) : null
                                        }
                                        className="p-2.5 text-red-500 border rounded-lg hover:bg-red-50"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>

                                <input
                                    type="hidden"
                                    {...register(`images.${index}.url`)}
                                />

                                {uploadingIndex === index && (
                                    <div className="flex items-center gap-2 text-orange-500">
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Uploading image...
                                    </div>
                                )}

                                {watch(`images.${index}.url`) &&
                                    uploadingIndex !== index && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <FiCheckCircle />
                                            <span>Uploaded Successfully</span>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ৪. নতুন একক বিবরণ ফিল্ড (Single Description Field) */}
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <FiFileText className="text-orange-500" /> Product Description
                    </h2>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Details Description *</label>
                        <textarea
                            rows={6}
                            placeholder="জাত: আম্রপালি। উৎস: নওগাঁ... (পণ্যের বিস্তারিত বিবরণ এখানে লিখুন)"
                            className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none resize-y ${errors.description ? "border-red-500" : "border-gray-200 focus:border-orange-500"}`}
                            {...register("description", { required: "Product description is required" })}
                        ></textarea>
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                        )}
                    </div>
                </div>

                {/* ৫. স্টক ইনফরমেশন (Nested Stock Object) */}
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <FiSettings className="text-orange-500" /> Stock & Operations
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock Qty *</label>
                            <input
                                type="number"
                                placeholder="100"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                {...register("stock.quantity", { required: true })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Unit *</label>
                            <input
                                type="text"
                                placeholder="kg"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                {...register("stock.unit", { required: true })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status *</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 bg-white"
                                {...register("stock.status", { required: true })}
                            >
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Low Alert Limit *</label>
                            <input
                                type="number"
                                placeholder="5"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                {...register("stock.lowStockThreshold", { required: true })}
                            />
                        </div>
                    </div>
                </div>

                {/* সাবমিট বাটন */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadingIndex !== null}
                        className="w-full bg-orange-500 text-white font-semibold py-3.5 px-4 rounded-lg shadow-md hover:bg-[#e06600] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploadingIndex !== null
                            ? "Uploading Image..."
                            : isSubmitting
                                ? "Publishing Listing..."
                                : "Publish Product Listing"}
                    </button>
                </div>
            </form>
        </div>
    );
}