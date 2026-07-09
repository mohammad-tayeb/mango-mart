'use client';

import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';

export default function AdminLogin() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });


    const router = useRouter();

    const onSubmit = async (data) => {

        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (res?.error) {
            alert("Invalid credentials");
            return;
        }

        router.push("/admin/dashboard");
        router.refresh();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 antialiased">
            <div className="w-full max-w-md border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100 rounded-2xl sm:p-10">

                {/* Header/Logo Area */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center mb-4">
                        <Image
                            src="/logo2.png" // Ensure your logo file is in the public folder
                            alt="Mango Lovers Logo"
                            width={150}
                            height={60}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
                    <p className="mt-1 text-sm text-slate-500">Sign in to your administrator account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            placeholder="admin@company.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition duration-200 focus:bg-white focus:outline-none focus:ring-4 ${errors.email
                                ? 'border-[#FE7704] bg-red-50/30 focus:border-[#FE7704] focus:ring-red-50'
                                : 'border-slate-200 bg-slate-50 focus:border-[#FE7704] focus:ring-indigo-50'
                                }`}
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs font-medium text-[#FE7704]">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })}
                            className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition duration-200 focus:bg-white focus:outline-none focus:ring-4 ${errors.password
                                ? 'border-[#FE7704] bg-red-50/30 focus:border-[#FE7704] focus:ring-red-50'
                                : 'border-slate-200 bg-slate-50 focus:border-[#FE7704] focus:ring-indigo-50'
                                }`}
                        />
                        {errors.password && (
                            <p className="mt-1.5 text-xs font-medium text-[#FE7704]">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center cursor-pointer rounded-xl bg-[#FE7704] px-4 py-3 text-sm font-medium text-white shadow-md shadow-indigo-100 transition duration-200 hover:bg-[#f98f31] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            'Sign In'
                        )}
                    </button>

                </form>

            </div>
        </div>
    );
}