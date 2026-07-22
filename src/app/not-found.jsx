import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
            <h1 className="text-7xl font-bold text-orange-500">404</h1>

            <h2 className="mt-4 text-3xl font-semibold text-gray-800">
                Page Not Found
            </h2>

            <p className="mt-3 max-w-md text-gray-600">
                Sorry, the page you are looking for doesn&apos;t exist or has been moved.
            </p>

            <Link
                href="/"
                className="mt-8 rounded-lg bg-orange-500 px-6 py-3 text-white font-medium hover:bg-orange-600 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
}