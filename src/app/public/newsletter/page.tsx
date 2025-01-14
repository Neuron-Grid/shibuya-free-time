"use client";
import React, { useState } from "react";

export const experimental_ppr = true;

const Newsletter: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 入力チェック
        if (!email) {
        setError("メールアドレスを入力してください。");
        return;
        }
    };

    return (
        <div className="container mx-auto p-4 bg-light-background dark:bg-dark-background rounded">
        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            ニュースレターを購読する
            </h1>
            <p className="text-light-text dark:text-dark-text">
            最新情報をお届けします。以下に電子メールを入力してください。
            </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full max-w-md p-3 border rounded-md text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-hover dark:border-dark-hover focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
            type="submit"
            className="w-full max-w-md p-3 bg-light-accent text-white rounded-md hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover focus:outline-none"
            >
            登録
            </button>
        </form>
        </div>
    );
};

export default Newsletter;