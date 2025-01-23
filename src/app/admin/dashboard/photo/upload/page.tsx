/// ファイルアップロード時にエラーが発生します。

"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import sha256 from "sha256";

export default function PhotoUploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    }

    async function handleUpload() {
        try {
            if (!file) {
                setError("ファイルが選択されていません。");
                return;
            }
            setError("");
            setUploading(true);

            // SHA-256 ハッシュを計算
            const arrayBuffer = await file.arrayBuffer();
            const byteArray = Array.from(new Uint8Array(arrayBuffer));
            const fileHash = sha256(byteArray);

            // multipart/form-data を作成
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", fileName);
            formData.append("temporary_spot_id", "some-temp-spot-id");
            formData.append("file_hash", fileHash);

            const res = await fetch("/api/photo", {
                method: "POST",
                body: formData,
            });

            // 返却ステータスがOKでなければエラーを受け取る
            if (!res.ok) {
                const data = await res.json(); // サーバーから返却された JSON
                // ここでログを取る
                console.log("Server response (entire JSON):", data);
                // エラーメッセージを画面に表示できる形に加工
                const errorMessage =
                    typeof data?.error === "string"
                        ? data.error
                        : JSON.stringify(data.error ?? data);
                throw new Error(errorMessage || "Upload failed");
            }

            alert("アップロード成功");
            router.push("/admin/dashboard/photo");
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message || "アップロードに失敗しました");
            } else {
                setError("アップロードに失敗しました");
            }
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">画像アップロード</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="mb-4">
                <label htmlFor="fileUpload" className="block mb-1 font-medium">
                    ファイルを選択
                </label>
                <input id="fileUpload" type="file" onChange={handleFileChange} />
            </div>
            <div className="mb-4">
                <label htmlFor="fileNameInput" className="block mb-1 font-medium">
                    ファイル名
                </label>
                <input
                    id="fileNameInput"
                    type="text"
                    className="border rounded p-2 w-full"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                />
            </div>
            <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
                {uploading ? "アップロード中..." : "アップロード"}
            </button>
        </div>
    );
}
