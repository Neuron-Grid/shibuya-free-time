import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MdImageNotSupported } from "react-icons/md";
import { formatDate } from "@/libs/date";
import TypographyWrapper from "@/components/partials/TypographyWrapper";
import load_lta_data from "@/libs/newt/lta/load_lta_data";

export default async function LimitedTimeArticleDetailPage(props: LimitedTimeArticleDetailPageProps) {
    const params = await props.params;
    const { slug } = params;

    // データ取得部分を専用関数に委譲
    const data = await load_lta_data(slug);

    // 記事が存在しない場合は 404
    if (!data) {
        notFound();
    }

    // データを取り出し
    const { article, author, prevArticle, nextArticle, resolvedAddress } = data;

    // 画面描画
    return (
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="max-w-screen-lg mx-auto p-4">
                {/* タイトル */}
                <h1 className="mb-4 text-2xl">{article.title}</h1>

                {/* 画像表示 */}
                <div className="my-4 w-full h-64 relative overflow-hidden rounded-lg">
                    {article?.image ? (
                        <Image
                            src={article.image.src}
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

                {/* 投稿日時 */}
                <p className="mb-2 ">
                    投稿日: {formatDate(article._sys.createdAt)}
                </p>

                {/* 著者情報 */}
                {author && (
                    <div className="mb-4">
                        <p className="text-lg font-semibold">
                            著者:
                            <Link
                                href={`/public/author/${author.slug}`}
                                className="text-light-accent dark:text-dark-accent hover:underline"
                            >
                                {author.fullName}
                            </Link>
                        </p>
                    </div>
                )}

                {/* タグ */}
                {article.tags?.length > 0 && (
                    <ul className="mb-4 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                            <li
                                key={tag._id}
                                className="px-2 py-1 rounded bg-grayscale-200 dark:bg-grayscale-700 text-grayscale-700 dark:text-grayscale-200"
                            >
                                <Link
                                    href={`/public/tags/${tag.slug}`}
                                    className="text-light-accent dark:text-dark-accent hover:underline"
                                >
                                    #{tag.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {/* 住所（逆ジオコーディング済み） */}
                {resolvedAddress && (
                    <p className="mb-2  text-grayscale-600 dark:text-grayscale-300">
                        住所: {resolvedAddress}
                    </p>
                )}

                {/* ほかの追加情報（例: 最寄駅、営業時間など） */}
                {article.nearest_station && (
                    <p className="mb-2  text-grayscale-600 dark:text-grayscale-300">
                        最寄駅: {article.nearest_station}
                    </p>
                )}
                {article.opening_hours && (
                    <p className="mb-2  text-grayscale-600 dark:text-grayscale-300">
                        営業時間: {article.opening_hours}
                    </p>
                )}

                {/* 記事詳細 */}
                {article.body && (
                    <div className="mt-8 prose prose-lg dark:prose-invert">
                        <TypographyWrapper htmlContent={article.body} />
                    </div>
                )}

                {/* 前の記事・次の記事へのリンク */}
                <div className="mt-8 flex justify-between ">
                    {prevArticle?.slug ? (
                        <Link
                            href={`/public/limited-free/${prevArticle.slug}`}
                            className="text-light-accent dark:text-dark-accent hover:underline"
                        >
                            ← 前の記事へ
                        </Link>
                    ) : (
                        <span className="text-grayscale-400 dark:text-grayscale-600">
                            前の記事なし
                        </span>
                    )}

                    {nextArticle?.slug ? (
                        <Link
                            href={`/public/limited-free/${nextArticle.slug}`}
                            className="text-light-accent dark:text-dark-accent hover:underline"
                        >
                            次の記事へ →
                        </Link>
                    ) : (
                        <span className="text-grayscale-400 dark:text-grayscale-600">
                            次の記事なし
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

type LimitedTimeArticleDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};
