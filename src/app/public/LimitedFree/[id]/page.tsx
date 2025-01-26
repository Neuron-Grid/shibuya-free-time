/// Supabaseから取得した期間限定の無料スポットを表示するページ
/// Supabaseに完全に移行したときに利用するページ

import React from "react";
import { notFound } from "next/navigation";

export const revalidate = 0;

const baseUrl = "http://localhost:3000";

// 単一IDのスポット取得用ヘルパー関数
async function fetchSingleSpot(id: string): Promise<TemporarySpot | null> {
    // 相対パスで指定
    const res = await fetch(`${baseUrl}/api/temporary-spots/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) {
        return null;
    }
    return res.json();
}

export default async function SingleLimitedFreePage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;

    // 単一IDエンドポイントから直接取得
    const spot = await fetchSingleSpot(id);

    // 該当データがなければ 404 ページを表示
    if (!spot) {
        notFound();
    }

    // 該当データがあれば詳細表示
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">スポット詳細</h1>
            <div className="p-4 bg-light-background dark:bg-dark-background rounded shadow">
                <h2 className="font-semibold text-light-text dark:text-dark-text text-lg mb-2">
                    {spot.title}
                </h2>
                <p className="text-light-text dark:text-dark-text mb-2">
                    {spot.description}
                </p>
            </div>
        </div>
    );
}

type TemporarySpot = {
    id: string;
    title: string;
    description: string;
};