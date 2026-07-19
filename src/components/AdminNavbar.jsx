'use client';

import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";
import {
    FiShoppingBag,
    FiMessageSquare,
    FiPackage,
} from "react-icons/fi";
import { VscDashboard } from "react-icons/vsc";
import { HiHome } from "react-icons/hi2";
import { MdPhotoLibrary } from "react-icons/md";

function AdminDashboard({ session, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname(); // Get the current active URL path

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/admin/dashboard',
            icon: <VscDashboard className="h-5 w-5"/>,
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
                fixed inset-y-0 left-0 z-50 flex w-44 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900 tracking-tight">AdminPanel</span>
                    </div>
                    {/* Close Menu Button (Mobile Only) */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
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

                    <div className="flex items-center gap-4">
                        {/* Minimalist Top Bar Action Icon */}
                        <Link href="/" className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer">
                            <HiHome></HiHome>
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