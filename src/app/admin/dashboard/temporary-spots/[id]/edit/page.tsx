"use client";

import type { Database } from "@/types/supabase/database.types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type TemporarySpot = Database["public"]["Tables"]["temporary_spots"]["Row"];
type TemporarySpotUpdate = Database["public"]["Tables"]["temporary_spots"]["Update"];

export const experimental_ppr = true;

export default function EditTemporarySpotPage() {
    const router = useRouter();
    const params = useParams();
    const spotId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");

    const fetchSpot = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/temporary-spots", { method: "GET" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch temporary spots");
            }
            const data: TemporarySpot[] = await res.json();
            const found = data.find((spot) => spot.id === spotId);
            if (found) {
                setTitle(found.title);
                setSlug(found.slug);
                setStartDate(found.start_date);
                setEndDate(found.end_date);
                setDescription(found.description);
            } else {
                setError("期間限定の記事が見つかりません。");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [spotId]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload: TemporarySpotUpdate & { id: string } = {
                id: spotId,
                title,
                slug,
                start_date: startDate,
                end_date: endDate,
                description,
            };
            const res = await fetch("/api/temporary-spots", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update temporary spot");
            }
            // 成功時、一覧に戻る
            router.push("/admin/dashboard/temporary-spots");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (spotId) {
            fetchSpot();
        }
    }, [spotId, fetchSpot]);

    return (
        <div className="min-h-screen bg-light-background dark:bg-dark-background px-4 py-8 text-light-text dark:text-dark-text md:pt-6 lg:pt-8">
            <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto bg-white dark:bg-grayscale-900 rounded shadow p-6 mt-0">
                <h1 className="text-2xl font-bold mb-6">期間限定の記事編集</h1>

                {error && <p className="text-error font-semibold mb-4">{error}</p>}
                {loading && !title && <p>Loading...</p>}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block font-medium mb-1">
                            記事のタイトル
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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

                    <div>
                        <label htmlFor="startDate" className="block font-medium mb-1">
                            開始日
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="endDate" className="block font-medium mb-1">
                            終了日
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block font-medium mb-1">
                            記事の内容
                        </label>
                        <textarea
                            id="description"
                            className="w-full rounded border border-grayscale-300 dark:border-grayscale-600 p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:outline-none focus:ring focus:ring-light-accent dark:focus:ring-dark-accent md:h-60 lg:h-80"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
