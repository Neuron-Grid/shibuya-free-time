"use client";

import type { Database } from "@/types/supabase/database.types";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];

export default function CreateCategoryPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 新規作成
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload: CategoryInsert = {
                name,
                slug,
            };
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create category");
            }
            // 成功時、一覧に戻る
            router.push("/admin/dashboard/categories");
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
                    カテゴリー新規作成
                </h1>

                {error && <p className="text-error mb-4 text-sm font-semibold">{error}</p>}

                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 font-medium text-light-text dark:text-dark-text"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="block w-full rounded border border-grayscale-300 dark:border-grayscale-700 bg-light-background dark:bg-dark-background  text-light-text dark:text-dark-text p-2 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="例) カフェ"
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
                            placeholder="例) cafe"
                            required
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
