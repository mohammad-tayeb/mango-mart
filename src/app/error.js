"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
            <h1 className="text-6xl font-bold text-red-500">Oops!</h1>

            <h2 className="mt-4 text-3xl font-semibold text-gray-800">
                Something went wrong
            </h2>

            <p className="mt-3 text-gray-600 max-w-md">
                An unexpected error occurred. Please try again.
            </p>

            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                    Try Again
                </button>

                <Link
                    href="/"
                    className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}