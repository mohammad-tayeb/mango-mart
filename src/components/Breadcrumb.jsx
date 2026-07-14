import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";

const categoryNames = {
    mango: "Mango",
    ghee: "Ghee",
    honey: "Honey",
    dates: "Dates",
    oil: "Oil",
};

export default function Breadcrumb({ category }) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="flex items-center text-sm text-gray-500 px-6 pt-4"
        >
            <Link
                href="/"
                className="hover:text-orange-500 transition-colors"
            >
                Home
            </Link>

            <HiChevronRight className="mx-2 text-gray-400" />

            <Link
                href="/products"
                className={`transition-colors ${
                    !category
                        ? "font-semibold text-orange-500"
                        : "hover:text-orange-500"
                }`}
            >
                Products
            </Link>

            {category && (
                <>
                    <HiChevronRight className="mx-2 text-gray-400" />

                    <span className="font-semibold text-orange-500">
                        {categoryNames[category] || category}
                    </span>
                </>
            )}
        </nav>
    );
}