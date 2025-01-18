"use client";

import type { Database } from "@/types/supabase/database.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

type NewsletterIssue = Database["public"]["Tables"]["newsletter_issues"]["Row"];

export default function NewsletterIssuesListPage() {
    const router = useRouter();
    const [newsletterIssues, setNewsletterIssues] = useState<NewsletterIssue[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNewsletterIssues = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/newsletter-issues", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch newsletter_issues");
            }
            const data = (await res.json()) as NewsletterIssue[];
            setNewsletterIssues(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDelete = useCallback(
        async (id: string) => {
            if (!confirm("本当に削除しますか？")) return;
            try {
                setLoading(true);
                const url = `/api/newsletter-issues?id=${id}`;
                const res = await fetch(url, { method: "DELETE" });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to delete newsletter_issue");
                }
                fetchNewsletterIssues();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        },
        [fetchNewsletterIssues],
    );

    useEffect(() => {
        fetchNewsletterIssues();
    }, [fetchNewsletterIssues]);

    return (
        <div className="container mx-auto min-h-screen max-w-screen-lg px-4 sm:px-6 md:px-8 py-6 lg:pt-0 lg:pb-6 transition-colors duration-300 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
            <h1 className="mb-6 text-2xl font-extrabold tracking-wide">Newsletter Issues List</h1>
            <Link
                href="/admin/dashboard/newsletter-issues/create"
                className="inline-block rounded bg-light-accent px-4 py-2 text-grayscale-100 transition-colors duration-300 hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover mb-6"
            >
                新規作成
            </Link>
            {error && (
                <div className="mb-4 rounded border-l-4 border-error bg-error/20 p-4 text-error">
                    {error}
                </div>
            )}
            {loading && <p className="mb-4 text-gray-600 dark:text-gray-300">Loading...</p>}
            {!loading && newsletterIssues.length === 0 && (
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                    現在、Newsletter Issue はありません。
                </p>
            )}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse overflow-hidden rounded-lg bg-white text-left shadow-sm dark:bg-grayscale-950">
                    <thead>
                        <tr className="border-b border-grayscale-300 dark:border-grayscale-700">
                            <th className="p-3 font-semibold">ID</th>
                            <th className="p-3 font-semibold">Subject</th>
                            <th className="p-3 font-semibold">Sent At</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsletterIssues.map((issue) => (
                            <tr
                                key={issue.id}
                                className="border-b border-grayscale-300 last:border-none dark:border-grayscale-700"
                            >
                                <td className="p-3">{issue.id}</td>
                                <td className="p-3">{issue.subject}</td>
                                <td className="p-3">
                                    {issue.sent_at
                                        ? new Date(issue.sent_at).toLocaleString()
                                        : "未送信"}
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={`/admin/dashboard/newsletter-issues/${issue.id}/edit`}
                                            className="cursor-pointer text-light-accent transition-colors duration-200 hover:text-light-hover dark:text-dark-accent dark:hover:text-dark-hover"
                                        >
                                            編集
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(issue.id)}
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
