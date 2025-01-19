"use client";

import type { Database } from "@/types/supabase/database.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type NewsletterSendInsert = Database["public"]["Tables"]["newsletter_sends"]["Insert"];

export default function CreateNewsletterSendPage() {
    const router = useRouter();
    const [subscriberId, setSubscriberId] = useState("");
    const [newsletterIssueId, setNewsletterIssueId] = useState("");
    const [sentAt, setSentAt] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 新規作成
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload: NewsletterSendInsert = {
                subscriber_id: subscriberId,
                newsletter_issue_id: newsletterIssueId,
                sent_at: sentAt ? new Date(sentAt).toISOString() : null,
            };

            const res = await fetch("/api/newsletter-sends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create newsletter_sends record");
            }
            // 成功時、一覧ページへ遷移
            router.push("/admin/dashboard/newsletter-sends");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-screen px-4 sm:px-6 md:px-8 pt-6 flex items-start justify-center bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-4xl p-6">
                <h1 className="text-2xl font-bold mb-6">Newsletter Send 新規作成</h1>
                {error && (
                    <div className="mb-4 rounded border-l-4 border-error bg-error/20 p-4 text-error">
                        {error}
                    </div>
                )}
                <form onSubmit={handleCreate} className="space-y-5 md:space-y-6">
                    <div>
                        <label htmlFor="subscriberId" className="block mb-2 font-medium">
                            Subscriber ID
                        </label>
                        <input
                            id="subscriberId"
                            type="text"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={subscriberId}
                            onChange={(e) => setSubscriberId(e.target.value)}
                            placeholder="例) subscriber_12345"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="newsletterIssueId" className="block mb-2 font-medium">
                            Newsletter Issue ID
                        </label>
                        <input
                            id="newsletterIssueId"
                            type="text"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={newsletterIssueId}
                            onChange={(e) => setNewsletterIssueId(e.target.value)}
                            placeholder="例) issue_67890"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="sentAt" className="block mb-2 font-medium">
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
                            送信日時を設定できます。未定なら空欄でOK。
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
