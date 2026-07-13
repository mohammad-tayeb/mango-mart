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

    const message = `
I want to order:

Product: ${product.name}
Variant: ${selectedVariant.quantity}
Quantity: ${quantity}
Price: ৳${selectedVariant.offerPrice || selectedVariant.price}

Product Link:
${window.location.href}
`;
    const whatsappUrl = `https://wa.me/8801822350799?text=${encodeURIComponent(
        message
    )}`;

    // ১. MongoDB থেকে আসা flat string-টি (product.description)
    const rawDescription = product?.description || "";
    // অথবা ডাইরেক্ট স্ট্রিং হলে: const rawDescription = "জাত: গোপালভোগ। উৎস: পুঠিয়া...";

    // ২. স্ট্রিংটিকে ভেঙে `details` ২D অ্যারেতে রূপান্তর করার লজিক
    const details = rawDescription
        .split("।") // দাড়ি (।) দিয়ে প্রতিটি বাক্য আলাদা করা হচ্ছে
        .map(item => item.trim())
        .filter(item => item.includes(":")) // শুধু মাত্র কি-ভ্যালু জোড়াগুলো নেওয়া হচ্ছে
        .map(item => {
            const parts = item.split(":");
            const title = parts[0].trim();
            // যদি ভ্যালুর ভেতরেও ক্লোন থাকে, সেটির জন্য join করা হচ্ছে
            const value = parts.slice(1).join(":").trim();
            return [title, value];
        });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-8 py-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                {/* Left Side: Product Image Display Portfolio */}
                <div className="flex flex-col space-y-4 md:sticky md:top-24">
                    <div className="relative aspect-square w-full rounded-2xl border bg-white p-6 shadow-sm">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-contain p-4"
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
                                    ? "border-orange-500 ring-1 ring-orange-500"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} view ${index + 1}`}
                                    loading="lazy"
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

                        <span className="text-3xl font-bold text-orange-500">
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
                                            ? "border-orange-500 ring-1 ring-orange-500"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        {variant.quantity}kg
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Counter Quantity Controls */}
                    {/* Quantity Label */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            আপনি কতটি{" "}
                            <span className="font-semibold text-orange-500">
                                {selectedVariant?.quantity}
                            </span>{" "}
                            বক্স নিতে চান?
                        </p>

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
                    </div>

                    {/* Core Layout Action Grid buttons */}
                    {product.stock.status === "out_of_stock" ? (
                        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-5 text-center">
                            <h3 className="text-lg font-bold text-red-600">
                                Out of Stock
                            </h3>
                            <p className="mt-1 text-sm text-red-500">
                                এই পণ্যটি বর্তমানে স্টকে নেই।
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                type="button"
                                className="w-full border-2 border-gray-900 text-gray-900 font-bold py-3.5 px-6 rounded-md hover:bg-gray-900 hover:text-white transition"
                            >
                                কার্টে যোগ করুন
                            </button>

                            {/* Order Now */}
                            <button
                                onClick={() => handleAddToCart("proceed")}
                                type="button"
                                className="w-full bg-orange-500 text-white font-bold py-3.5 px-6 rounded-md hover:bg-orange-600 flex items-center justify-center gap-2"
                            >
                                <FaBagShopping />
                                অর্ডার করুন
                            </button>

                            {/* WhatsApp */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] text-white font-bold py-3.5 px-6 rounded-md hover:bg-[#20ba5a] flex items-center justify-center gap-2"
                            >
                                <FaWhatsapp />
                                হোয়াটসঅ্যাপে অর্ডার করুন
                            </a>

                            {/* Call */}
                            <a
                                href="tel:+8801822350799"
                                className="w-full border-2 border-gray-900 text-gray-900 font-bold py-3.5 px-6 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <FaPhone className="rotate-90" />
                                কল অর্ডার
                            </a>
                        </div>
                    )}

                    <hr className="border-gray-100 mt-8!" />

                    {/* Product Footer Category Data metadata */}
                    <div className="text-sm text-gray-500 font-medium">
                        ক্যাটাগরি: <span className="text-gray-800 font-semibold">{product.category}</span>
                    </div>

                </div>
            </div>
            {/* Product Description */}
            <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b-2 border-amber-500 bg-gray-50/70 px-5 py-2.5 sm:py-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        পণ্যের বিবরণ
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                        এই পণ্যের বিস্তারিত তথ্য
                    </p>
                </div>

                {/* Body */}
                <div className="divide-y divide-gray-100 px-2">
                    {details.map(([title, value]) => (
                        <div
                            key={title}
                            className="grid gap-1 p-2.5 transition-colors hover:bg-amber-50/40 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-3 sm:p-4"
                        >
                            <div className="text-xs font-medium text-gray-500">
                                {title}
                            </div>
                            <div className="text-sm text-gray-800 leading-6">
                                {value}
                            </div>
                        </div>
                    ))}

                    {/* যদি কোন কারণে ডেটা খালি থাকে */}
                    {details.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6">কোন বিবরণ পাওয়া যায়নি।</p>
                    )}
                </div>
            </section>

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