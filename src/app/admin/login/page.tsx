"use client";

import { login } from "@/app/admin/login/actions";
import React from "react";

export default function LoginPage() {
    return (
        <div className="container">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
                <div className="p-4 sm:p-8 max-w-md mx-auto">
                    <form
                        aria-labelledby="login-form"
                        className="relative w-full rounded p-6 mt-6 sm:mt-10 md:mt-12"
                        method="POST"
                    >
                        <h2
                            id="login-form"
                            className="text-lg font-bold mb-4 text-light-text dark:text-dark-text"
                        >
                            管理者用ログインページ
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
                        <div className="mb-4">
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

                        {/* Submit */}
                        <div className="mt-6 text-right">
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
