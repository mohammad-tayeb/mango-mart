"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";

export default function BannerFormItem({ banner }) {
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { isSubmitting, isDirty },
    } = useForm({
        defaultValues: {
            image: banner.image || "",
            order: banner.order !== undefined ? banner.order : 0,
            isActive: banner.isActive ?? true,
        },
    });

    const currentImageUrl = watch("image");

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`/api/banners/${banner._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to update banner");

            toast.success("Banner updated successfully!");
            router.refresh();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
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
                setValue("image", data.data.url, { shouldDirty: true });
                toast.success("New image staged! Click Update to save.");
            } else {
                toast.error("Image host failure");
            }
        } catch (err) {
            console.error(err);
            toast.error("Image upload request crashed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
        >
            {/* 1. Preview Layout Block */}
            <div className="md:col-span-3 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Live Preview
                </span>
                {currentImageUrl ? (
                    <div className="relative aspect-[21/9] md:h-20 w-full bg-slate-100 border rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                            src={currentImageUrl}
                            alt="Banner Asset"
                            className="object-cover w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="aspect-[21/9] md:h-20 w-full bg-slate-50 border border-dashed rounded-lg flex items-center justify-center text-xs text-slate-400">
                        No Image Linked
                    </div>
                )}
            </div>

            {/* 2. Database Properties (Order & Active Status) */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4 items-center">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Display Order
                    </label>
                    <input
                        type="number"
                        readOnly
                        {...register("order", { valueAsNumber: true })}
                        className="input input-bordered w-full text-sm h-10 focus:outline-orange-500"
                    />
                </div>

                <div className="flex flex-col pt-4 pl-2">
                    <label className="label cursor-pointer justify-start gap-3 p-0">
                        <input
                            type="checkbox"
                            {...register("isActive")}
                            className="checkbox checkbox-primary checkbox-sm border-slate-300 checked:bg-orange-500 checked:border-orange-500 focus:outline-orange-500"
                        />
                        <span className="label-text text-sm font-semibold text-slate-600">
                            Active in UI
                        </span>
                    </label>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                        Controls client-side rendering visibility.
                    </span>
                </div>
            </div>

            {/* 3. Image Input Control and Submission */}
            <div className="md:col-span-4 flex flex-col gap-2 self-end">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Replace Banner Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered file-input-sm w-full focus:outline-orange-500 text-xs"
                    />
                    <input type="hidden" {...register("image")} />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || isUploading || !isDirty}
                    className="btn h-11 rounded-lg bg-orange-500 hover:bg-orange-600 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Uploading...
                        </>
                    ) : isSubmitting ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving...
                        </>
                    ) : (
                        <>
                            <FiCheckCircle className="text-lg" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}