"use client";

import type { Database } from "@/types/supabase/database.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

// newsletter_subscribersテーブルのRow型
type NewsletterSubscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];

export default function NewsletterSubscribersListPage() {
    const router = useRouter();
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // データ取得
    const fetchNewsletterSubscribers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/newsletter-subscribers", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch newsletter_subscribers");
            }
            const data = (await res.json()) as NewsletterSubscriber[];
            setSubscribers(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    // 削除
    const handleDelete = useCallback(
        async (id: string) => {
            if (!confirm("本当に削除しますか？")) return;
            try {
                setLoading(true);
                const url = `/api/newsletter-subscribers?id=${id}`;
                const res = await fetch(url, { method: "DELETE" });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to delete subscriber");
                }
                // 削除後、一覧を再取得
                fetchNewsletterSubscribers();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        },
        [fetchNewsletterSubscribers],
    );

    useEffect(() => {
        fetchNewsletterSubscribers();
    }, [fetchNewsletterSubscribers]);

    return (
        <div className="container mx-auto min-h-screen max-w-screen-lg px-4 sm:px-6 md:px-8 py-6 lg:py-12 transition-colors duration-300 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
            <h1 className="mb-6 text-2xl font-extrabold tracking-wide md:text-3xl lg:text-4xl">
                Newsletter Subscribers
            </h1>
            <Link
                href="/admin/dashboard/newsletter-subscribers/create"
                className="inline-block rounded bg-light-accent px-4 py-2 text-grayscale-100 transition-colors duration-300 hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover mb-6"
            >
                新規作成
            </Link>
            <div className="mb-4 rounded border-l-4 border-error bg-error/20 p-4 text-error">
                {error}
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
                現在、登録されているメールアドレスはありません。
            </p>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse overflow-hidden rounded-lg bg-white text-left shadow-sm dark:bg-grayscale-950">
                    <thead>
                        <tr className="border-b border-grayscale-300 dark:border-grayscale-700">
                            <th className="p-3 font-semibold">ID</th>
                            <th className="p-3 font-semibold">Email</th>
                            <th className="p-3 font-semibold">Subscribed At</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map((subscriber) => (
                            <tr
                                key={subscriber.id}
                                className="border-b border-grayscale-300 last:border-none dark:border-grayscale-700"
                            >
                                <td className="p-3">{subscriber.id}</td>
                                <td className="p-3">{subscriber.email}</td>
                                <td className="p-3">
                                    {subscriber.subscribed_at
                                        ? new Date(subscriber.subscribed_at).toLocaleString()
                                        : "N/A"}
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={`/admin/dashboard/newsletter-subscribers/${subscriber.id}/edit`}
                                            className="cursor-pointer text-light-accent transition-colors duration-200 hover:text-light-hover dark:text-dark-accent dark:hover:text-dark-hover"
                                        >
                                            編集
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(subscriber.id)}
                                            className="cursor-pointer text-error transition-colors duration-200 hover:text-red-400"
                                        >
                                            削除
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
