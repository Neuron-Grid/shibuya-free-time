"use client";

import DateDisplay from "@/components/partials/DateDisplay";
import type { Database } from "@/types/supabase/database.types";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

// Supabaseの型から Tag Rowを取得
type Tag = Database["public"]["Tables"]["tags"]["Row"];

export default function TagsListPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 一覧取得
    const fetchTags = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/tags", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch tags");
            }
            const data: Tag[] = await res.json();
            setTags(data);
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
                const url = `/api/tags?id=${id}`;
                const res = await fetch(url, { method: "DELETE" });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to delete tag");
                }
                // 成功したら再取得
                fetchTags();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        },
        [fetchTags],
    );

    // 初回マウント時にfetchTagsを呼ぶ
    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    return (
        <div className="container min-h-screen px-4 py-6 transition-colors duration-300">
            <h1 className="mb-6 text-2xl font-extrabold tracking-wide">Tags List</h1>

            {/* 新規作成画面へ */}
            <Link
                href="/admin/dashboard/tags/create"
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

            {!loading && tags.length === 0 && (
                <p className="mb-4 text-gray-600 dark:text-gray-300">現在、タグはありません。</p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse overflow-hidden rounded-lg text-left shadow-sm dark:bg-grayscale-950">
                    <thead>
                        <tr className="border-b border-grayscale-300 dark:border-grayscale-700">
                            <th className="p-3 font-semibold">ID</th>
                            <th className="p-3 font-semibold">Name</th>
                            <th className="p-3 font-semibold">Slug</th>
                            <th className="p-3 font-semibold">Created At</th>
                            <th className="p-3 font-semibold">Updated At</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tags.map((tag) => (
                            <tr
                                key={tag.id}
                                className="border-b border-grayscale-300 last:border-none dark:border-grayscale-700"
                            >
                                <td className="p-3">{tag.id}</td>
                                <td className="p-3">{tag.name}</td>
                                <td className="p-3">{tag.slug}</td>
                                <td className="p-3">
                                    <DateDisplay dateString={tag.created_at} />
                                </td>
                                <td className="p-3">
                                    <DateDisplay dateString={tag.updated_at} />
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={`/admin/dashboard/tags/${tag.id}/edit`}
                                            className="cursor-pointer text-light-accent transition-colors duration-200 hover:text-light-hover dark:text-dark-accent dark:hover:text-dark-hover"
                                        >
                                            編集
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(tag.id)}
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
