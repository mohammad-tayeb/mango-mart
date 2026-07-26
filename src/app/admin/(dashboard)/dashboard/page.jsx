"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiShoppingBag,
  FiMessageSquare,
  FiTruck,
  FiPackage,
  FiTrendingUp,
  FiCalendar,
} from "react-icons/fi";
import {
  HiOutlineShoppingCart,
  HiOutlineArrowUpRight,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";
import {
  HiOutlineCurrencyBangladeshi,
  HiStar,
  HiOutlineDocumentText,
} from "react-icons/hi";
import Link from "next/link";

export default function DashboardStats() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-4 md:p-6 animate-pulse space-y-6">
        <div className="h-8 w-48 rounded-lg bg-slate-200" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 h-[220px]" />
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 h-[220px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 h-[140px]" />
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 h-[140px]" />
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 h-[140px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center text-sm font-medium shadow-sm">
        ডাটা লোড করতে সমস্যা হয়েছে! অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।
      </div>
    );
  }

  const formatBn = (num) =>
    num !== undefined && num !== null ? num.toLocaleString("bn-BD") : "০";

  const timeframeData = {
    today: {
      label: "আজকের বিবরণ",
      sales: dashboardData?.todaySaleAmount || 0,
      orders: dashboardData?.todayOrderCount || 0,
    },
    lastWeek: {
      label: "গত ৭ দিনের বিবরণ",
      sales: dashboardData?.lastWeek?.totalSales || 0,
      orders: dashboardData?.lastWeek?.orderCount || 0,
    },
    lastMonth: {
      label: "গত ৩০ দিনের বিবরণ",
      sales: dashboardData?.lastMonth?.totalSales || 0,
      orders: dashboardData?.lastMonth?.orderCount || 0,
    },
    lastYear: {
      label: "গত ১ বছরের বিবরণ",
      sales: dashboardData?.lastYear?.totalSales || 0,
      orders: dashboardData?.lastYear?.orderCount || 0,
    },
  };

  const currentPeriod = timeframeData[selectedTimeframe];

  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            বিজনেস ওভারভিউ
          </h1>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="space-y-6">
        {/* Top Row: Revenue & Timeframe Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Total Revenue Card */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  মোট বিক্রি (রেভিনিউ)
                </span>
                <div className="p-2.5 rounded-xl text-emerald-600 bg-emerald-50 border border-emerald-100/80 group-hover:scale-105 transition-transform">
                  <HiOutlineCurrencyBangladeshi className="text-2xl" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                ৳ {formatBn(dashboardData?.totalRevenue)}
              </h3>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  মোট বকেয়া
                </p>
                <p className="text-base font-bold text-rose-600 mt-0.5">
                  ৳ {formatBn(dashboardData?.totalDue)}
                </p>
              </div>
              <div className="border-l border-slate-100 pl-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  অগ্রিম গ্রহণ
                </p>
                <p className="text-base font-bold text-amber-600 mt-0.5">
                  ৳ {formatBn(dashboardData?.totalAdvanceReceived)}
                </p>
              </div>
            </div>
          </div>

          {/* Timeframe Analytics Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border-2 border-indigo-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80">
                  <FiTrendingUp className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    সময়ভিত্তিক বিক্রয় হিসাব
                  </h4>
                </div>
              </div>

              {/* Timeframe Selector Tabs */}
              <div className="inline-flex p-1 bg-slate-100/80 rounded-xl text-xs font-semibold text-slate-600">
                {[
                  { key: "today", label: "আজকে" },
                  { key: "lastWeek", label: "গত ৭ দিন" },
                  { key: "lastMonth", label: "গত ৩০ দিন" },
                  { key: "lastYear", label: "গত ১ বছর" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedTimeframe(tab.key)}
                    className={`px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      selectedTimeframe === tab.key
                        ? "bg-white text-indigo-600 shadow-xs font-bold border border-indigo-100"
                        : "hover:text-slate-900 text-slate-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Active Period Metrics */}
            <div className="bg-slate-100/80 border border-indigo-200/60 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white border border-slate-200/80 rounded-xl text-indigo-600 shadow-2xs">
                  <FiCalendar className="text-2xl" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                    {currentPeriod.label}
                  </span>
                  <span className="text-xs text-slate-400">মোট বিক্রয়</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    ৳ {formatBn(currentPeriod.sales)}
                  </p>
                </div>
              </div>

              <div className="sm:border-l sm:border-slate-200 sm:pl-6">
                <span className="text-xs text-slate-400 block mb-0.5">
                  অর্ডার সংখ্যা
                </span>
                <p className="text-2xl font-bold text-slate-800">
                  {formatBn(currentPeriod.orders)}{" "}
                  <span className="text-xs text-slate-500 font-normal">টি</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Order Tracking Pipeline */}
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl text-blue-600 bg-blue-50 border border-blue-100/80">
                <HiOutlineShoppingCart className="text-xl" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">
                  অর্ডার ট্র্যাকিং
                </h4>
                <p className="text-xs text-slate-400">
                  সর্বমোট অর্ডার:{" "}
                  <span className="font-semibold text-slate-700">
                    {formatBn(dashboardData?.totalOrders)}
                  </span>{" "}
                  টি
                </p>
              </div>
            </div>
            <Link
              href="/admin/manageOrders"
              className="text-orange-500 hover:text-orange-600 transition-colors inline-flex items-center gap-1 text-xs font-bold bg-orange-50 hover:bg-orange-100/60 px-3 py-1.5 rounded-lg border border-orange-200/60"
            >
              ম্যানেজ করুন <HiOutlineArrowUpRight className="text-sm" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-100/80  p-4 rounded-xl border border-rose-200/70 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-1.5 text-yellow-500 mb-1.5">
                <HiOutlineClock className="text-base" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  পেন্ডিং
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-800">
                {formatBn(dashboardData?.pendingOrders)}{" "}
                <span className="text-xs text-slate-400 font-normal">টি</span>
              </p>
            </div>

            <div className="bg-slate-100/80  p-4 rounded-xl border border-amber-200/70 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-1.5 text-amber-600 mb-1.5">
                <FiTruck className="text-sm" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  চলতি পথে
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-800">
                {formatBn(
                  dashboardData?.TransitOrders ?? dashboardData?.transitOrders
                )}{" "}
                <span className="text-xs text-slate-400 font-normal">টি</span>
              </p>
            </div>

            <div className="bg-slate-100/80  p-4 rounded-xl border border-emerald-200/70 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-1.5">
                <HiOutlineCheckCircle className="text-base" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  ডেলিভার্ড
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-800">
                {formatBn(dashboardData?.deliveredOrders)}{" "}
                <span className="text-xs text-slate-400 font-normal">টি</span>
              </p>
            </div>

            <div className="bg-slate-100/80  p-4 rounded-xl border border-slate-300/80 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-1.5 text-red-500 mb-1.5">
                <HiOutlineXCircle className="text-base" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  বাতিল
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-800">
                {formatBn(dashboardData?.deletedOrders)}{" "}
                <span className="text-xs text-slate-400 font-normal">টি</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row: Products, Ratings, and Messaging */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Products Summary */}
          <div className="bg-white p-5 rounded-2xl border-teal-200 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="p-2.5 rounded-xl border w-fit text-emerald-600 bg-emerald-50 border-emerald-100/80 mb-3 group-hover:scale-105 transition-transform">
                  <FiShoppingBag className="text-xl" />
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  লাইভ পণ্য
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {formatBn(dashboardData?.totalProducts)} টি
                </h3>
              </div>

              <div className="pl-4 border-l border-slate-100">
                <div className="p-2.5 rounded-xl border w-fit text-rose-600 bg-rose-50 border-rose-100/80 mb-3 group-hover:scale-105 transition-transform">
                  <FiPackage className="text-xl" />
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  স্টক শেষ
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {formatBn(dashboardData?.noOfStockOutProducts)} টি
                </h3>
              </div>
            </div>
          </div>

          {/* Ratings & Reviews */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="p-2.5 rounded-xl border w-fit text-amber-500 bg-amber-50 border-amber-100/80 mb-3 group-hover:scale-105 transition-transform">
                  <HiStar className="text-xl" />
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  গড় রেটিং
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {dashboardData?.averageRating
                    ? `${Number(dashboardData.averageRating).toFixed(1)} / ৫`
                    : "০.০ / ৫"}
                </h3>
              </div>

              <div className="pl-4 border-l border-slate-100">
                <div className="p-2.5 rounded-xl border w-fit text-indigo-600 bg-indigo-50 border-indigo-100/80 mb-3 group-hover:scale-105 transition-transform">
                  <HiOutlineDocumentText className="text-xl" />
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  মোট রিভিউ
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {formatBn(
                    dashboardData?.toatlReview ?? dashboardData?.totalReview
                  )}{" "}
                  টি
                </h3>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white p-5 rounded-2xl border border-cyan-200 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl border text-cyan-600 bg-cyan-50 border-cyan-100/80 group-hover:scale-105 transition-transform">
                  <FiMessageSquare className="text-xl" />
                </div>
                <Link
                  href="/admin/messages"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-slate-50 transition-colors"
                >
                  <HiOutlineArrowUpRight className="text-lg" />
                </Link>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                নতুন মেসেজ
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatBn(dashboardData?.unreadMessages)} টি
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}