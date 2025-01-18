"use client";

import type { Database } from "@/types/supabase/database.types";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

// newsletter_issues テーブルの Insert 型
type NewsletterIssueInsert = Database["public"]["Tables"]["newsletter_issues"]["Insert"];

export default function CreateNewsletterIssuePage() {
    const router = useRouter();
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [sentAt, setSentAt] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 新規作成
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload: NewsletterIssueInsert = {
                subject,
                content,
                sent_at: sentAt ? new Date(sentAt).toISOString() : null,
            };

            const res = await fetch("/api/newsletter-issues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create newsletter_issue");
            }
            router.push("/admin/dashboard/newsletter-issues");
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
                    Newsletter Issue 新規作成
                </h1>
                <p className="text-error mb-4 text-sm font-semibold">{error}</p>
                <form onSubmit={handleCreate} className="space-y-5 md:space-y-6">
                    <div>
                        <label
                            htmlFor="subject"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            Subject
                        </label>
                        <input
                            id="subject"
                            type="text"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="例) 今月の渋谷イベント情報"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="content"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            本文
                        </label>
                        <textarea
                            id="content"
                            rows={5}
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent h-32 md:h-40 lg:h-80 xl:h-96"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="例) ここにNewsletterの本文を入力します。"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="sentAt"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            Sent At (オプション)
                        </label>
                        <input
                            id="sentAt"
                            type="datetime-local"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={sentAt || ""}
                            onChange={(e) => setSentAt(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            送信予定日時または送信済み日時を設定できます。（未定なら空欄でOK）
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
