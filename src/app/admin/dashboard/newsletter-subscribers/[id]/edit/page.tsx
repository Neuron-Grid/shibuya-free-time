"use client";

import type { Database } from "@/types/supabase/database.types";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

// Row/Updateはnewsletter_subscribersテーブルに合わせる
type NewsletterSubscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];
type NewsletterSubscriberUpdate = Database["public"]["Tables"]["newsletter_subscribers"]["Update"];

export default function EditNewsletterSubscriberPage() {
    const router = useRouter();
    const params = useParams();
    const subscriberId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [subscribedAt, setSubscribedAt] = useState<string | null>("");

    // 既存データ取得
    const fetchSubscriber = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/newsletter-subscribers", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch subscribers");
            }
            const data: NewsletterSubscriber[] = await res.json();
            const found = data.find((sub) => sub.id === subscriberId);

            if (found) {
                setEmail(found.email);
                setSubscribedAt(
                    found.subscribed_at
                        ? new Date(found.subscribed_at).toISOString().slice(0, 16)
                        : "",
                );
            } else {
                setError("Subscriber が見つかりません。");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [subscriberId]);

    // 更新
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload: NewsletterSubscriberUpdate & { id: string } = {
                id: subscriberId,
                email,
                subscribed_at: subscribedAt ? new Date(subscribedAt).toISOString() : null,
            };

            const res = await fetch("/api/newsletter-subscribers", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update subscriber");
            }
            // 成功時、一覧ページへ
            router.push("/admin/dashboard/newsletter-subscribers");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (subscriberId) {
            fetchSubscriber();
        }
    }, [subscriberId, fetchSubscriber]);

    return (
        <div className="container min-h-screen px-4 sm:px-6 md:px-8 py-6 flex items-center justify-center bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="w-full max-w-2xl dark:bg-grayscale-900 rounded shadow p-6">
                <h1 className="text-2xl font-bold mb-6">Subscriber 編集</h1>
                {error && <p className="text-error font-semibold mb-4">{error}</p>}
                {loading && !email && <p>Loading...</p>}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="subscribedAt" className="block font-medium mb-1">
                            Subscribed At
                        </label>
                        <input
                            id="subscribedAt"
                            type="datetime-local"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={subscribedAt ?? ""}
                            onChange={(e) => setSubscribedAt(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            登録日時を変更する場合はここに入力します。空欄で未登録扱いになります。
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded px-4 py-2 font-semibold bg-light-accent hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover text-white disabled:opacity-50 transition-colors"
                    >
                        {loading ? "更新中..." : "更新"}
                    </button>
                </form>
            </div>
        </div>
    );
}
