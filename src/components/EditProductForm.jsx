"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";

export default function EditProductForm({ product, id }) {
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: product,
    });

    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
    } = useFieldArray({
        control,
        name: "images",
    });

    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({
        control,
        name: "variants",
    });

    const onSubmit = async (data) => {
        const confirmed = window.confirm(
            "Are you sure you want to Edit this product?"
        );

        if (!confirmed) return;
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            toast.success("Product updated successfully!");

            router.push("/admin/manageProducts");
            router.refresh();
        } catch (err) {
            toast.error(err.message);
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
                setValue(`images.${index}`, data.data.url, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            } else {
                alert("Image upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Image upload failed");
        } finally {
            setUploadingIndex(null);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-w-5xl mx-auto"
        >
            {/* Basic Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-semibold text-slate-900 border-l-4 border-orange-500 pl-2.5">
                    Basic Information
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
                        <input
                            {...register("name")}
                            className="input input-bordered w-full focus:input-orange-500 text-sm h-10"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                        <input
                            {...register("category")}
                            className="input input-bordered w-full focus:input-orange-500 text-sm h-10"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Unit Price Per Kg</label>
                        <input
                            type="number"
                            step="any"
                            {...register("unitPricePerKg", {
                                valueAsNumber: true,
                            })}
                            className="input input-bordered w-full focus:input-orange-500 text-sm h-10"
                        />
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-l-4 border-orange-500 pl-2.5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Product Images
                    </h2>
                    <button
                        type="button"
                        className="btn border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white btn-sm rounded-lg bg-transparent"
                        onClick={() => appendImage("")}
                    >
                        + Add Image URL
                    </button>
                </div>

                <div className="space-y-3 pt-2">
                    {imageFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="bg-slate-50/50 border border-slate-100 rounded-lg p-4 space-y-3"
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
                                    onClick={() => removeImage(index)}
                                    className="btn bg-red-500 btn-sm text-white"
                                >
                                    Remove
                                </button>
                            </div>

                            <input
                                type="hidden"
                                {...register(`images.${index}`)}
                            />

                            {uploadingIndex === index && (
                                <div className="flex items-center gap-2 text-orange-500 text-sm">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Uploading image...
                                </div>
                            )}

                            {watch(`images.${index}`) && uploadingIndex !== index && (
                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                    <FiCheckCircle className="text-lg" />
                                    <span>Image uploaded successfully.</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {imageFields.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed">
                            No images added yet.
                        </p>
                    )}
                </div>
            </div>

            {/* Variants */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-l-4 border-orange-500 pl-2.5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Variants
                    </h2>
                    <button
                        type="button"
                        className="btn border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white btn-sm rounded-lg"
                        onClick={() =>
                            appendVariant({
                                quantity: "",
                                price: "",
                                offerPrice: "",
                            })
                        }
                    >
                        + Add Variant
                    </button>
                </div>

                <div className="space-y-4 pt-2">
                    {variantFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid md:grid-cols-4 gap-4 p-4 bg-slate-50/60 border border-slate-200 rounded-lg items-end"
                        >
                            <div className="flex flex-col gap-1.5">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quantity Group</label>
                                <input
                                    step="any"
                                    type="number"
                                    {...register(`variants.${index}.quantity`, {
                                        valueAsNumber: true,
                                    })}
                                    className="input input-bordered bg-white focus:input-orange-500 text-sm h-10"
                                    placeholder="e.g. 5"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Regular Price</label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register(`variants.${index}.price`, {
                                        valueAsNumber: true,
                                    })}
                                    className="input input-bordered bg-white focus:input-orange-500 text-sm h-10"
                                    placeholder="Price"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Offer Price</label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register(`variants.${index}.offerPrice`, {
                                        valueAsNumber: true,
                                    })}
                                    className="input input-bordered bg-white focus:input-orange-500 text-sm h-10"
                                    placeholder="Offer Price"
                                />
                            </div>

                            <button
                                type="button"
                                className="btn bg-red-500 text-white h-10 min-h-0 rounded-lg w-full"
                                onClick={() => removeVariant(index)}
                            >
                                Remove Variant
                            </button>
                        </div>
                    ))}
                    {variantFields.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed">No variants configured yet.</p>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-semibold text-slate-900 border-l-4 border-orange-500 pl-2.5">
                    Description Details
                </h2>
                <div className="flex flex-col gap-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Description</label>
                    <textarea
                        {...register("description")}
                        placeholder="জাত, উৎস, স্বাদ, রং এবং অন্যান্য বিবরণ এখানে লিখুন..."
                        className="textarea textarea-bordered w-full focus:textarea-orange-500 text-sm resize-y"
                        rows={6}
                    />
                </div>
            </div>

            {/* Stock */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-semibold text-slate-900 border-l-4 border-orange-500 pl-2.5">
                    Stock Management
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</label>
                        <input
                            type="number"
                            {...register("stock.quantity", {
                                valueAsNumber: true,
                            })}
                            className="input input-bordered focus:input-orange-500 text-sm h-10"
                            placeholder="Quantity"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</label>
                        <input
                            {...register("stock.unit")}
                            className="input input-bordered focus:input-orange-500 text-sm h-10"
                            placeholder="Unit"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                        <select
                            {...register("stock.status")}
                            className="select select-bordered focus:select-orange-500 text-sm h-10 min-h-0"
                        >
                            <option value="in_stock">In Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Alert</label>
                        <input
                            type="number"
                            {...register("stock.lowStockThreshold", {
                                valueAsNumber: true,
                            })}
                            className="input input-bordered focus:input-orange-500 text-sm h-10"
                            placeholder="Threshold"
                        />
                    </div>
                </div>
            </div>

            {/* Action buttons wrapper */}
            <div className="w-full pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting || uploadingIndex !== null}
                    className="btn bg-orange-500 w-full text-white hover:bg-[#e06600] "
                >
                    {uploadingIndex !== null
                        ? "Uploading Image..."
                        : isSubmitting
                            ? "Updating Product..."
                            : "Update Product"}
                </button>
            </div>
        </form>
    );
}