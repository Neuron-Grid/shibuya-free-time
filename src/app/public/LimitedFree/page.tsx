import React from "react";
import Link from "next/link";



export default async function LimitedFreeListPage() {
  // サーバーコンポーネントで相対パスを利用するとホスト解決の問題が起きやすいので、
  // ローカル開発中は http://localhost:3000 のようにホスト名を含めた絶対URLでfetchするか、
  // process.env などを利用してください。
  // 例) const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const baseUrl = "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/temporary-spots/published`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch published temporary_spots");
  }

  const data: TemporarySpot[] = await res.json();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Published Temporary Spots</h1>
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
              <p className="text-light-text dark:text-dark-text">
                {spot.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// レスポンスの型定義例
type TemporarySpot = {
    id: string;
    title: string;
    description: string;
    status: string;
  };