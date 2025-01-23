"use client";

import type { Database } from "@/types/supabase/database.types";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type TemporarySpot = Database["public"]["Tables"]["temporary_spots"]["Row"];
type TemporarySpotUpdate = Database["public"]["Tables"]["temporary_spots"]["Update"];
type SpotStatus = Database["public"]["Enums"]["spot_status"];

// photoテーブルの型
type Photo = Database["public"]["Tables"]["photo"]["Row"];

export const experimental_ppr = true;

export default function EditTemporarySpotPage() {
    const router = useRouter();
    const params = useParams();
    const spotId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 既存スポット用ステート
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<SpotStatus>("draft");

    // 写真一覧
    const [photos, setPhotos] = useState<Photo[]>([]);
    // 選択中の写真ID
    const [selectedPhotoId, setSelectedPhotoId] = useState("");

    // スポット情報取得
    const fetchSpot = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/temporary-spots");
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch temporary spots");
            }
            const data: TemporarySpot[] = await res.json();

            const found = data.find((spot) => spot.id === spotId);
            if (!found) {
                setError("期間限定の記事が見つかりません。");
            } else {
                setTitle(found.title);
                setSlug(found.slug);
                setStartDate(found.start_date);
                setEndDate(found.end_date);
                setDescription(found.description);
                setStatus(found.status);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [spotId]);

    // 写真一覧取得
    const fetchPhotos = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/photo");
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch photos");
            }
            const data: Photo[] = await res.json();
            setPhotos(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    // スポット情報更新
    const handleUpdateSpot = async (e: React.FormEvent<HTMLFormElement>) => {
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
                status,
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
            router.push("/admin/dashboard/temporary-spots");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // 写真をスポットに紐づけ
    const handleAssignPhoto = async () => {
        if (!selectedPhotoId) {
            alert("紐づけたい写真を選択してください。");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/photo", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedPhotoId,
                    temporary_spot_id: spotId,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "写真の紐づけに失敗しました");
            }

            alert("写真を紐づけました！");
            // 紐づけ後、再度写真一覧を再取得して画面を更新
            fetchPhotos();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // 初回マウント時にスポット情報＆写真一覧を取得
    useEffect(() => {
        if (spotId) {
            fetchSpot();
            fetchPhotos();
        }
    }, [spotId, fetchSpot, fetchPhotos]);

    if (error) {
        return (
            <div className="p-4 text-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 pt-0 pb-8 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
            <div className="max-w-2xl lg:max-w-4xl mx-auto p-6 mt-0">
                <h1 className="text-2xl font-bold mb-6">期間限定の記事編集</h1>

                {loading && !title && <p>Loading...</p>}

                {/* スポット編集フォーム */}
                <form onSubmit={handleUpdateSpot} className="space-y-6 mb-8">
                    <div>
                        <label htmlFor="title" className="block font-medium mb-1">
                            記事のタイトル
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="w-full rounded border border-grayscale-300 p-2 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text"
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
                            className="w-full rounded border border-grayscale-300 p-2 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text"
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
                            className="w-full rounded border border-grayscale-300 p-2 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text"
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
                            className="w-full rounded border border-grayscale-300 p-2 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block font-medium mb-1">
                            記事の内容
                        </label>
                        {/* 大画面時に高さアップ */}
                        <textarea
                            id="description"
                            className="w-full rounded border border-grayscale-300 p-2 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text lg:h-64"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block font-medium mb-1">
                            ステータス
                        </label>
                        <select
                            id="status"
                            className="w-full rounded border border-grayscale-300 p-2 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as SpotStatus)}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="deleted">Deleted</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded px-4 py-2 font-semibold bg-light-accent text-grayscale-50 hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover disabled:opacity-50"
                    >
                        {loading ? "更新中..." : "更新"}
                    </button>
                </form>

                <hr className="my-4 border-grayscale-300" />

                {/* 写真との紐づけUI */}
                <h2 className="text-xl font-bold mb-4">写真を紐づける</h2>
                <div className="flex items-center space-x-2 mb-4">
                    <select
                        className="border border-grayscale-300 p-2 rounded bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text"
                        value={selectedPhotoId}
                        onChange={(e) => setSelectedPhotoId(e.target.value)}
                    >
                        <option value="">-- 写真を選択 --</option>
                        {photos.map((photo) => (
                            <option key={photo.id} value={photo.id}>
                                {photo.file_path ?? photo.id}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleAssignPhoto}
                        className="rounded px-4 py-2 font-semibold bg-light-accent text-grayscale-50 hover:bg-light-hover dark:bg-dark-accent dark:hover:bg-dark-hover"
                    >
                        紐づけ
                    </button>
                </div>

                <p className="text-grayscale-500 mb-2">
                    すでにアップロードされた写真を選択し、このスポットに関連付けます。
                </p>

                {/* 紐づいた写真一覧 */}
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">
                        紐づいている写真一覧 (temporary_spot_id = {spotId})
                    </h3>
                    <ul className="list-disc list-inside">
                        {photos
                            .filter((p) => p.temporary_spot_id === spotId)
                            .map((p) => (
                                <li key={p.id}>
                                    <a
                                        href={p.public_url || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-light-accent dark:text-dark-accent underline"
                                    >
                                        {p.file_path}
                                    </a>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
