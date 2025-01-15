"use client";

import type { Database } from "@/types/supabase/database.types";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    // データ取得
    const fetchCategory = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/categories", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch categories");
            }
            const data: Category[] = await res.json();
            const found = data.find((cat) => cat.id === categoryId);
            if (found) {
                setName(found.name);
                setSlug(found.slug);
            } else {
                setError("カテゴリーが見つかりません。");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    // 更新
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload: CategoryUpdate & { id: string } = {
                id: categoryId,
                name,
                slug,
            };
            const res = await fetch("/api/categories", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update category");
            }
            // 成功時、一覧に戻る
            router.push("/admin/dashboard/categories");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryId) {
            fetchCategory();
        }
    }, [categoryId, fetchCategory]);

    return (
        // 画面全体をライトモード/ダークモードの背景に
        <div className="min-h-screen bg-light-background dark:bg-dark-background px-4 py-8 text-light-text dark:text-dark-text">
            <div className="max-w-2xl mx-auto bg-white dark:bg-grayscale-900 rounded shadow p-6">
                <h1 className="text-2xl font-bold mb-6">カテゴリー編集</h1>

                {/* エラー表示 */}
                {error && <p className="text-error font-semibold mb-4">{error}</p>}

                {/* ロード中に名前がまだセットされていない場合のみ表示 */}
                {loading && !name && <p>Loading...</p>}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block font-medium mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="slug" className="block font-medium mb-1">
                            Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={
                            "rounded px-4 py-2 font-semibold bg-light-accent hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover  text-white disabled:opacity-50 transition-colors"
                        }
                    >
                        {loading ? "更新中..." : "更新"}
                    </button>
                </form>
            </div>
        </div>
    );
}
