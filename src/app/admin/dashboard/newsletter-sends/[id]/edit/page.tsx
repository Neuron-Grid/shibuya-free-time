"use client";

import type { Database } from "@/types/supabase/database.types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Row / Update の型を newsletter_sends テーブルに合わせる
type NewsletterSend = Database["public"]["Tables"]["newsletter_sends"]["Row"];
type NewsletterSendUpdate = Database["public"]["Tables"]["newsletter_sends"]["Update"];

export default function EditNewsletterSendPage() {
    const router = useRouter();
    const params = useParams();
    const newsletterSendId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [subscriberId, setSubscriberId] = useState("");
    const [newsletterIssueId, setNewsletterIssueId] = useState("");
    const [sentAt, setSentAt] = useState<string | null>(null);

    // データ取得
    const fetchNewsletterSend = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/newsletter-sends", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch newsletter_sends");
            }
            const data: NewsletterSend[] = await res.json();
            const found = data.find((item) => item.id === newsletterSendId);

            if (found) {
                setSubscriberId(found.subscriber_id);
                setNewsletterIssueId(found.newsletter_issue_id);
                // sent_at が null の場合は空文字に、値があればdatetime-local用に整形
                setSentAt(found.sent_at ? new Date(found.sent_at).toISOString().slice(0, 16) : "");
            } else {
                setError("対象の Newsletter Send が見つかりません。");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [newsletterSendId]);

    // 更新
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload: NewsletterSendUpdate & { id: string } = {
                id: newsletterSendId,
                subscriber_id: subscriberId,
                newsletter_issue_id: newsletterIssueId,
                sent_at: sentAt ? new Date(sentAt).toISOString() : null,
            };

            const res = await fetch("/api/newsletter-sends", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update newsletter_sends record");
            }
            // 成功時、一覧ページへ戻る
            router.push("/admin/dashboard/newsletter-sends");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (newsletterSendId) {
            fetchNewsletterSend();
        }
    }, [newsletterSendId, fetchNewsletterSend]);

    return (
        <div className="container min-h-screen px-4 sm:px-6 md:px-8 py-6 flex items-center justify-center bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="w-full max-w-2xl dark:bg-grayscale-900 rounded shadow p-6">
                <h1 className="text-2xl font-bold mb-6">Newsletter Send 編集</h1>

                {error && <p className="text-error font-semibold mb-4">{error}</p>}

                {loading && !subscriberId && <p>Loading...</p>}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="subscriberId" className="block font-medium mb-1">
                            Subscriber ID
                        </label>
                        <input
                            id="subscriberId"
                            type="text"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={subscriberId}
                            onChange={(e) => setSubscriberId(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="newsletterIssueId" className="block font-medium mb-1">
                            Newsletter Issue ID
                        </label>
                        <input
                            id="newsletterIssueId"
                            type="text"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={newsletterIssueId}
                            onChange={(e) => setNewsletterIssueId(e.target.value)}
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
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={sentAt || ""}
                            onChange={(e) => setSentAt(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            送信日時を変更したい場合はここに入力します。空欄で未送信扱いになります。
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded px-4 py-2 font-semibold bg-light-accent hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover text-grayscale-50 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "更新中..." : "更新"}
                    </button>
                </form>
            </div>
        </div>
    );
}
