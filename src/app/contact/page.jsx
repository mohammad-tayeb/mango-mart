"use client"
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaMailBulk } from "react-icons/fa";
import { FaClock, FaFacebook, FaInstagram, FaMapLocation, FaPhone } from "react-icons/fa6";

export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        reset,
    } = useForm({
    });

    const messageContent = watch("message", "");

    const onSubmit = async (data) => {
        const res = await fetch("/api/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.insertedId || result.success) {
            toast.success("Message Sent!");
            reset();
        } else {
            toast.error("Failed to Sent!");
        }
    };

    const contactInfo = [
        {
            label: "PHONE / WHATSAPP",
            value: "01822-350799",
            icon: (
                <FaPhone className="text-[#FE7704]"></FaPhone>
            ),
        },
        {
            label: "EMAIL",
            value: "info@mangomartbd.com",
            icon: (
                <FaMailBulk className="text-[#FE7704]"></FaMailBulk>
            ),
        },
        {
            label: "ADDRESS",
            value: "Chattogram, Bangladesh\n4202 Bangladesh",
            icon: (
                <FaMapLocation className="text-[#FE7704]"></FaMapLocation>
            ),
        },
        {
            label: "BUSINESS HOURS",
            value: "Sat – Thu: 9am – 9pm",
            icon: (
                <FaClock className="text-[#FE7704]"></FaClock>
            ),
        },
    ];

    return (
        <div className="mb-10">
            <div className="w-full bg-gray-50/50 py-8 px-4 flex items-center justify-center">
                <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {contactInfo.map((card, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Soft tint background container for the icon */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50/50 flex items-center justify-center">
                                {card.icon}
                            </div>

                            {/* Text details container */}
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mb-0.5">
                                    {card.label}
                                </span>
                                <p className="text-sm sm:text-[15px] font-bold text-gray-800 leading-snug whitespace-pre-line break-words">
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-6xl mx-auto md:px-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">

                    {/* Left Side: Contact Form Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Send us a Message</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Fill in the form below and we&lsquo;ll respond promptly.
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Name & Phone Fields Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <label className="label py-1">
                                            <span className="label-text font-medium text-gray-700">
                                                Your Name <span className="text-[#FE7704]">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Ayesha Rahman"
                                            className={`input input-bordered w-full h-11 bg-white focus:outline-none focus:ring-2 focus:ring-[#FE7704] focus:border-[#FE7704] rounded-lg border-gray-200 transition ${errors.name ? "border-[#FE7704] focus:ring-[#FE7704]" : ""
                                                }`}
                                            {...register("name", { required: "Name is required" })}
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-[#FE7704] mt-1">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label py-1">
                                            <span className="label-text font-medium text-gray-700">Phone Number</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            className="input input-bordered w-full h-11 bg-white focus:outline-none focus:ring-2 focus:ring-[#FE7704] focus:border-[#FE7704] rounded-lg border-gray-200 transition"
                                            {...register("phone", { required: "phone is required" })}
                                        />
                                        {errors.phone && (
                                            <p className="text-xs text-[#FE7704] mt-1">{errors.phone.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div className="form-control w-full">
                                    <label className="label py-1">
                                        <span className="label-text font-medium text-gray-700">Email Address</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="input input-bordered w-full h-11 bg-white focus:outline-none focus:ring-2 focus:ring-[#FE7704] focus:border-[#FE7704] rounded-lg border-gray-200 transition"
                                        {...register("email", { required: "Email is required" })}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-[#FE7704] mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="form-control w-full relative">
                                    <label className="label py-1">
                                        <span className="label-text font-medium text-gray-700">
                                            Message <span className="text-[#FE7704]">*</span>
                                        </span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Write your message here..."
                                        className={`textarea textarea-bordered w-full p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#FE7704] focus:border-[#FE7704] rounded-lg border-gray-200 resize-none transition ${errors.message ? "border-[#FE7704] focus:ring-[#FE7704]" : ""
                                            }`}
                                        maxLength={100}
                                        {...register("message", { required: "Message field cannot be empty" })}
                                    />
                                    <div className="text-right text-xs text-gray-400 mt-1">
                                        {messageContent.length}/100
                                    </div>
                                    {errors.message && (
                                        <p className="text-xs text-[#FE7704] mt-0.5">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn border-none bg-[#FE7704] hover:bg-[#f88521] text-white font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm capitalize transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-4 h-4 transform rotate-[-30deg]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                        />
                                    </svg>
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Social Media & Action Channels */}
                    <div className="flex flex-col gap-5">
                        {/* WhatsApp Button */}
                        <a
                            href="https://wa.me/8801871284044?text=Hello%20I%20would%20like%20to%20know%20more%20about%20your%20products."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 bg-[#1FC35F] hover:bg-[#19a850] text-white p-4 rounded-2xl shadow-sm group transition-all"
                        >
                            <div className="p-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    className="w-8 h-8"
                                >
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.93 0c3.166.001 6.141 1.233 8.377 3.469 2.235 2.237 3.465 5.213 3.464 8.384-.003 6.582-5.338 11.93-11.871 11.93-1.996-.001-3.957-.502-5.692-1.455L0 24zm6.59-4.846c1.64.973 3.244 1.486 4.97 1.487 5.385 0 9.766-4.381 9.769-9.766.002-2.608-1.012-5.06-2.857-6.907C16.628 2.122 14.183 1.1 11.58 1.1 6.197 1.1 1.816 5.481 1.814 10.866c-.001 1.84.49 3.633 1.423 5.2l-.994 3.628 3.722-.976l-.082-.061z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg leading-tight">Chat on WhatsApp</h4>
                                <p className="text-xs text-white/80">Fast replies during business hours</p>
                            </div>
                        </a>

                        {/* Messenger Button */}
                        <a
                            href="https://m.me/mangomartbd11"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 bg-[#006AFF] hover:bg-[#005ad4] text-white p-4 rounded-2xl shadow-sm group transition-all"
                        >
                            <div className="p-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    className="w-8 h-8"
                                >
                                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.083.3 2.224.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.293 14.246l-3.08-3.273-6.012 3.273 6.613-7.016 3.143 3.273 5.95-3.273-6.614 7.016z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg leading-tight">Chat on Messenger</h4>
                                <p className="text-xs text-white/80">Connect directly on Facebook</p>
                            </div>
                        </a>

                        {/* Response Time Info Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 shadow-sm text-sm text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                />
                            </svg>
                            <p className="leading-snug">
                                We typically respond within <span className="font-semibold text-gray-800">a few hours</span> during business hours.
                            </p>
                        </div>

                        {/* Follow Us Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">
                                Follow Us
                            </h4>
                            <div className="flex gap-4">
                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/mangomartbd11"
                                    target="_blank"
                                    className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-[#FE7704] hover:bg-rose-50 hover:scale-105 transition duration-200"
                                >
                                    <FaFacebook></FaFacebook>
                                </a>

                                {/* Instagram */}
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-[#FE7704] hover:bg-rose-50 hover:scale-105 transition duration-200"
                                >
                                    <FaInstagram></FaInstagram>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}