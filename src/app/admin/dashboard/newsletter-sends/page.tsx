"use client";

import type { Database } from "@/types/supabase/database.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

type NewsletterSend = Database["public"]["Tables"]["newsletter_sends"]["Row"];

export default function NewsletterSendsListPage() {
    const router = useRouter();
    const [newsletterSends, setNewsletterSends] = useState<NewsletterSend[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 一覧取得
    const fetchNewsletterSends = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/newsletter-sends", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch newsletter_sends");
            }
            const data = (await res.json()) as NewsletterSend[];
            setNewsletterSends(data);
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
                const url = `/api/newsletter-sends?id=${id}`;
                const res = await fetch(url, { method: "DELETE" });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to delete newsletter_sends record");
                }
                // 削除成功後リストを再取得
                fetchNewsletterSends();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        },
        [fetchNewsletterSends],
    );

    useEffect(() => {
        fetchNewsletterSends();
    }, [fetchNewsletterSends]);

    return (
        <div className="container mx-auto min-h-screen max-w-screen-lg px-4 sm:px-6 md:px-8 py-6 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <h1 className="mb-6 text-2xl font-extrabold tracking-wide">Newsletter Sends List</h1>

            <Link
                href="/admin/dashboard/newsletter-sends/create"
                className="inline-block rounded bg-light-accent px-4 py-2 text-white transition-colors duration-300 hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover mb-6"
            >
                新規作成
            </Link>

            {error && (
                <div className="mb-4 rounded border-l-4 border-error bg-error/20 p-4 text-error">
                    {error}
                </div>
            )}
            {loading && <p className="mb-4 text-gray-600 dark:text-gray-300">Loading...</p>}

            {!loading && newsletterSends.length === 0 && (
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                    現在、Newsletter Sends はありません。
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse overflow-hidden rounded-lg bg-white text-left shadow-sm dark:bg-grayscale-950">
                    <thead>
                        <tr className="border-b border-grayscale-300 dark:border-grayscale-700">
                            <th className="p-3 font-semibold">ID</th>
                            <th className="p-3 font-semibold">Subscriber ID</th>
                            <th className="p-3 font-semibold">Issue ID</th>
                            <th className="p-3 font-semibold">Sent At</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsletterSends.map((send) => (
                            <tr
                                key={send.id}
                                className="border-b border-grayscale-300 last:border-none dark:border-grayscale-700"
                            >
                                <td className="p-3">{send.id}</td>
                                <td className="p-3">{send.subscriber_id}</td>
                                <td className="p-3">{send.newsletter_issue_id}</td>
                                <td className="p-3">
                                    {send.sent_at
                                        ? new Date(send.sent_at).toLocaleString()
                                        : "未送信"}
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={`/admin/dashboard/newsletter-sends/${send.id}/edit`}
                                            className="cursor-pointer text-light-accent transition-colors duration-200 hover:text-light-hover dark:text-dark-accent dark:hover:text-dark-hover"
                                        >
                                            編集
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(send.id)}
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
