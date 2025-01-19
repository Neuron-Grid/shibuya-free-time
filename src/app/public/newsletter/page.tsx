"use client";
import React, { useState } from "react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        if (!email) {
        setMessage("メールアドレスを入力してください");
        return;
        }

        try {
        const res = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok) {
            setMessage(data.error || "登録に失敗しました");
        } else {
            setMessage("登録が完了しました!");
            setEmail("");
        }
        } catch (err) {
        setMessage("エラーが発生しました");
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
                    className="w-full max-w-md p-3 border rounded-md text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-hover dark:border-dark-hover focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            <button
                type="submit"
                className="w-full max-w-md p-3 bg-light-accent text-white rounded-md hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover focus:outline-none"
                >
                登録</button>
            {message && <p>{message}</p>}
            </form>
        </div>
    );
}