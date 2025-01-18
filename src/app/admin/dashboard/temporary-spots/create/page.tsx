"use client";

import type { Database } from "@/types/supabase/database.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TemporarySpotInsert = Database["public"]["Tables"]["temporary_spots"]["Insert"];

export default function CreateTemporarySpotPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 新規作成
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload: TemporarySpotInsert = {
                title,
                slug,
                start_date: startDate,
                end_date: endDate,
                description,
                // 以下は必須に応じて設定する（例: 数値デフォルトなど）
                address_lat: 0,
                address_lng: 0,
                category_id: "some-category-id", // 必要に応じてcategory_idを設定
            };
            const res = await fetch("/api/temporary-spots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create temporary spot");
            }
            // 成功時、一覧に戻る
            router.push("/admin/dashboard/temporary-spots");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        // 画面全体の背景をライト/ダークで切り替え
        <div className="min-h-screen bg-light-background dark:bg-dark-background flex items-center justify-center p-4">
            {/* コンテンツを中央に寄せるためのコンテナ */}
            <div className="w-full max-w-md dark:bg-grayscale-900 rounded-md shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
                    期間限定の記事新規作成
                </h1>

                {error && <p className="text-error mb-4 text-sm font-semibold">{error}</p>}

                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label
                            htmlFor="title"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            記事のタイトル
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 bg-light-background dark:bg-dark-background  text-light-text dark:text-dark-text p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="例) 期間限定カフェ"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="slug"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-2  focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="例) limited-cafe"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="startDate"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            開始日
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-2  focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="endDate"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            終了日
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-2  focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            記事の内容
                        </label>
                        <textarea
                            id="description"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-2  focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="説明を入力してください"
                        />
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
