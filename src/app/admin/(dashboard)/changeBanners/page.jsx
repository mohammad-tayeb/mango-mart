"use client";

import BannerFormItem from "@/components/BannerFormItem";
import { getAdminBanners } from "@/lib/getAdminBanners";
import { useQuery } from "@tanstack/react-query";


export default function EditBannerForm() {
    const { data: banners = [], isLoading, error } = useQuery({
        queryKey: ["banners"],
        queryFn: getAdminBanners,
    });

    const sortedBanners = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 gap-2 text-slate-500">
                <span className="loading loading-spinner loading-md text-orange-500"></span>
                <p className="text-sm">Fetching structural banners list...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error text-sm max-w-4xl mx-auto my-6 text-white">
                Error tracking records down: {error.message}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-6 space-y-6">
            <div className="space-y-4">
                {sortedBanners.map((bannerItem) => (
                    <BannerFormItem
                        key={bannerItem._id} 
                        banner={bannerItem} 
                    />
                ))}

                {sortedBanners.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-sm text-slate-400">
                        No image banners registered in document query maps yet.
                    </div>
                )}
            </div>
        </div>
    );
}