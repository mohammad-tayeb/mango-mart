"use client"
import useCartStore from "@/app/store/cartStore";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaBagShopping, FaWhatsapp, FaPhone } from "react-icons/fa6";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";

function ProductDetails({ product, relatedProducts }) {
    const router = useRouter();
    const addToCart = useCartStore((state) => state.addToCart);

    console.log(product)

    // Layout State Management Hooks
    const images = product?.images || [];

    const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder.png");
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
    const [quantity, setQuantity] = useState(1);

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = (instruction) => {
        addToCart(product, quantity, selectedVariant);

        toast.success(
            `Added ${product.name} (${selectedVariant.quantity}) to cart`
        );

        if (instruction === "proceed") {
            router.push("/checkout");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                {/* Left Side: Product Image Display Portfolio */}
                <div className="flex flex-col space-y-4 md:sticky md:top-24">
                    <div className="relative aspect-square w-full rounded-2xl border bg-white p-6 shadow-sm">
                        <Image
                            src={selectedImage}
                            fill
                            alt={product.name}
                            className="object-contain p-4"
                        />
                    </div>

                    {/* Gallery Thumbnails List */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedImage(img)}
                                className={`w-20 h-20 relative bg-white border rounded-lg overflow-hidden flex items-center justify-center p-1 transition-all ${selectedImage === img
                                    ? "border-[#FE7704] ring-1 ring-[#FE7704]"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name} view ${index + 1}`}
                                    width={75}
                                    height={75}
                                    className="object-contain w-full h-full"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: Product Customization Dashboard */}
                <div className="flex flex-col space-y-6">

                    {/* name */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        {product.name}
                    </h1>

                    {/* Pricing Row */}
                    <div className="flex items-center gap-3">
                        {selectedVariant?.offerPrice && (
                            <span className="text-lg text-gray-400 line-through">
                                ৳ {selectedVariant.price.toLocaleString()}
                            </span>
                        )}

                        <span className="text-3xl font-bold text-[#FE7704]">
                            ৳{" "}
                            {(selectedVariant?.offerPrice || selectedVariant?.price).toLocaleString()}
                        </span>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Weight Variant Option Chips */}
                    <div>
                        <span className="block text-sm font-semibold text-gray-800 mb-3">
                            বাছাই করুন:
                        </span>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((variant) => {
                                const isActive =
                                    selectedVariant?.quantity === variant.quantity;

                                return (
                                    <button
                                        key={variant.quantity}
                                        type="button"
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-5 py-2.5 rounded-md text-sm font-semibold border transition-all ${isActive
                                            ? "border-[#FE7704] ring-1 ring-[#FE7704]"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        {variant.quantity}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Counter Quantity Controls */}
                    <div className="flex items-center">
                        <div className="flex items-center border border-gray-200 rounded-md bg-white shadow-sm">
                            <button
                                type="button"
                                onClick={decrementQuantity}
                                className="px-4 py-2 text-gray-400 hover:text-gray-600 transition-colors text-lg font-medium focus:outline-none"
                            >
                                -
                            </button>
                            <span className="w-12 text-center text-sm font-semibold text-gray-800 select-none">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={incrementQuantity}
                                className="px-4 py-2 text-gray-400 hover:text-gray-600 transition-colors text-lg font-medium focus:outline-none"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Core Layout Action Grid buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Add to Cart button */}
                        <button
                            onClick={handleAddToCart}
                            type="button"
                            className="w-full border-2 border-gray-900 text-gray-900 font-bold py-3.5 px-6 rounded-md text-base transition-colors hover:bg-gray-900 hover:text-white"
                        >
                            কাটে যোগ করুন
                        </button>

                        {/* Direct Order Now Button */}
                        <button
                            onClick={() => handleAddToCart("proceed")}
                            type="button"
                            className="w-full bg-[#FE7704] text-white font-bold py-3.5 px-6 rounded-md text-base transition-colors hover:bg-[#e06600] flex items-center justify-center gap-2 shadow-md"
                        >
                            <FaBagShopping className="text-lg" />
                            অর্ডার করুন
                        </button>

                        {/* WhatsApp Order Button */}
                        <a
                            href="https://wa.me/8801339900138" // Update phone values dynamically later
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] text-white font-bold py-3.5 px-6 rounded-md text-base transition-colors hover:bg-[#20ba5a] flex items-center justify-center gap-2 shadow-md"
                        >
                            <FaWhatsapp className="text-xl" />
                            হোয়াটসঅ্যাপে অর্ডার করুন
                        </a>

                        {/* Direct Phone Call Button */}
                        <a
                            href="tel:09678812525"
                            className="w-full border-2 border-gray-900 text-gray-900 font-bold py-3.5 px-6 rounded-md text-base transition-colors hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            <FaPhone className="text-sm rotate-95" />
                            কল অর্ডার: 09678812525
                        </a>
                    </div>

                    <hr className="border-gray-100 !mt-8" />

                    {/* Product Footer Category Data metadata */}
                    <div className="text-sm text-gray-500 font-medium">
                        ক্যাটাগরি: <span className="text-gray-800 font-semibold">{product.category}</span>
                    </div>

                </div>
            </div>
            <div className="mt-20">
                <h2 className="text-2xl font-bold mb-6">
                    Related Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                    {relatedProducts.map((product) => (
                        <ProductCard key={product._id} product={product}></ProductCard>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default ProductDetails