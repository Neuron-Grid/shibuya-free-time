"use client";

import type { Database } from "@/types/supabase/database.types";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

// Row/Update は newsletter_issues テーブルに合わせる
type NewsletterIssue = Database["public"]["Tables"]["newsletter_issues"]["Row"];
type NewsletterIssueUpdate = Database["public"]["Tables"]["newsletter_issues"]["Update"];

export default function EditNewsletterIssuePage() {
    const router = useRouter();
    const params = useParams();
    const newsletterIssueId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [sentAt, setSentAt] = useState<string | null>(null);

    // データ取得
    const fetchNewsletterIssue = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/newsletter-issues", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch newsletter_issues");
            }
            const data: NewsletterIssue[] = await res.json();
            const found = data.find((issue) => issue.id === newsletterIssueId);

            if (found) {
                setSubject(found.subject);
                setContent(found.content);
                // sent_at が null の場合は空文字に、値があればそれを datetime-local 用に整形
                setSentAt(found.sent_at ? new Date(found.sent_at).toISOString().slice(0, 16) : "");
            } else {
                setError("Newsletter Issue が見つかりません。");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [newsletterIssueId]);

    // 更新
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Supabase 上の Update では該当の id をキーに更新する
            const payload: NewsletterIssueUpdate & { id: string } = {
                id: newsletterIssueId,
                subject,
                content,
                sent_at: sentAt ? new Date(sentAt).toISOString() : null,
            };

            const res = await fetch("/api/newsletter-issues", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update newsletter_issue");
            }
            // 成功時、一覧に戻る
            router.push("/admin/dashboard/newsletter-issues");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (newsletterIssueId) {
            fetchNewsletterIssue();
        }
    }, [newsletterIssueId, fetchNewsletterIssue]);

    return (
        // レスポンシブ余白 + ダーク/ライト切り替え
        <div className="container min-h-screen px-4 sm:px-6 md:px-8 py-6 flex items-center justify-center bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            {/* カード部分 */}
            <div className="w-full max-w-2xl dark:bg-grayscale-900 rounded shadow p-6">
                <h1 className="text-2xl font-bold mb-6">Newsletter Issue 編集</h1>

                {/* エラー表示 */}
                {error && <p className="text-error font-semibold mb-4">{error}</p>}

                {/* ロード中・かつsubjectがまだセットされていない時のみ表示 */}
                {loading && !subject && <p>Loading...</p>}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="subject" className="block font-medium mb-1">
                            Subject
                        </label>
                        <input
                            id="subject"
                            type="text"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block font-medium mb-1">
                            Content
                        </label>
                        <textarea
                            id="content"
                            rows={5}
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="sentAt" className="block font-medium mb-1">
                            Sent At (オプション)
                        </label>
                        <input
                            id="sentAt"
                            type="datetime-local"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={sentAt ?? ""}
                            onChange={(e) => setSentAt(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            送信日時を変更したい場合はここに入力します。空欄で未送信扱いになります。
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
