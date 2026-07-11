"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import locations from "@/data/bangladesh-locations.json";
import useCartStore from '../store/cartStore';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function Page() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        reset,

        formState: { errors },
    } = useForm({
    });
    const district = watch("district");
    const [selectedMethod, setSelectedMethod] = useState(null); // intl_send, bd_payment, bank
    const [paymentType, setPaymentType] = useState('advance'); // advance, full
    const [trxId, setTrxId] = useState('');

    // cart related
    const cartItems = useCartStore((state) => state.cart);

    const increaseQuantity = useCartStore(
        (state) => state.increaseQuantity
    );

    const decreaseQuantity = useCartStore(
        (state) => state.decreaseQuantity
    );

    const removeFromCart = useCartStore(
        (state) => state.removeFromCart
    );

    const clearCart = useCartStore((state) => state.clearCart);


    // price calculation
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const charge =
        selectedMethod === "intl_send"
            ? Math.round(subtotal * 0.018)
            : 0;

    const total = subtotal + charge;




    //let user copy the number and amount 
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied: ${text}`);
    };

    // Amount setup based on selected states
    const activeAmount =
        cartItems.length === 0
            ? 0
            : paymentType === "advance"
                ? 500
                : total;

    const dueAmount = Math.max(0, total - activeAmount);

    //submission ralated
    const onSubmit = async (data) => {
        if (loading) return;

        // Empty cart
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        // Payment method
        if (selectedMethod === "null") {
            toast.error("Please select a payment method");
            return;
        }

        // Transaction ID
        if (!trxId.trim()) {
            toast.error("Please enter your Transaction ID");
            return;
        }

        setLoading(true);
        const orderData = {
            customer: data,

            cartItems,

            payment: {
                method: selectedMethod,
                type: paymentType,
                trxId,
                actualAmount: total,
                amountPaid: activeAmount,
                amountDue: dueAmount,
                charge,
            },
        };

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            toast.success(result.message);


            clearCart();
            reset();
            setSelectedMethod("null");
            setPaymentType("advance");
            setTrxId("");
            router.push(`/order/success/${result.trackingId}`);

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }

    };

    const isDisabled =
        loading ||
        cartItems.length === 0 ||
        selectedMethod === null ||
        !trxId.trim();
    return (
        <div className="relative bg-gray-50 mb-10 pt-1 md:p-8 flex md:flex-row flex-col items-center w-full font-sans gap-10">
            {/* Left Side: Delivery Information Form */}
            <div className='md:w-2/3 w-full'>
                {/* form */}
                <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                    {/* Section Title */}
                    <div className="flex items-center gap-3">
                        <span className="w-14 h-6 rounded bg-red-500 text-white flex items-center justify-center text-sm font-bold">
                            Step: 1
                        </span>
                        <h2 className="text-lg font-bold text-gray-800">Delivery Information</h2>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                            type="text"
                            placeholder='Your Full Name'
                            {...register('fullName', { required: 'Full name is required' })}
                            className="w-full px-3 py-2 bg-blue-50/40 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>

                    {/* Phone & Email Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                placeholder='Your Phone Number'
                                {...register('phoneNumber', { required: 'Phone number is required' })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                            <input
                                type="email"
                                placeholder='Your Email'
                                {...register('email')}
                                className="w-full px-3 py-2 bg-blue-50/40 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                            />
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                        <textarea
                            rows={3}
                            placeholder='Detailed Delivery Address'
                            {...register('deliveryAddress', { required: 'Address is required' })}
                            className="w-full px-3 py-2 bg-blue-50/40 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 resize-none"
                        />
                        {errors.deliveryAddress && <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress.message}</p>}
                    </div>

                    {/* District & Thana/Upazila Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District * *</label>
                            <select
                                {...register("district", {
                                    required: "জেলা নির্বাচন করুন",
                                })}
                                className="select select-bordered w-full"
                            >
                                <option value="">জেলা নির্বাচন করুন</option>

                                {Object.keys(locations).map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thana / Upazila * *</label>
                            <select
                                {...register("thana", {
                                    required: "থানা নির্বাচন করুন",
                                })}
                                className="select select-bordered w-full"
                                disabled={!district}
                            >
                                <option value="">থানা নির্বাচন করুন</option>

                                {district &&
                                    locations[district].map((thana) => (
                                        <option key={thana} value={thana}>
                                            {thana}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1 font-semibold">বিশেষ অনুরোধ উল্লেখ করুন</label>
                        <input
                            type="text"
                            placeholder="Special instructions (optional)"
                            {...register('specialInstructions')}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
                        />
                    </div>
                </form>

                {/* step 2 */}
                <div className="w-full mt-4 max-w-5xl bg-white rounded-xl shadow-sm border border-gray-100 p-5 font-sans">
                    {/* Section Title */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-14 h-6 rounded bg-red-500 text-white flex items-center justify-center text-sm font-bold">
                            Step: 2
                        </span>
                        <h2 className="text-lg font-bold text-gray-800">Delivery Option</h2>
                    </div>

                    {/* Selected Delivery Box */}
                    <div className="w-full p-4 rounded-xl border border-red-500 bg-white shadow-sm transition-all">
                        <div className="space-y-1">
                            {/* Option Headline */}
                            <h3 className="text-base font-bold text-gray-800">
                                Home Delivery - ৳0
                            </h3>
                            {/* Subtext Description */}
                            <p className="text-sm text-gray-500">
                                উপজেলা পর্যায়ে ৫ কি মি এর মধ্যে হোম ডেলিভারি হবে।
                            </p>
                        </div>
                    </div>
                </div>

                {/* step 3 */}
                <div className="w-full mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 font-sans text-gray-800">

                    {/* 1. Header Section */}
                    <div className="flex items-center gap-3 mb-5">
                        <span className="w-14 h-6 rounded bg-red-500 text-white flex items-center justify-center text-sm font-bold">
                            Step: 3
                        </span>
                        <h2 className="text-base font-black text-gray-900">Payment Method</h2>
                    </div>

                    {/* 2. Top Navigation Tabs */}
                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                        {/* International Send Money */}
                        <button
                            type="button"
                            onClick={() => setSelectedMethod('intl_send')}
                            className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center transition-all ${selectedMethod === "intl_send"
                                ? "border-pink-500 ring-2 ring-pink-200"
                                : "border-gray-200 hover:border-pink-300 hover:bg-pink-50/30"
                                }`}
                        >
                            <div className="w-14 h-14 flex items-center justify-center mb-2">
                                <Image
                                    src="/bkash.png"
                                    alt="bKash"
                                    width={56}
                                    height={56}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 leading-snug">
                                বিদেশ থেকে <span className="text-pink-600">Send Money</span> করুন
                            </span>
                        </button>

                        {/* Domestic Payment */}
                        <button
                            type="button"
                            onClick={() => setSelectedMethod('bd_payment')}
                            className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center transition-all ${selectedMethod === "bd_payment"
                                ? "border-amber-600 ring-2 ring-amber-100"
                                : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/30"
                                }`}
                        >
                            <div className="w-14 h-14 flex items-center justify-center mb-2">
                                <Image
                                    src="/bkash.png"
                                    alt="bKash"
                                    width={56}
                                    height={56}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 leading-snug">
                                দেশ থেকে <span className="text-amber-700">Payment</span> করুন
                            </span>
                        </button>

                        {/* Bank Transfer */}
                        <button
                            type="button"
                            onClick={() => setSelectedMethod('bank')}
                            className={`p-2.5 border rounded-xl flex flex-col items-center justify-center text-center transition-all ${selectedMethod === 'bank'
                                ? 'border-amber-600 ring-2 ring-amber-100'
                                : 'border-gray-200 hover:bg-amber-50/30'
                                }`}
                        >
                            <div className="px-1.5 py-0.5 bg-cyan-50 border border-cyan-200 rounded text-[8px] font-black text-cyan-700 tracking-tighter mb-2">
                                BANK TRANSFER
                            </div>
                            <span className="text-[10px] font-semibold text-gray-600">Bank Transfer</span>
                        </button>
                    </div>

                    {/* 3. Render Content Conditionally via selectedMethod State */}

                    {/* 3. Render Content Conditionally via selectedMethod State */}
                    {/* OPTION 1: International Send Money Content */}
                    {selectedMethod === 'intl_send' && (
                        <div className="border border-pink-500 rounded-2xl p-4 bg-pink-50/50 space-y-4 transition-all">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-sm font-black text-pink-600">বিদেশ থেকে Send Money অপশনে ট্যাপ করুন।</h3>
                                <span className="text-xs font-bold text-gray-500">01717261260</span>
                            </div>

                            <div className="bg-white border border-emerald-500 rounded-lg p-2 flex items-center gap-2 text-xs text-emerald-700 font-semibold shadow-sm">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2C9 14 1 18 1 18h16c0 0-4-4-4-6m-4 0V4a2 2 0 114 0v8m-4 0h4" />
                                </svg>
                                <span>Delivery is free on this order!</span>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-700">How much to pay now?</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('advance')}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${paymentType === 'advance' ? 'bg-pink-500 text-white border-pink-600 shadow-sm' : 'bg-white text-gray-800 border-gray-100'}`}
                                    >
                                        <div className="text-[10px] font-bold opacity-90">Advance Confirmation</div>
                                        <div className="text-sm font-black mt-0.5">৳500</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('full')}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${paymentType === 'full' ? 'bg-pink-500 text-white border-pink-600 shadow-sm' : 'bg-white text-gray-800 border-gray-100'}`}
                                    >
                                        <div className="text-[10px] font-bold opacity-90">Full Amount</div>
                                        <div className="text-sm font-black mt-0.5">৳{total}</div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 shadow-inner">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Payment Instructions</span>
                                </div>
                                <p className="text-xs text-red-600 font-bold leading-relaxed">
                                    নিচের bKash নাম্বারে {activeAmount} Send করুন, তারপর আপনার Transaction ID (TrxID) দিয়ে দিন।
                                </p>
                                <div className="flex items-center justify-between bg-gray-50/50 rounded-lg px-3 py-2 border border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500">Send to: <strong className="text-gray-800 ml-1 font-mono text-xs">01717261260</strong></span>
                                    <button type="button" onClick={() => handleCopy('01717261260')} className="text-[10px] font-bold text-pink-600 border border-pink-100 rounded-md bg-white px-2.5 py-1">📋 Copy</button>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50/50 rounded-lg px-3 py-2 border border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500">Amount: <strong className="text-gray-800 ml-1 font-black text-xs">{activeAmount}</strong></span>
                                    <button type="button" onClick={() => handleCopy(activeAmount)} className="text-[10px] font-bold text-pink-600 border border-pink-100 rounded-md bg-white px-2.5 py-1">📋 Copy</button>
                                </div>
                                <div className="space-y-1.5 pt-1">
                                    <label className="block text-[10px] font-black tracking-wide text-red-500 uppercase">Transaction ID / TrxID *</label>
                                    <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="ENTER TRXID OR REFERENCE NUMBER" className="w-full px-3 py-2.5 bg-white border border-pink-500 rounded-lg text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 shadow-sm" />
                                    <span className="block text-[9px] text-gray-400 font-mono">e.g. 8N7A5BC2DE</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OPTION 2: Domestic Payment Content */}
                    {selectedMethod === 'bd_payment' && (
                        <div className="border border-amber-600 rounded-2xl p-4 bg-amber-50/40 space-y-4 transition-all">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-sm font-black text-amber-700">দেশ থেকে Payment অপশনে ট্যাপ করুন।</h3>
                                <span className="text-xs font-bold text-gray-500">01339900138</span>
                            </div>

                            <div className="bg-white border border-emerald-500 rounded-lg p-2 flex items-center gap-2 text-xs text-emerald-700 font-semibold shadow-sm">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2C9 14 1 18 1 18h16c0 0-4-4-4-6m-4 0V4a2 2 0 114 0v8m-4 0h4" />
                                </svg>
                                <span>Delivery is free on this order!</span>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-700">How much to pay now?</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('advance')}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${paymentType === 'advance' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-gray-800 border-gray-100'}`}
                                    >
                                        <div className="text-[10px] font-bold opacity-90">Advance Confirmation</div>
                                        {/* FIXED BELOW: Changed ৳৫০০ to ৳500 */}
                                        <div className="text-sm font-black mt-0.5">৳500</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('full')}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${paymentType === 'full' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-gray-800 border-gray-100'}`}
                                    >
                                        <div className="text-[10px] font-bold opacity-90">Full Amount</div>
                                        <div className="text-sm font-black mt-0.5">৳{total}</div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 shadow-inner">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Payment Instructions</span>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-xs text-amber-800 font-bold leading-relaxed">
                                        নিচের bKash Merchant নাম্বারে &quot;Payment&quot; করুন। Amount: {activeAmount}। Payment হয়ে গেলে আপনার Transaction ID (TrxID) এখানে দিয়ে দিন।
                                    </p>
                                    <p className="text-xs text-red-600 font-black flex items-center gap-1">
                                        ⚠️ &quot;Send Money&quot; বা &quot;Cash Out&quot; নয়, শুধু &quot;Payment&quot; ব্যবহার করুন।
                                    </p>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50/50 rounded-lg px-3 py-2 border border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500">Send to: <strong className="text-gray-800 ml-1 font-mono text-xs">01339900138</strong></span>
                                    <button type="button" onClick={() => handleCopy('01339900138')} className="text-[10px] font-bold text-pink-600 border border-pink-100 rounded-md bg-white px-2.5 py-1">📋 Copy</button>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50/50 rounded-lg px-3 py-2 border border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500">Amount: <strong className="text-gray-800 ml-1 font-black text-xs">{activeAmount}</strong></span>
                                    <button type="button" onClick={() => handleCopy(activeAmount)} className="text-[10px] font-bold text-pink-600 border border-pink-100 rounded-md bg-white px-2.5 py-1">📋 Copy</button>
                                </div>
                                <div className="space-y-1.5 pt-1">
                                    <label className="block text-[10px] font-black tracking-wide text-red-500 uppercase">Transaction ID / TrxID *</label>
                                    <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="ENTER TRXID OR REFERENCE NUMBER" className="w-full px-3 py-2.5 bg-white border border-amber-600 rounded-lg text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 shadow-sm" />
                                    <span className="block text-[9px] text-gray-400 font-mono">e.g. 8N7A5BC2DE</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OPTION 3: Bank Transfer Content */}
                    {selectedMethod === 'bank' && (
                        <div className="border border-amber-600 rounded-2xl p-4 bg-amber-50/40 space-y-4 transition-all">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-sm font-black text-amber-700">Bank Transfer</h3>
                                <span className="text-xs font-bold text-gray-500">3911901019487</span>
                            </div>

                            <div className="bg-white border border-emerald-500 rounded-lg p-2 flex items-center gap-2 text-xs text-emerald-700 font-semibold shadow-sm">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2C9 14 1 18 1 18h16c0 0-4-4-4-6m-4 0V4a2 2 0 114 0v8m-4 0h4" />
                                </svg>
                                <span>Delivery is free on this order!</span>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-700">How much to pay now?</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('advance')}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${paymentType === 'advance' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-gray-800 border-gray-100'}`}
                                    >
                                        <div className="text-[10px] font-bold opacity-90">Advance Confirmation</div>
                                        {/* FIXED BELOW: Changed ৳৫০০ to ৳500 */}
                                        <div className="text-sm font-black mt-0.5">৳500</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('full')}
                                        className={`p-2.5 rounded-xl border text-center transition-all ${paymentType === 'full' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-gray-800 border-gray-100'}`}
                                    >
                                        <div className="text-[10px] font-bold opacity-90">Full Amount</div>
                                        <div className="text-sm font-black mt-0.5">৳{total}</div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 shadow-inner">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Payment Instructions</span>
                                </div>
                                <div className="text-xs text-amber-950 space-y-1 font-semibold">
                                    <p><span className="text-gray-400">Bank Name:</span> Pubali Bank PLC</p>
                                    <p><span className="text-gray-400">A/C Name:</span> Mango Lovers Awal Foods</p>
                                    <p><span className="text-gray-400">Branch:</span> Halishahar Branch</p>
                                    <p className="mb-2"><span className="text-gray-400">Routing Number:</span> 175153161</p>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50/50 rounded-lg px-3 py-2 border border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500">Send to: <strong className="text-gray-800 ml-1 font-mono text-xs">3911901019487</strong></span>
                                    <button type="button" onClick={() => handleCopy('3911901019487')} className="text-[10px] font-bold text-pink-600 border border-pink-100 rounded-md bg-white px-2.5 py-1">📋 Copy</button>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50/50 rounded-lg px-3 py-2 border border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500">Amount: <strong className="text-gray-800 ml-1 font-black text-xs">{activeAmount}</strong></span>
                                    <button type="button" onClick={() => handleCopy(activeAmount)} className="text-[10px] font-bold text-pink-600 border border-pink-100 rounded-md bg-white px-2.5 py-1">📋 Copy</button>
                                </div>
                                <div className="space-y-1.5 pt-1">
                                    <label className="block text-[10px] font-black tracking-wide text-red-500 uppercase">Transaction ID / TrxID *</label>
                                    <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="ENTER TRXID OR REFERENCE NUMBER" className="w-full px-3 py-2.5 bg-white border border-amber-600 rounded-lg text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 shadow-sm" />
                                    <span className="block text-[9px] text-gray-400 font-mono">e.g. 8N7A5BC2DE</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>




            </div>

            {/* Right Side: Order Summary Card */}
            <div className="sticky top-24 md:w-1/3 w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 self-start space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h2 className="text-base font-bold text-gray-800">
                        Order Summary
                    </h2>

                    <Link
                        href="/products"
                        className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                        <FaPlus className="text-xs" />
                        <span>Add More</span>
                    </Link>
                </div>

                {/* Product Info Block */}
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={`${item._id}-${item.variant.quantity}`}
                            className="flex items-start justify-between gap-4"
                        >
                            <div className="flex gap-3">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={56}
                                    height={56}
                                    className="rounded-lg border object-cover"
                                />


                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-gray-800">
                                        {item.name}
                                    </h4>

                                    <p className="text-xs text-gray-500">
                                        {item.variant.quantity}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1">
                                        <button
                                            onClick={() =>
                                                decreaseQuantity(item._id, item.variant.quantity)
                                            }
                                            type="button"
                                            className="w-6 h-6 border rounded"
                                        >
                                            -
                                        </button>

                                        <span className="text-xs font-semibold">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                increaseQuantity(item._id, item.variant.quantity)
                                            }
                                            type="button"
                                            className="w-6 h-6 border rounded"
                                        >
                                            +
                                        </button>

                                        <button
                                            onClick={() =>
                                                removeFromCart(item._id, item.variant.quantity)
                                            }
                                            type="button"
                                            className="w-6 h-6 text-red-600"
                                        >
                                            <FaTrash></FaTrash>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm font-bold text-gray-800">
                                ৳{(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="border-gray-100" />

                <div className="rounded-xl border border-gray-200 bg-white px-6 py-2">

                    <h3 className="text-lg font-bold text-gray-900 mb-5">
                        Order Summary
                    </h3>

                    <div className="space-y-4">
                        {selectedMethod === 'intl_send' &&
                            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
                                মোট টাকার সাথে বিকাশ Send Money চার্জ (১.৮%) যুক্ত করা হয়েছে।
                            </p>
                        }
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-semibold">
                                ৳{subtotal.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Charge</span>

                            <span className="font-semibold text-emerald-600">
                                Free
                            </span>
                        </div>

                        {cartItems.length > 0 && paymentType === "advance" && (
                            <>
                                <div className="flex justify-between text-gray-600">
                                    <span>Advance Payment</span>
                                    <span className="font-semibold text-orange-500">
                                        ৳500
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Due on Delivery</span>
                                    <span className="font-semibold">
                                        ৳{(total - activeAmount).toLocaleString()}
                                    </span>
                                </div>
                            </>
                        )}

                        <div className="border-t pt-4 flex justify-between items-center">

                            <span className="text-lg font-bold">
                                Total
                            </span>

                            <span className="text-2xl font-bold text-orange-500">
                                ৳{activeAmount.toLocaleString()}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Checkout Submit Trigger */}
                <button
                    type="button"
                    disabled={isDisabled}
                    onClick={handleSubmit(onSubmit)}
                    className={`w-full py-3 rounded-xl font-bold transition ${isDisabled
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                >
                    {loading
                        ? "Placing Order..."
                        : `Confirm Order — ৳${activeAmount.toLocaleString()}`}
                </button>
            </div>
        </div>
    )
}