import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MdImageNotSupported } from "react-icons/md";
import { formatDate } from "@/libs/date";
import TypographyWrapper from "@/components/partials/TypographyWrapper";
import load_afa_data from "@/libs/newt/afa/load_afa_data"


export default async function AlwaysFreeArticleDetailPage(props: AlwaysFreeArticleDetailPageProps) {
    const { slug } = await props.params;
    const data = await load_afa_data(slug);

    if (!data) {
        notFound();
    }

    const { article, author, prevArticle, nextArticle, resolvedAddress } = data;

    return (
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text cen">
            <div className="max-w-screen-lg mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold">{article.title}</h1>

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

                <p className="mb-2">投稿日: {formatDate(article._sys.createdAt)}</p>

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

                {resolvedAddress && (
                    <p className="mb-2 text-grayscale-600 dark:text-grayscale-300">
                        住所: {resolvedAddress}
                    </p>
                )}

                {article?.nearest_station && (
                    <p className="mb-2">最寄駅: {article.nearest_station}</p>
                )}

                {article?.opening_hours && (
                    <p className="mb-2">営業時間: {article.opening_hours}</p>
                )}

                {article.body && (
                    <div className="mt-8 prose prose-lg dark:prose-invert">
                        <TypographyWrapper htmlContent={article.body} />
                    </div>
                )}

                <div className="mt-8 flex justify-between text-sm">
                    {prevArticle?.slug ? (
                        <Link
                            href={`/public/AlwaysFree/${prevArticle.slug}`}
                            className="text-light-accent dark:text-dark-accent hover:underline"
                        >
                            ← 前の記事へ
                        </Link>
                    ) : (
                        <span className="text-grayscale-400 dark:text-grayscale-600">前の記事なし</span>
                    )}

                    {nextArticle?.slug ? (
                        <Link
                            href={`/public/AlwaysFree/${nextArticle.slug}`}
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

type AlwaysFreeArticleDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};