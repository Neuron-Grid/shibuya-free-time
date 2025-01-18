"use client";

import type { Database } from "@/types/supabase/database.types";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

type Tag = Database["public"]["Tables"]["tags"]["Row"];
type TagUpdate = Database["public"]["Tables"]["tags"]["Update"];

export const experimental_ppr = true;

export default function EditTagPage() {
    const router = useRouter();
    const params = useParams();
    const tagId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [createdAt, setCreatedAt] = useState<string | null>(null);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);

    // データ取得
    const fetchTag = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/tags", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch tags");
            }
            const data: Tag[] = await res.json();
            const found = data.find((t) => t.id === tagId);
            if (found) {
                setName(found.name);
                setSlug(found.slug);
                setCreatedAt(found.created_at);
                setUpdatedAt(found.updated_at);
            } else {
                setError("タグが見つかりません。");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [tagId]);

    // 更新
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // バリデーション: 1〜20文字, 空白含まない
        const isValidName = /^[^\s\u3000]{1,20}$/.test(name);
        const isValidSlug = /^[^\s\u3000]{1,20}$/.test(slug);

        if (!isValidName) {
            setError("Nameは1〜20文字、かつ空白を含めないでください。");
            return;
        }
        if (!isValidSlug) {
            setError("Slugは1〜20文字、かつ空白を含めないでください。");
            return;
        }

        setLoading(true);
        try {
            const payload: TagUpdate & { id: string } = {
                id: tagId,
                name,
                slug,
            };
            const res = await fetch("/api/tags", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update tag");
            }
            // 成功時、一覧に戻る
            router.push("/admin/dashboard/tags");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tagId) {
            fetchTag();
        }
    }, [tagId, fetchTag]);

    return (
        <div className="min-h-screen bg-light-background dark:bg-dark-background px-4 py-8 text-light-text dark:text-dark-text">
            <div className="max-w-2xl mx-auto text-grayscale-100 dark:bg-grayscale-900 p-6">
                <h1 className="text-2xl font-bold mb-6">タグ編集</h1>

                {/* エラー表示 */}
                {error && <p className="text-error font-semibold mb-4">{error}</p>}

                {/* ロード中に名前がまだセットされていない場合のみ表示 */}
                {loading && !name && <p>Loading...</p>}

                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* created_at / updated_at 表示 (読み取り専用のinputに) */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="createdAt" className="block font-medium mb-1">
                                Created At
                            </label>
                            <input
                                id="createdAt"
                                type="text"
                                className="w-full p-2 bg-grayscale-100 dark:bg-grayscale-800 rounded text-light-text dark:text-dark-text"
                                value={createdAt ?? "-"}
                                readOnly
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="updatedAt" className="block font-medium mb-1">
                                Updated At
                            </label>
                            <input
                                id="updatedAt"
                                type="text"
                                className="w-full p-2 bg-grayscale-100 dark:bg-grayscale-800 rounded text-light-text dark:text-dark-text"
                                value={updatedAt ?? "-"}
                                readOnly
                            />
                        </div>
                    </div>

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
                            placeholder="1〜20文字、空白禁止"
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
                            placeholder="1〜20文字、空白禁止"
                        />
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
