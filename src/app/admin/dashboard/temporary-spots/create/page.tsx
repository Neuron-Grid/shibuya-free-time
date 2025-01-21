"use client";

import type { Database } from "@/types/supabase/database.types";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

// "temporary_spots"テーブルの挿入型
type TemporarySpotInsert = Database["public"]["Tables"]["temporary_spots"]["Insert"];
// ENUM spot_status
type SpotStatus = Database["public"]["Enums"]["spot_status"];
// "categories"テーブルのRow型
type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function CreateTemporarySpotPage() {
    const router = useRouter();

    // 入力フォームのステート
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<SpotStatus>("draft");
    // カテゴリ選択用のステート
    const [categoryId, setCategoryId] = useState<string>("");
    // カテゴリ一覧を保存するステート
    const [categories, setCategories] = useState<Category[]>([]);
    // エラー・ローディング
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 初回マウント時に /api/categories から一覧を取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/categories", { method: "GET" });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "カテゴリ一覧の取得に失敗しました。");
                }
                const data: Category[] = await res.json();
                setCategories(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // 新規作成処理
    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // カテゴリが未選択の場合のバリデーション例
            if (!categoryId) {
                throw new Error("カテゴリが選択されていません。");
            }

            // Supabaseに送るpayload
            const payload: TemporarySpotInsert = {
                title,
                slug,
                start_date: startDate,
                end_date: endDate,
                description,
                address_lat: 0,
                address_lng: 0,
                category_id: categoryId, // ユーザーが選択したカテゴリID
                status,
            };

            const res = await fetch("/api/temporary-spots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "新規作成に失敗しました。");
            }

            // 成功時、一覧画面に遷移
            router.push("/admin/dashboard/temporary-spots");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-screen px-4 sm:px-6 md:px-8 pt-0 flex items-start justify-center">
            <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-4xl p-6 bg-light-background dark:bg-dark-background rounded-md shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
                    期間限定の記事新規作成
                </h1>

                {/* エラーメッセージ */}
                {error && <p className="text-error mb-4 text-sm font-semibold">{error}</p>}

                {/* ローディング表示 */}
                {loading && <p className="mb-4 text-gray-700 dark:text-gray-300">読み込み中...</p>}

                <form onSubmit={handleCreate} className="space-y-5 md:space-y-6">
                    {/* 記事のタイトル */}
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
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="例) 期間限定カフェ"
                            required
                        />
                    </div>

                    {/* Slug */}
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
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="例) limited-cafe"
                            required
                        />
                    </div>

                    {/* 開始日 */}
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
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* 終了日 */}
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
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* 記事の内容 */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            記事の内容
                        </label>
                        <textarea
                            id="description"
                            rows={5}
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text h-32 md:h-40 lg:h-80 xl:h-96"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="説明を入力してください"
                        />
                    </div>

                    {/* ステータス */}
                    <div>
                        <label
                            htmlFor="status"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            ステータス
                        </label>
                        <select
                            id="status"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as SpotStatus)}
                        >
                            <option value="draft">下書き</option>
                            <option value="published">公開</option>
                        </select>
                    </div>

                    {/* カテゴリ選択 */}
                    <div>
                        <label
                            htmlFor="category"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            カテゴリ
                        </label>
                        <select
                            id="category"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">-- 選択してください --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 送信ボタン */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center rounded bg-light-accent dark:bg-dark-accent text-grayscale-50 px-4 py-2 hover:bg-light-hover dark:hover:bg-dark-hover disabled:opacity-50 transition"
                    >
                        {loading ? "保存中..." : "新規作成"}
                    </button>
                </form>
            </div>
        </div>
    );
}
