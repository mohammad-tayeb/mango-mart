"use client"
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import toast from 'react-hot-toast';

export default function MessageDashboard() {
  const {
    data: messages = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");

      if (!res.ok) {
        throw new Error("Failed to load messages");
      }

      return res.json();
    },
  });

  // মেসেজ ডিলিট করার ফাংশন (ফিক্সড)
  const deleteMessage = async (id) => {
    const isConfirm = window.confirm("আপনি কি নিশ্চিতভাবে মেসেজটি মুছে ফেলতে চান?");
    if (!isConfirm) return;

    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete message");

      toast.success("মেসেজটি মুছে ফেলা হয়েছে");
      refetch(); // ডিলিট হওয়ার পর তালিকাটি রি-ফেচ করবে
    } catch (error) {
      toast.error(error.message);
    }
  };

  // মেসেজ পড়া হয়েছে হিসেবে মার্ক করার ফাংশন
  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to mark as read");
      }

      toast.success("Message marked as read");
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // তারিখ সুন্দরভাবে দেখানোর জন্য ফরম্যাটার ফাংশন
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 font-medium">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
        Loading Messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-center">
        {error.message || "কোনো একটি সমস্যা হয়েছে!"}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ব্যবহারকারীর মেসেজসমূহ</h1>
          </div>
          <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full border border-orange-100">
            মোট: {messages.length} টি মেসেজ
          </span>
        </div>

        {/* Messages List Container */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-5 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${!msg.isRead
                ? "bg-orange-50/40 border-slate-200 border-l-4 border-l-orange-500"
                : "bg-white border-slate-200 border-l-4 border-l-transparent hover:border-l-orange-500"
                }`}
            >
              <div className="flex items-start space-x-4">

                {/* User Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm">
                  {msg.name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "U"}
                </div>

                {/* Message Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm font-semibold text-slate-900">
                          {msg.name}
                        </h2>

                        {/* Unread Message Badge */}
                        {!msg.isRead && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            নতুন বার্তা
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                        <p className="truncate">{msg.email}</p>
                        {msg.phone && <p>📞 {msg.phone}</p>}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap sm:mt-0.5">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>

                  {/* Main Text */}
                  <p className="text-sm text-slate-600 leading-relaxed break-words bg-slate-50/80 p-3 rounded-lg border border-slate-100 mt-2">
                    {msg.message}
                  </p>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center space-x-4 mt-3 pt-1 text-xs">
                    <a
                      onClick={() => markAsRead(msg._id)}
                      href={`https://wa.me/88${msg.phone}?text=${encodeURIComponent(
                        `Hello ${msg.name},\n\nThank you for contacting Mango Lovers.\n\n`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 font-semibold transition"
                    >
                      উত্তর দিন (Reply)
                    </a>
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="text-slate-400 hover:text-rose-600 font-medium transition"
                    >
                      মুছে ফেলুন (Delete)
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {messages.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
              কোনো মেসেজ পাওয়া যায়নি।
            </div>
          )}
        </div>

      </div>
    </div>
  );
}