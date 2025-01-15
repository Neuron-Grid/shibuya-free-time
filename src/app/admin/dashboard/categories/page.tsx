"use client";

import type { Database } from "@/types/supabase/database.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

// Supabaseの型から Category Rowを取得
type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function CategoriesListPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 一覧取得
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/categories", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch categories");
            }
            const data = await res.json();
            setCategories(data);
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
                const url = `/api/categories?id=${id}`;
                const res = await fetch(url, { method: "DELETE" });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to delete category");
                }
                // 成功したら再取得
                fetchCategories();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        },
        [fetchCategories],
    );

    // 初回マウント時にfetchCategoriesを呼ぶ
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="container min-h-screen px-4 py-6 transition-colors duration-300 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
            <h1 className="mb-6 text-2xl font-extrabold tracking-wide">Categories List</h1>

            {/* 新規作成画面へ */}
            <Link
                href="/admin/dashboard/categories/create"
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

            {!loading && categories.length === 0 && (
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                    現在、カテゴリーはありません。
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse overflow-hidden rounded-lg bg-white text-left shadow-sm dark:bg-grayscale-950">
                    <thead>
                        <tr className="border-b border-grayscale-300 dark:border-grayscale-700">
                            <th className="p-3 font-semibold">ID</th>
                            <th className="p-3 font-semibold">Name</th>
                            <th className="p-3 font-semibold">Slug</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr
                                key={cat.id}
                                className="border-b border-grayscale-300 last:border-none dark:border-grayscale-700"
                            >
                                <td className="p-3">{cat.id}</td>
                                <td className="p-3">{cat.name}</td>
                                <td className="p-3">{cat.slug}</td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={`/admin/dashboard/categories/${cat.id}/edit`}
                                            className="cursor-pointer text-light-accent transition-colors duration-200 hover:text-light-hover dark:text-dark-accent dark:hover:text-dark-hover"
                                        >
                                            編集
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(cat.id)}
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
