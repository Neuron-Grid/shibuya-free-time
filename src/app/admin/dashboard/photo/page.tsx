import type { Database } from "@/types/supabase/database.types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import Link from "next/link";

type Photo = Database["public"]["Tables"]["photo"]["Row"];

export default async function PhotoListPage() {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("photo").select("*");

    if (error) {
        return (
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Photo List</h1>
                <p className="text-red-500">Error: {error.message}</p>
            </div>
        );
    }

    const photos = data || [];

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Photo List</h1>
            <Link
                href="/admin/dashboard/photo/upload"
                className="inline-block bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mb-4"
            >
                アップロードページへ
            </Link>
            {photos.length === 0 ? (
                <p>まだ画像が登録されていません。</p>
            ) : (
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-100">
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">File Path</th>
                            <th className="p-2 text-left">Public URL</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {photos.map((photo: Photo) => (
                            <tr key={photo.id} className="border-b">
                                <td className="p-2">{photo.id}</td>
                                <td className="p-2">{photo.file_path}</td>
                                <td className="p-2">
                                    {photo.public_url ? (
                                        <a
                                            href={photo.public_url}
                                            className="text-blue-600 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Link
                                        </a>
                                    ) : (
                                        <span>—</span>
                                    )}
                                </td>
                                <td className="p-2">
                                    <Link
                                        href={`/admin/dashboard/photo/${photo.id}/edit`}
                                        className="text-blue-500 underline"
                                    >
                                        編集
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
