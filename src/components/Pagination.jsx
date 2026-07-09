"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({ currentPage, totalPages }) {
    const params = useSearchParams();

    //creating page link
    const createPageLink = (page) => {
        const search = new URLSearchParams(params);
        search.set("page", page);
        return `?${search.toString()}`;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {/* Previous Button */}
            {currentPage > 1 ? (
                <Link
                    href={createPageLink(currentPage - 1)}
                    className="px-4 h-10 flex items-center justify-center border rounded-md hover:bg-gray-100 transition"
                >
                    Previous
                </Link>
            ) : (
                <span className="px-4 h-10 flex items-center justify-center border rounded-md text-gray-400 cursor-not-allowed">
                    Previous
                </span>
            )}

            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;

                return (
                    <Link
                        key={page}
                        href={createPageLink(page)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center border transition ${
                            currentPage === page
                                ? "bg-[#FE7704] text-white border-[#FE7704]"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        {page}
                    </Link>
                );
            })}

            {/* Next Button */}
            {currentPage < totalPages ? (
                <Link
                    href={createPageLink(currentPage + 1)}
                    className="px-4 h-10 flex items-center justify-center border rounded-md hover:bg-gray-100 transition"
                >
                    Next
                </Link>
            ) : (
                <span className="px-4 h-10 flex items-center justify-center border rounded-md text-gray-400 cursor-not-allowed">
                    Next
                </span>
            )}
        </div>
    );
}