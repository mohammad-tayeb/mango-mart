import Count from '@/components/Count';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function AboutUs() {
    return (
        <div className="bg-amber-50 text-gray-800">

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
                        আমাদের গল্প: গাছপাকা আমের খাঁটি স্বাদ
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        রাসায়নিকমুক্ত, একদম বাগান থেকে সরাসরি আপনার টেবিলে। আমরা শুধু আম বিক্রি করি না, প্রতিটি কামড়ে পৌঁছে দিই রাজশাহীর ঐতিহ্য।
                    </p>
                </div>
                {/* Decorative Wave Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-amber-50 clip-path-wave"></div>
            </section>

            {/* Our Mission & Vision */}
            <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <span className="text-orange-600 font-bold uppercase tracking-wider text-sm bg-orange-100 px-3 py-1 rounded-full">
                        আমাদের লক্ষ্য
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900">
                        খাদ্যে ভেজালের ভিড়ে আমরা দিচ্ছি শতভাগ নিরাপত্তার নিশ্চয়তা
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        বাজারের কেমিক্যালযুক্ত এবং কৃত্রিম উপায়ে পাকানো আমের ভিড়ে আসল স্বাদ খুঁজে পাওয়া এখন দুষ্কর। আমাদের মূল লক্ষ্য হলো— কোনো প্রকার কার্বাইড বা ফরমালিন ছাড়া, প্রাকৃতিকভাবে পাকা সেরা আমগুলো সরাসরি চাষীদের কাছ থেকে সংগ্রহ করে আপনার দোরগোড়ায় পৌঁছে দেওয়া।
                    </p>
                    <div className="border-l-4 border-amber-500 pl-4 italic text-gray-700">
                        &quot;কৃষকের পরিশ্রম আর আপনার সন্তুষ্টিই আমাদের পথচলার শক্তি।&quot;
                    </div>
                </div>

                {/* Interactive Image Placeholder / Graphic */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl transform rotate-3 scale-105 opacity-20 -z-10"></div>
                    <div className="relative w-full h-[400px]">
                        <Image
                            src="/aboutBanner.png"
                            alt="Mango Lovers Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us (Features) */}
            <section className="bg-white py-16 border-y border-amber-100">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-950 mb-12">
                        কেন আমাদের আম সেরা?
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-center hover:shadow-md transition">
                            <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                                🌳
                            </div>
                            <h3 className="text-xl font-bold mb-2">সরাসরি বাগান থেকে</h3>
                            <p className="text-gray-600 text-sm">
                                রাজশাহী ও চাঁপাইনবাবগঞ্জের সেরা বাগান থেকে আম সরাসরি সংগ্রহ করা হয়। কোনো মধ্যস্বত্বভোগী নেই।
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-center hover:shadow-md transition">
                            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                                🌿
                            </div>
                            <h3 className="text-xl font-bold mb-2">১০০% কেমিক্যাল মুক্ত</h3>
                            <p className="text-gray-600 text-sm">
                                ফরমালিন, কার্বাইড বা কোনো ক্ষতিকারক স্প্রে মুক্ত। প্রাকৃতিকভাবে পাকা আমের আসল সুবাস ও মিষ্টি স্বাদ।
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-center hover:shadow-md transition">
                            <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                                📦
                            </div>
                            <h3 className="text-xl font-bold mb-2">নিরাপদ প্যাকেজিং</h3>
                            <p className="text-gray-600 text-sm">
                                বিশেষভাবে তৈরি ক্যারেট বা কার্টনে নিখুঁত প্যাকেজিং, যাতে পরিবহনের সময় আমের গায়ে কোনো দাগ না পড়ে।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Count></Count>

            {/* Call to Action */}
            <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-orange-100">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        আমের সিজন সীমিত সময়ের জন্য!
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        গোপালভোগ, হিমসাগর, ল্যাংড়া কিংবা ফজলি— আপনার প্রিয় জাতের আমটি এখনই অর্ডার করুন স্টক শেষ হওয়ার আগেই।
                    </p>
                    <Link href="/products" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300 transform hover:-translate-y-0.5">
                        আমের কালেকশন দেখুন
                    </Link>
                </div>
            </section>

        </div>
    );
}