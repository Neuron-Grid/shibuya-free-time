/// 動作未確認

"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PhotoEditPage() {
    const router = useRouter();
    const params = useParams();
    const [photo, setPhoto] = useState<PhotoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const id = params?.id as string;

    // 初回に既存データを取得
    useEffect(() => {
        if (!id) {
            setError("IDが指定されていません。");
            setLoading(false);
            return;
        }
        fetch("/api/photo")
            .then((res) => res.json())
            .then((data) => {
                // GET /api/photo は全件返す仕様
                // ここでは全データから id が一致するものを検索
                const found = data.find((p: PhotoData) => p.id === id);
                if (!found) {
                    setError("該当データが見つかりませんでした。");
                } else {
                    setPhoto(found);
                }
            })
            .catch((err) => {
                console.error(err);
                setError("写真情報の取得に失敗しました。");
            })
            .finally(() => setLoading(false));
    }, [id]);

    // 更新
    async function handleUpdate() {
        if (!photo) return;
        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/photo", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: photo.id,
                    name: photo.file_path, // route.ts の "name" → file_path へマッピング
                    url: photo.public_url, // route.ts の "url"  → public_url へマッピング
                    file_hash: photo.file_hash,
                    temporary_spot_id: photo.temporary_spot_id,
                }),
            });
            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Update failed");
            }
            alert("更新しました。");
            router.push("/admin/dashboard/photo");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("エラーが発生しました");
            }
        } finally {
            setSaving(false);
        }
    }

    // 削除
    async function handleDelete() {
        if (!photo) return;
        if (!confirm("本当に削除しますか？")) return;

        try {
            const deleteUrl = `/api/photo?id=${photo.id}`;
            const res = await fetch(deleteUrl, { method: "DELETE" });
            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Delete failed");
            }
            alert("削除しました。");
            router.push("/admin/dashboard/photo");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("エラーが発生しました");
            }
        }
    }

    if (loading) {
        return <div className="p-4">読み込み中...</div>;
    }
    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }
    if (!photo) {
        return <div className="p-4">データがありません。</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">写真情報の編集</h1>
            <div className="mb-4">
                <label htmlFor="file_path" className="block mb-1">
                    ファイルパス (file_path)
                </label>
                <input
                    id="file_path"
                    type="text"
                    value={photo.file_path ?? ""}
                    onChange={(e) => setPhoto({ ...photo, file_path: e.target.value })}
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="public_url" className="block mb-1">
                    公開URL (public_url)
                </label>
                <input
                    id="public_url"
                    type="text"
                    value={photo.public_url ?? ""}
                    onChange={(e) => setPhoto({ ...photo, public_url: e.target.value })}
                    className="border rounded p-2 w-full"
                />
            </div>

            {/* 必要なら他のフィールド編集欄も追加 */}
            <div className="mb-4">
                <label htmlFor="file_hash" className="block mb-1">
                    file_hash
                </label>
                <input
                    id="file_hash"
                    type="text"
                    value={photo.file_hash ?? ""}
                    onChange={(e) => setPhoto({ ...photo, file_hash: e.target.value })}
                    className="border rounded p-2 w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="temporary_spot_id" className="block mb-1">
                    temporary_spot_id
                </label>
                <input
                    id="temporary_spot_id"
                    type="text"
                    value={photo.temporary_spot_id ?? ""}
                    onChange={(e) => setPhoto({ ...photo, temporary_spot_id: e.target.value })}
                    className="border rounded p-2 w-full"
                />
            </div>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
                {saving ? "更新中..." : "更新"}
            </button>

            <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
                削除
            </button>
        </div>
    );
}

type PhotoData = {
    id: string;
    file_path: string | null;
    public_url: string | null;
    file_hash: string | null;
    temporary_spot_id: string | null;
};
