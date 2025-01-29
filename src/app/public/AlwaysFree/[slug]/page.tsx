import React from "react";
import { notFound } from "next/navigation";
import {
    getAlwaysFreeArticle,
    getPreviousArticle,
    getNextArticle,
    getAuthorByArticleSlug,
} from "@/libs/newt/always_free_article";
import type { always_free_article } from "@/types/newt/always_free_article";
import Image from "next/image";
import Link from "next/link";
import { MdImageNotSupported } from "react-icons/md";
import { formatDate } from "@/libs/date";
import { reverseGeocode } from "@/features/reverseGeocode";
import TypographyWrapper from "@/components/partials/TypographyWrapper";


const loadArticleData = async (slug: string) => {
    const article = await getAlwaysFreeArticle(slug);

    if (!article) {
        return null;
    }

    const [author, prevArticle, nextArticle] = await Promise.all([
        getAuthorByArticleSlug(slug),
        getPreviousArticle(article as always_free_article),
        getNextArticle(article as always_free_article),
    ]);

    let resolvedAddress = "";
    if (article?.address?.lat && article?.address?.lng) {
        const result = await reverseGeocode(article.address.lat, article.address.lng);
        resolvedAddress = result ?? "";
    }

    return {
        article,
        author,
        prevArticle,
        nextArticle,
        resolvedAddress,
    };
};

export default async function AlwaysFreeArticleDetailPage(props: AlwaysFreeArticleDetailPageProps) {
    const { params } = props;
    const { slug } = params;

    const data = await loadArticleData(slug);

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
                            著者: {author.fullName} (
                            <Link href="/public/author" className="text-light-accent dark:text-dark-accent hover:underline">
                                詳細はこちら
                            </Link>
                        )
                        </p>
                    </div>
                )}

                {article.tags?.length > 0 && (
                    <ul className="mb-4 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                            <li key={tag._id} className="px-2 py-1 rounded">
                                #{tag.name}
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
    params: {
        slug: string;
    };
};