"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { FiPlus, FiTrash2, FiLayers, FiImage, FiAlertCircle } from "react-icons/fi";

const quantityOptions = ["500g", "1kg", "2kg", "5kg", "10kg"];

export default function AddProduct() {
    // Initialize React Hook Form
    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
            price: "",
            offerPrice: "",
            quantity: [],
            images: [{ url: "" }], // useFieldArray prefers objects over raw strings
        },
    });

    // Dynamic field arrays handling for image rows
    const { fields, append, remove } = useFieldArray({
        control,
        name: "images",
    });

    // Watch selected quantities for active styles on our custom button chips
    const watchedQuantities = watch("quantity") || [];

    const handleQuantityChipClick = (qty) => {
        if (watchedQuantities.includes(qty)) {
            setValue(
                "quantity",
                watchedQuantities.filter((q) => q !== qty),
                { shouldValidate: true }
            );
        } else {
            setValue("quantity", [...watchedQuantities, qty], { shouldValidate: true });
        }
    };

    const onSubmit = async (data) => {
        const product = {
            name: data.name,
            price: Number(data.price),
            offerPrice: data.offerPrice ? Number(data.offerPrice) : null,
            quantity: data.quantity,
            images: data.images
                .map((img) => img.url)
                .filter((url) => url.trim() !== ""),
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
                console.log(result);
                reset()
            } else {
                alert(result.message || "Failed to add product");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-xl shadow-xl p-6 md:p-8 my-8">
            {/* Form Header */}
            <div className="mb-8 border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
                <p className="text-sm text-gray-500 mt-1">Fill in the options below to add a premium inventory item.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Egyptian Medjool Premium Dates"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-colors text-sm ${errors.name ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#FE7704]"
                            }`}
                        {...register("name", { required: "Product name is required" })}
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <FiAlertCircle /> {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Pricing Layout Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Regular Price (৳) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-sans font-medium text-base">
                                ৳
                            </span>
                            <input
                                type="number"
                                placeholder="2200"
                                className={`w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-colors text-sm ${errors.price ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#FE7704]"
                                    }`}
                                {...register("price", {
                                    required: "Price is required",
                                    min: { value: 1, message: "Price must be greater than 0" }
                                })}
                            />
                        </div>
                        {errors.price && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <FiAlertCircle /> {errors.price.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Offer Price (৳) <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-sans font-medium text-base">
                                ৳
                            </span>
                            <input
                                type="number"
                                placeholder="1950"
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FE7704] focus:bg-white transition-colors text-sm"
                                {...register("offerPrice")}
                            />
                        </div>
                    </div>
                </div>

                {/* Dynamic Multi-Select Quantity Chips */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <FiLayers className="text-gray-400" /> Available Pack Weights
                    </label>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                        {quantityOptions.map((qty) => {
                            const isSelected = watchedQuantities.includes(qty);
                            return (
                                <button
                                    key={qty}
                                    type="button"
                                    onClick={() => handleQuantityChipClick(qty)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all ${isSelected
                                            ? "bg-orange-50 border-[#FE7704] text-[#FE7704]"
                                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    {qty}
                                </button>
                            );
                        })}
                    </div>
                    {/* Hidden input field helper registered to React Hook Form array state */}
                    <input type="hidden" {...register("quantity")} />
                </div>

                {/* Dynamic Image Link Rows */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <FiImage className="text-gray-400" /> CDN Image Links
                    </label>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2 group">
                                <input
                                    type="url"
                                    placeholder="https://i.ibb.co/your-image-hash/filename.jpg"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FE7704] focus:bg-white transition-colors text-sm"
                                    {...register(`images.${index}.url`)}
                                />
                                <button
                                    type="button"
                                    onClick={() => (fields.length > 1 ? remove(index) : setValue(`images.${index}.url`, ""))}
                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors shrink-0"
                                    title="Remove Link Slot"
                                >
                                    <FiTrash2 className="text-lg" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => append({ url: "" })}
                        className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#FE7704] bg-orange-50/50 hover:bg-orange-50 px-3 py-2 rounded-lg border border-dashed border-orange-200 transition-colors"
                    >
                        <FiPlus /> Add Another Image Row
                    </button>
                </div>

                {/* Submit Operations Block */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#FE7704] text-white font-semibold py-3.5 px-4 rounded-lg shadow-md hover:bg-[#e06600] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Publishing Listing..." : "Publish Product Listing"}
                    </button>
                </div>
            </form>
        </div>
    );
}