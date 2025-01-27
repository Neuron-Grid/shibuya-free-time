import React from "react";
import { notFound } from "next/navigation";
import {
    getLimitedTimeArticle,
    getPreviousArticle,
    getNextArticle,
} from "@/libs/newt/limited_time_article";
import type { limited_time_article } from "@/types/newt/limited_time_article";
import Image from "next/image";
import Link from "next/link";
import { MdImageNotSupported } from "react-icons/md";
import { formatDate } from "@/libs/date";

export const dynamic = "force-dynamic";

export default async function LimitedTimeArticleDetailPage({
        params,
    }: LimitedTimeArticleDetailPageProps) {
        const { slug } = params;
        const article = await getLimitedTimeArticle(slug);

    // 記事が存在しない場合は 404
    if (!article) {
        notFound();
    }

  // 前後の記事を取得
    const [prevArticle, nextArticle] = await Promise.all([
        getPreviousArticle(article as limited_time_article),
        getNextArticle(article as limited_time_article),
    ]);

  // サーバーサイドで住所を逆ジオコーディングして取得
    let resolvedAddress = "";
    if (article?.address?.lat && article?.address?.lng) {
        try {
        // 環境変数か、なければローカルホストのポートをベースに fetch
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
            const res = await fetch(
                `${baseUrl}/api/google/reverse-geocode?lat=${article.address.lat}&lng=${article.address.lng}`
        );

        if (res.ok) {
            const data = await res.json();
            // 取得した address は { address: string } の想定
            resolvedAddress = data.address ?? "";
        } else {
            console.error("Failed to fetch address:", await res.text());
        }
        } catch (error) {
            console.error("Reverse geocode fetch error:", error);
        }
    }

    return (
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="max-w-screen-lg mx-auto p-4">
                {/* タイトル */}
                <h1 className="mb-4 text-2xl font-bold">{article.title}</h1>

                {/* 投稿日時 */}
                <p className="mb-2 text-sm text-grayscale-500 dark:text-grayscale-400">
                    投稿日: {formatDate(article._sys.createdAt)}
                </p>

                {/* 画像表示 */}
                <div className="my-4 w-full h-64 relative overflow-hidden rounded-lg">
                    {article?.Image ? (
                        <Image
                        src={article.Image.src}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-grayscale-100 dark:bg-grayscale-800">
                            <MdImageNotSupported size={60} color="#CCCCCC" />
                        </div>
                    )}
                </div>

                {/* タグ */}
                {article?.tag?.length ? (
                    <ul className="mb-4 flex flex-wrap gap-2">
                        {article.tag.map((tag) => (
                            <li
                                key={tag._id}
                                className="px-2 py-1 rounded bg-grayscale-200 dark:bg-grayscale-700 text-sm text-grayscale-700 dark:text-grayscale-200"
                            >
                                #{tag.name}
                            </li>
                        ))}
                    </ul>
                ) : null}

                {/* 住所（逆ジオコーディング済み） */}
                {resolvedAddress && (
                    <p className="mb-2 text-sm text-grayscale-600 dark:text-grayscale-300">
                        住所: {resolvedAddress}
                    </p>
                )}

                {/* ほかの追加情報（例: 最寄駅、営業時間など） */}
                {article?.nearest_station && (
                    <p className="mb-2 text-sm text-grayscale-600 dark:text-grayscale-300">
                        最寄駅: {article.nearest_station}
                    </p>
                )}
                {article?.opening_hours && (
                    <p className="mb-2 text-sm text-grayscale-600 dark:text-grayscale-300">
                        営業時間: {article.opening_hours}
                    </p>
                )}

                {/* 記事詳細 */}
                {article?.body && (
                    <div className="prose dark:prose-invert mt-4">
                        <p>{article.body}</p>
                    </div>
                )}

                {/* 前の記事・次の記事へのリンク */}
                <div className="mt-8 flex justify-between text-sm">
                {prevArticle?.slug ? (
                    <Link
                        href={`/public/LimitedTime/${prevArticle.slug}`} // ★変更：リンク先もLimitedTimeに
                        className="text-light-accent dark:text-dark-accent hover:underline"
                        >
                        ← 前の記事へ
                    </Link>
                ) : (
                    <span className="text-grayscale-400 dark:text-grayscale-600">前の記事なし</span>
                )}
                {nextArticle?.slug ? (
                    <Link
                    href={`/public/LimitedTime/${nextArticle.slug}`} // ★変更：リンク先もLimitedTimeに
                    className="text-light-accent dark:text-dark-accent hover:underline"
                    >
                    次の記事へ →
                    </Link>
                ) : (
                    <span className="text-grayscale-400 dark:text-grayscale-600">次の記事なし</span>
                )}
                </div>
            </div>
        </div>
    );
}

type LimitedTimeArticleDetailPageProps = {
    params: {
        slug: string;
    };
};