"use client"
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiShoppingBag, FiMessageSquare, FiTruck } from 'react-icons/fi';
import { HiOutlineShoppingCart, HiOutlineArrowUpRight, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import { HiOutlineCurrencyBangladeshi, HiStar, HiOutlineDocumentText } from 'react-icons/hi';
import Link from 'next/link';

export default function DashboardStats() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  console.log(dashboardData)
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 font-medium shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
        ড্যাশবোর্ড ডাটা লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-center text-sm">
        ডাটা লোড করতে সমস্যা হয়েছে!
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 mt-3">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            বিজনেস ওভারভিউ
          </h1>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="space-y-6">

        {/* Top Row: Revenue & Unified Order Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* 1. Total Revenue Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            {/* Hover Top Border Indicator */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-emerald-500 transition-all duration-300" />

            {/* Top Section: Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-lg border flex items-center justify-center text-emerald-600 bg-emerald-50 border-emerald-100">
                <HiOutlineCurrencyBangladeshi className="text-2xl" />
              </div>
            </div>

            {/* Middle Section: Main Metric (Total Sales) */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">মোট বিক্রি</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1.5 mb-1 tracking-tight">
                ৳ {dashboardData?.totalRevenue ? dashboardData.totalRevenue.toLocaleString('bn-BD') : '০'}
              </h3>
            </div>

            {/* Bottom Section: Secondary Metrics (Due & Advance) */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">মোট বকেয়া</p>
                <p className="text-base font-bold text-rose-600 mt-0.5">
                  ৳ {dashboardData?.totalDue ? dashboardData.totalDue.toLocaleString('bn-BD') : '০'}
                </p>
              </div>

              <div className="border-l border-slate-100 pl-4">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">অগ্রিম গ্রহণ</p>
                <p className="text-base font-bold text-amber-600 mt-0.5">
                  ৳ {dashboardData?.totalAdvanceReceived ? dashboardData.totalAdvanceReceived.toLocaleString('bn-BD') : '০'}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Single Order Master Box (Occupies 2 columns on larger screens) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-blue-500 transition-all duration-300" />

            {/* Header part of the Order box */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg text-blue-600 bg-blue-50 flex items-center justify-center">
                  <HiOutlineShoppingCart className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">অর্ডার ট্র্যাকিং</h4>
                  <p className="text-[11px] text-slate-400">সর্বমোট অর্ডার: {dashboardData?.totalOrders ? dashboardData.totalOrders.toLocaleString('bn-BD') : '০'} টি</p>
                </div>
              </div>
              <Link href="/admin/manageOrders" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 text-xs font-semibold">
                ম্যানেজ করুন <HiOutlineArrowUpRight className="text-sm" />
              </Link>
            </div>

            {/* Inner Grid for Order Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {/* Pending */}
              <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-rose-600 mb-1">
                  <HiOutlineClock className="text-sm" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">পেন্ডিং</span>
                </div>
                <p className="text-xl font-bold text-slate-800">
                  {dashboardData?.pendingOrders ? dashboardData.pendingOrders.toLocaleString('bn-BD') : '০'} <span className="text-xs text-slate-400 font-normal">টি</span>
                </p>
              </div>

              {/* Transit */}
              <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-600 mb-1">
                  <FiTruck className="text-xs" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">চলতি পথে</span>
                </div>
                <p className="text-xl font-bold text-slate-800">
                  {dashboardData?.TransitOrders ? dashboardData.TransitOrders.toLocaleString('bn-BD') : '০'} <span className="text-xs text-slate-400 font-normal">টি</span>
                </p>
              </div>

              {/* Delivered */}
              <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 mb-1">
                  <HiOutlineCheckCircle className="text-sm" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">ডেলিভার্ড</span>
                </div>
                <p className="text-xl font-bold text-slate-800">
                  {dashboardData?.deliveredOrders ? dashboardData.deliveredOrders.toLocaleString('bn-BD') : '০'} <span className="text-xs text-slate-400 font-normal">টি</span>
                </p>
              </div>

              {/* Cancelled/Deleted */}
              <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 mb-1">
                  <HiOutlineXCircle className="text-sm" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">বাতিল</span>
                </div>
                <p className="text-xl font-bold text-slate-800">
                  {dashboardData?.deletedOrders ? dashboardData.deletedOrders.toLocaleString('bn-BD') : '০'} <span className="text-xs text-slate-400 font-normal">টি</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row: Remaining Metrics (Products, Ratings, Reviews, Messages) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Total Products */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-amber-500 transition-all duration-300" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-lg border flex items-center justify-center text-amber-600 bg-amber-50 border-amber-100">
                <FiShoppingBag className="text-xl" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">মোট পণ্য (লাইভ)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1.5 mb-1 tracking-tight">
              {dashboardData?.totalProducts ? dashboardData.totalProducts.toLocaleString('bn-BD') : '০'} টি
            </h3>
          </div>

          {/* Ratings & Reviews Summary */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden">
            {/* Hover accent bar (Defaults to a neutral slate, transitions to a split gradient on hover) */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-indigo-500 transition-all duration-300" />

            <div className="grid grid-cols-2 gap-4 division-x division-slate-100">
              {/* Average Rating Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg border flex items-center justify-center text-orange-500 bg-orange-50 border-orange-100">
                    <HiStar className="text-xl" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">গড় রেটিং </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1.5 mb-1 tracking-tight">
                  {dashboardData?.averageRating ? `${Number(dashboardData.averageRating).toFixed(1)} / ৫.০` : '০.০ / ৫.০'}
                </h3>
              </div>

              {/* Total Review Section */}
              <div className="pl-4 border-l border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg border flex items-center justify-center text-indigo-600 bg-indigo-50 border-indigo-100">
                    <HiOutlineDocumentText className="text-xl" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">মোট রিভিউ</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1.5 mb-1 tracking-tight">
                  {dashboardData?.toatlReview ? dashboardData.toatlReview.toLocaleString('bn-BD') : '০'} টি
                </h3>
              </div>
            </div>
          </div>

          {/* Unread Messages */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-cyan-500 transition-all duration-300" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-lg border flex items-center justify-center text-cyan-600 bg-cyan-50 border-cyan-100">
                <FiMessageSquare className="text-xl" />
              </div>
              <Link href="/admin/messages" className="text-slate-300 group-hover:text-slate-500 transition-colors">
                <HiOutlineArrowUpRight className="text-lg text-orange-500" />
              </Link>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">নতুন মেসেজ</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1.5 mb-1 tracking-tight">
              {dashboardData?.unreadMessages ? dashboardData.unreadMessages.toLocaleString('bn-BD') : '০'} টি
            </h3>
          </div>

        </div>
      </div>
    </div>
  );
}