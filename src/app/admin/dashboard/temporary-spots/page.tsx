"use client";

import type { Database } from "@/types/supabase/database.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

// Supabaseの型から TemporarySpot Rowを取得
type TemporarySpot = Database["public"]["Tables"]["temporary_spots"]["Row"];

export default function TemporarySpotsListPage() {
    const router = useRouter();
    const [temporarySpots, setTemporarySpots] = useState<TemporarySpot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 一覧取得
    const fetchTemporarySpots = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/temporary-spots", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch temporary spots");
            }
            const data = await res.json();
            setTemporarySpots(data);
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
                const url = `/api/temporary-spots?id=${id}`;
                const res = await fetch(url, { method: "DELETE" });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to delete temporary spot");
                }
                // 成功したら再取得
                fetchTemporarySpots();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        },
        [fetchTemporarySpots],
    );

    // 初回マウント時にfetchTemporarySpotsを呼ぶ
    useEffect(() => {
        fetchTemporarySpots();
    }, [fetchTemporarySpots]);

    return (
        <div className="container min-h-screen px-4 py-6 transition-colors duration-300 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
            <h1 className="mb-6 text-2xl font-extrabold tracking-wide">TemporarySpots List</h1>

            {/* 新規作成画面へ */}
            <Link
                href="/admin/dashboard/temporary-spots/create"
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

            {!loading && temporarySpots.length === 0 && (
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                    現在、期間限定の記事はありません。
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse overflow-hidden rounded-lg bg-white text-left shadow-sm dark:bg-grayscale-950">
                    <thead>
                        <tr className="border-b border-grayscale-300 dark:border-grayscale-700">
                            <th className="p-3 font-semibold">ID</th>
                            <th className="p-3 font-semibold">記事のタイトル</th>
                            <th className="p-3 font-semibold">Slug</th>
                            <th className="p-3 font-semibold">開始日</th>
                            <th className="p-3 font-semibold">終了日</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {temporarySpots.map((spot) => (
                            <tr
                                key={spot.id}
                                className="border-b border-grayscale-300 last:border-none dark:border-grayscale-700"
                            >
                                <td className="p-3">{spot.id}</td>
                                <td className="p-3">{spot.title}</td>
                                <td className="p-3">{spot.slug}</td>
                                <td className="p-3">{spot.start_date}</td>
                                <td className="p-3">{spot.end_date}</td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={`/admin/dashboard/temporary-spots/${spot.id}/edit`}
                                            className="cursor-pointer text-light-accent transition-colors duration-200 hover:text-light-hover dark:text-dark-accent dark:hover:text-dark-hover"
                                        >
                                            編集
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(spot.id)}
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
