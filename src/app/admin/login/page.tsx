"use client";

import { login } from "@/app/admin/login/actions";
import React from "react";

export default function LoginPage() {
    return (
        <div className="bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text min-h-screen">
            <div className="container">
                <div className="p-4 sm:p-8 flex items-start justify-center">
                    <form
                        aria-labelledby="login-form-title"
                        className="relative w-full max-w-sm rounded p-6 mt-10 sm:mt-16 md:mt-20 pb-20"
                        method="POST"
                    >
                        <h2
                            id="login-form-title"
                            className="text-lg font-bold mb-4 text-light-text dark:text-dark-text"
                        >
                            Login Form
                        </h2>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="mb-1 block font-semibold" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4 relative">
                            <label className="mb-1 block font-semibold" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Enter your password"
                                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            />
                        </div>

                        <div className="absolute bottom-4 right-4">
                            <button
                                type="submit"
                                formAction={login}
                                className="bg-light-accent hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover rounded px-4 py-2 font-semibold transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
