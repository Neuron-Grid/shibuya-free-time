"use client";

import { login } from "@/app/admin/login/actions";
import React from "react";

export default function LoginPage() {
    return (
        <div className="bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
            <div className="container">
                <div className="p-4 sm:p-8 flex min-h-screen items-start justify-center">
                    <form
                        aria-label="Login Form"
                        className="relative w-full max-w-sm rounded-md p-6 mt-10 sm:mt-16 md:mt-20 pb-20"
                    >
                        {/* Email */}
                        <div>
                            <label className="mb-1 block font-semibold" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                aria-required="true"
                                aria-label="Email address"
                                className="w-full rounded-md border border-grayscale-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:border-grayscale-700 dark:focus:ring-dark-accent"
                            />
                        </div>

                        {/* password */}
                        <div className="relative">
                            <label className="mb-1 block font-semibold" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                aria-required="true"
                                aria-label="Password"
                                className="w-full rounded-md border border-grayscale-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:border-grayscale-700 dark:focus:ring-dark-accent"
                            />
                        </div>

                        <div className="absolute bottom-4 right-4">
                            <button
                                type="submit"
                                formAction={login}
                                className="text-light-text dark:text-dark-text bg-light-accent hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover rounded-md px-4 py-2 font-semibold transition-colors"
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
