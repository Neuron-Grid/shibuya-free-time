"use client";

import type { Database } from "@/types/supabase/database.types";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

// newsletter_subscribers テーブルの Insert 型
type NewsletterSubscriberInsert = Database["public"]["Tables"]["newsletter_subscribers"]["Insert"];

export default function CreateNewsletterSubscriberPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [subscribedAt, setSubscribedAt] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 新規作成
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload: NewsletterSubscriberInsert = {
                email,
                subscribed_at: subscribedAt ? new Date(subscribedAt).toISOString() : null,
            };

            const res = await fetch("/api/newsletter-subscribers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create subscriber");
            }
            // 成功時、一覧へリダイレクト
            router.push("/admin/dashboard/newsletter-subscribers");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-screen px-4 sm:px-6 md:px-8 pt-0 flex items-start justify-center">
            <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-4xl p-6 bg-light-background dark:bg-dark-background">
                <h1 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
                    Newsletter Subscriber 新規作成
                </h1>
                {error && <p className="text-error mb-4 text-sm font-semibold">{error}</p>}
                <form onSubmit={handleCreate} className="space-y-5 md:space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="例）example@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="subscribedAt"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            Subscribed At (任意)
                        </label>
                        <input
                            id="subscribedAt"
                            type="datetime-local"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={subscribedAt || ""}
                            onChange={(e) => setSubscribedAt(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            登録日時を明示する場合に指定します。（空欄の場合は未登録扱い）
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center rounded bg-light-accent dark:bg-dark-accent text-white px-4 py-2 hover:bg-light-hover dark:hover:bg-dark-hover disabled:opacity-50 transition"
                    >
                        {loading ? "保存中..." : "新規作成"}
                    </button>
                </form>
            </div>
        </div>
    );
}
