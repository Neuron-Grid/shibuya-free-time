/// Supabaseから取得した期間限定の無料スポットを表示するページ
/// Supabaseに完全に移行したときに利用するページ

import React from "react";
import Link from "next/link";

const baseUrl = "http://localhost:3000";

export default async function LimitedFreeListPage() {
    const res = await fetch(`${baseUrl}/api/temporary-spots/published`, {
        next: { revalidate: 0 },
    });

    if (!res.ok) {
        throw new Error("テータの取得に失敗しました。");
    }

    const data: TemporarySpot[] = await res.json();

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-6">期間限定の無料スポット</h1>
            {data.length === 0 ? (
                <p>まだ公開されているスポットはありません。</p>
            ) : (
                <ul className="space-y-4">
                    {data.map((spot) => (
                        <li
                            key={spot.id}
                            className="p-4 bg-light-background dark:bg-dark-background rounded shadow"
                        >
                            <Link href={`/public/LimitedFree/${spot.id}`}>
                                <h2 className="font-semibold text-light-text dark:text-dark-text text-lg">
                                    {spot.title}
                                </h2>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// レスポンスの型定義
type TemporarySpot = {
    id: string;
    title: string;
};