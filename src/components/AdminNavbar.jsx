'use client';

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FiCheckCircle, FiChevronRight, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { FiBell } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";


import {
    FiShoppingBag,
    FiMessageSquare,
    FiPackage,
} from "react-icons/fi";
import { VscDashboard } from "react-icons/vsc";
import { HiHome } from "react-icons/hi2";
import { MdPhotoLibrary } from "react-icons/md";
import Image from "next/image";

function AdminDashboard({ session, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const pathname = usePathname(); // Get the current active URL path

    //data count loading for notification bell icon
    const { data } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await fetch("/api/admin/notifications");

            if (!res.ok) {
                throw new Error("Failed to load notifications");
            }

            return res.json();
        },
        refetchInterval: 10000,
    });


    const totalNotifications = data?.total || 0;
    const latestOrders = data?.latestOrders || [];
    const latestMessages = data?.latestMessages || [];

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const previousOrderId = useRef(null);
    const previousMessageId = useRef(null);

    const latestOrder = latestOrders[0];
    const latestMessage = latestMessages[0];

    useEffect(() => {
        if (!data) return;
        if (!("Notification" in window)) return;
        if (Notification.permission !== "granted") return;

        // New Order
        if (
            previousOrderId.current &&
            latestOrder &&
            latestOrder._id !== previousOrderId.current
        ) {
            const notification = new Notification("🛒 New Order", {
                body: `${latestOrder.customer?.fullName ?? "A customer"} placed a new order.`,
                icon: "/logo.png",
            });

            notification.onclick = () => {
                window.focus();
                window.location.href = "/admin/manageOrders";
                notification.close();
            };
        }

        // New Message
        if (
            previousMessageId.current &&
            latestMessage &&
            latestMessage._id !== previousMessageId.current
        ) {
            const notification = new Notification("💬 New Message", {
                body: `${latestMessage.name ?? "Someone"} sent you a message.`,
                icon: "/logo.png",
            });

            notification.onclick = () => {
                window.focus();
                window.location.href = "/admin/messages";
                notification.close();
            };
        }

        previousOrderId.current = latestOrder?._id ?? null;
        previousMessageId.current = latestMessage?._id ?? null;

    }, [data, latestOrder, latestMessage]);

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/admin/dashboard',
            icon: <VscDashboard className="h-5 w-5" />,
        },
        {
            id: 'changeHomeBanner',
            label: 'Change Banner',
            href: '/admin/changeBanners',
            icon: <MdPhotoLibrary className="h-5 w-5" />,
        },
        {
            id: 'manageOrders',
            label: 'Manage Orders',
            href: '/admin/manageOrders',
            icon: <FiShoppingBag className="h-5 w-5" />,
        },
        {
            id: 'messages',
            label: 'Manage Messages',
            href: '/admin/messages',
            icon: <FiMessageSquare className="h-5 w-5" />,
        },
        {
            id: 'addProducts',
            label: 'Add Products',
            href: '/admin/addProducts',
            icon: <FiPackage className="h-5 w-5" />,
        },
        {
            id: 'manageProducts',
            label: 'Manage Products',
            href: '/admin/manageProducts',
            icon: <FiPackage className="h-5 w-5" />,
        },
    ];

    // Determine fallback title if no navigation match is detected
    const activeItem = navigationItems.find(item => pathname === item.href);
    const headerTitle = activeItem ? activeItem.label : "Dashboard";

    // Dynamic user configurations powered by next-auth session
    const adminName = session?.user?.name || "Admin";
    const adminEmail = session?.user?.email || "admin@company.com";
    const avatarInitials = adminName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    const notificationRef = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target)
            ) {
                setShowNotifications(false);
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () =>
            document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="h-screen bg-slate-50 text-slate-800 antialiased flex">

            {/* 1. MOBILE SIDEBAR OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* 2. SIDEBAR NAVIGATION */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 flex sm:w-48 w-52 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Sidebar Header */}
                <div className="relative flex h-16 items-center justify-between px-6 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo2.png"
                            alt="Mango Lovers Logo"
                            width={90}
                            height={40}
                            className="object-contain h-12 w-auto"
                            priority
                        />
                    </div>
                    {/* Close Menu Button (Mobile Only) */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="rounded-lg p-1 text-orange-500 hover:bg-slate-100 lg:hidden cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Sidebar Nav Items */}
                <nav className="flex-1 space-y-1 px-4 py-6">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)} // Close sidebar upon mobile route change
                                className={`flex w-full items-center gap-3 rounded-xl py-3 text-sm font-medium transition-all cursor-pointer ${isActive
                                    ? 'bg-indigo-50/60 text-orange-500'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer Account block */}
                <div className="border-t border-slate-100 p-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 rounded-xl p-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 font-semibold text-white">
                            {avatarInitials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {adminName}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                {adminEmail}
                            </p>
                        </div>
                    </div>

                    <div className="my-3 border-t border-slate-100" />

                    {/* Logout */}
                    <button
                        onClick={() =>
                            signOut({
                                callbackUrl: "/admin/login",
                            })
                        }
                        className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <div className="flex items-center gap-3">
                            <FiLogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </div>
                    </button>
                </div>
            </aside>

            {/* 3. MAIN CONTENT CONTAINER */}
            <div className="flex flex-1 flex-col overflow-hidden w-full">

                {/* Top Header Bar */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8 shadow-sm shadow-slate-100">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Button (Mobile Only) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 lg:hidden cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold text-slate-900">
                            {headerTitle}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">

                        <div ref={notificationRef} className="relative">

                            <button
                                onClick={() => setShowNotifications(prev => !prev)}
                                className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            >
                                <FiBell className="h-6 w-6" />

                                {totalNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                                        {totalNotifications}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div
                                    className="fixed top-16 left-4 right-4 w-auto max-w-none sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 sm:w-96 sm:max-w-[24rem] bg-white rounded-2xl border border-slate-100 shadow-xl z-[9999] overflow-hidden"
                                >

                                    {/* Header */}
                                    <div className="px-4 sm:px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-800 text-base">Notifications</h3>
                                            {(latestOrders.length > 0 || latestMessages.length > 0) && (
                                                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    {latestOrders.length + latestMessages.length}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Notification List Container */}
                                    <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto divide-y divide-slate-50">

                                        {/* Orders Section */}
                                        {latestOrders.length > 0 && (
                                            <div className="py-2">
                                                <div className="px-4 sm:px-5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                    Orders
                                                </div>
                                                {latestOrders.map(order => (
                                                    <Link
                                                        key={order._id}
                                                        href={`/admin/manageOrders/${order._id}`}
                                                        onClick={() => setShowNotifications(false)}
                                                        className="group flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-slate-50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0 pr-2">
                                                            <div className="h-9 w-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100/50 text-base">
                                                                <FiShoppingBag />
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <p className="text-sm font-medium text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                                                                    New Order Received
                                                                </p>
                                                                <p className="text-xs text-slate-500 truncate max-w-[150px] sm:max-w-[200px]">
                                                                    {order.customer?.fullName || "Guest Customer"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <FiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Messages Section */}
                                        {latestMessages.length > 0 && (
                                            <div className="py-2">
                                                <div className="px-4 sm:px-5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                    Messages
                                                </div>
                                                {latestMessages.map(message => (
                                                    <Link
                                                        key={message._id}
                                                        href="/admin/messages"
                                                        onClick={() => setShowNotifications(false)}
                                                        className="group flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-slate-50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0 pr-2">
                                                            <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50 text-base">
                                                                <FiMessageSquare />
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                                    {message.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500 truncate max-w-[150px] sm:max-w-[200px]">
                                                                    New message received
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <FiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Empty State */}
                                        {latestOrders.length === 0 && latestMessages.length === 0 && (
                                            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
                                                <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-3 text-xl">
                                                    <FiCheckCircle />
                                                </div>
                                                <p className="text-sm font-medium text-slate-800">All caught up!</p>
                                                <p className="text-xs text-slate-400 mt-0.5">No new notifications right now.</p>
                                            </div>
                                        )}

                                    </div>

                                    {/* Footer Navigation */}
                                    <div className="border-t border-slate-100 p-2 bg-slate-50/50 flex items-center justify-between gap-2">
                                        <Link
                                            href="/admin/manageOrders?status=pending&page=1"
                                            onClick={() => setShowNotifications(false)}
                                            className="flex-1 text-center py-2 px-2 sm:px-3 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100/70 rounded-lg transition-colors truncate"
                                        >
                                            View Orders
                                        </Link>

                                        <Link
                                            href="/admin/messages"
                                            onClick={() => setShowNotifications(false)}
                                            className="flex-1 text-center py-2 px-2 sm:px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/70 rounded-lg transition-colors truncate"
                                        >
                                            View Messages
                                        </Link>
                                    </div>

                                </div>
                            )}

                        </div>

                        <Link
                            href="/"
                            className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        >
                            <HiHome className="h-6 w-6" />
                        </Link>

                    </div>
                </header>

                <main className="flex-1 overflow-y-auto md:p-3 p-1">
                    {children}
                </main>

            </div>
        </div>
    );
}

export default AdminDashboard;