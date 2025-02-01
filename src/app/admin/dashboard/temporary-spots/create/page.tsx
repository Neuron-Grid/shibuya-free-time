"use client";

import type { Database } from "@/types/supabase/database.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// temporary_spotsテーブルのInsert用型
type TemporarySpotInsert = Database["public"]["Tables"]["temporary_spots"]["Insert"];
type SpotStatus = Database["public"]["Enums"]["spot_status"];

// photoテーブルのRow型
type Photo = Database["public"]["Tables"]["photo"]["Row"];

// categoriesテーブルのRow型
type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function CreateTemporarySpotPage() {
    const router = useRouter();

    // [1] temporary_spots入力フォーム用ステート
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<SpotStatus>("draft");

    // [2] 既存の写真一覧 + 選択中の写真ID
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhotoId, setSelectedPhotoId] = useState<string>("");

    // [3] カテゴリー一覧 + 選択中のカテゴリーID
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    // [4] ローディング・エラー表示
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 写真一覧を取得
    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/photo", { method: "GET" });
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
        };
        fetchPhotos();
    }, []);

    // カテゴリー一覧を取得
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/categories", { method: "GET" });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to fetch categories");
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

    // 新規作成 + 写真紐付け
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. temporary_spotsの新規作成
            const spotPayload: TemporarySpotInsert = {
                title,
                slug,
                start_date: startDate,
                end_date: endDate,
                description,
                address_lat: 0,
                address_lng: 0,
                status,
                category_id: selectedCategoryId,
            };

            const resSpot = await fetch("/api/temporary-spots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(spotPayload),
            });
            if (!resSpot.ok) {
                const data = await resSpot.json();
                throw new Error(data.error || "スポットの作成に失敗しました。");
            }
            const createdSpot = (await resSpot.json()) as {
                id: string;
                title: string;
            };

            // 2. 写真を紐付け
            // selectedPhotoId が選択されている場合
            if (selectedPhotoId) {
                const patchRes = await fetch("/api/photo", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: selectedPhotoId,
                        temporary_spot_id: createdSpot.id,
                    }),
                });
                if (!patchRes.ok) {
                    const patchErrData = await patchRes.json();
                    throw new Error(patchErrData.error || "写真の紐付けに失敗しました。");
                }
            }

            // 3. 成功したら一覧へ遷移
            alert("新規記事を作成に成功しました。");
            router.push("/admin/dashboard/temporary-spots");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="min-h-screen flex flex-col items-start pt-4 lg:pt-8 px-4 md:px-8 lg:px-16">
                <h1 className="text-xl font-bold mb-4">期間限定の記事新規作成</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {loading && <p className="mb-4">処理中...</p>}

                <form onSubmit={handleCreate} className="space-y-4 w-full">
                    {/* タイトル */}
                    <div>
                        <label htmlFor="title" className="block mb-1 font-medium">
                            記事のタイトル
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="border rounded p-2 w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* slug */}
                    <div>
                        <label htmlFor="slug" className="block mb-1 font-medium">
                            Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            className="border rounded p-2 w-full"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />
                    </div>

                    {/* startDate */}
                    <div>
                        <label htmlFor="startDate" className="block mb-1 font-medium">
                            開始日
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            className="border rounded p-2 w-full"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    {/* endDate */}
                    <div>
                        <label htmlFor="endDate" className="block mb-1 font-medium">
                            終了日
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            className="border rounded p-2 w-full"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    {/* description */}
                    <div>
                        <label htmlFor="description" className="block mb-1 font-medium">
                            記事の内容
                        </label>
                        <textarea
                            id="description"
                            className="border rounded p-2 w-full h-40 md:h-60 lg:h-80"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* status */}
                    <div>
                        <label htmlFor="status" className="block mb-1 font-medium">
                            ステータス
                        </label>
                        <select
                            id="status"
                            className="border rounded p-2 w-full"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as SpotStatus)}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="deleted">Deleted</option>
                        </select>
                    </div>

                    {/* category */}
                    <div>
                        <label htmlFor="categorySelect" className="block mb-1 font-medium">
                            カテゴリー
                        </label>
                        <select
                            id="categorySelect"
                            className="border rounded p-2 w-full"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                        >
                            <option value="">-- カテゴリーを選択 --</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <hr className="my-2 w-full" />

                    {/* 既存の写真を選択 */}
                    <div>
                        <label htmlFor="photoSelect" className="block mb-1 font-medium">
                            既存の写真を紐づける (任意)
                        </label>
                        <select
                            id="photoSelect"
                            className="border rounded p-2 w-full"
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
                    </div>

                    {/* 送信ボタン */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                    >
                        {loading ? "作成中..." : "新規作成"}
                    </button>
                </form>
            </div>
        </div>
    );
}
