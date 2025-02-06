import React from "react";
import { getAlwaysFreeArticles } from "@/libs/newt/afa/always_free_article";
import { getLimitedTimeArticles } from "@/libs/newt/lta/limited_time_article";
import { getUnifiedCategories } from "@/libs/newt/side_data";
import { formatDate } from "@/libs/date";
import Link from "next/link";
import Image from "next/image";
import { MdImageNotSupported } from "react-icons/md";

// 画像コンポーネント
const CoverImage = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <div className="relative aspect-video w-full sm:w-48 flex-shrink-0 overflow-hidden rounded-md bg-grayscale-100 dark:bg-grayscale-800">
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                loading="lazy"
            />
        </div>
    );
};

const NoCoverImage = () => {
    return (
        <div className="flex aspect-video w-full sm:w-48 flex-shrink-0 items-center justify-center rounded-md bg-grayscale-100 dark:bg-grayscale-800 overflow-hidden">
            <MdImageNotSupported size={40} color="#CCCCCC" />
        </div>
    );
};

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function CategoryPage(props: PageProps) {
    const params = await props.params;
    // paramsは同期的に渡される
    const { slug } = params;

    // カテゴリ一覧を取得し、マッチするカテゴリ名を探す
    const allCategories = await getUnifiedCategories();
    const matchedCategory = allCategories.find((cat) => cat.slug === slug);

    // 該当slugに紐づく「常時無料 / 期間限定」記事を取得
    const { articles: alwaysFreeArticles } = await getAlwaysFreeArticles({
        "category.slug": slug,
        depth: 2,
    });
    const { articles: limitedTimeArticles } = await getLimitedTimeArticles({
        "category.slug": slug,
        depth: 2,
    });

    // まとめて配列に
    const mappedAlwaysFree = alwaysFreeArticles.map((article) => ({
        ...article,
        __modelType: "always_free_article" as const,
    }));
    const mappedLimitedTime = limitedTimeArticles.map((article) => ({
        ...article,
        __modelType: "limited_time_article" as const,
    }));
    const combinedArticles = [...mappedAlwaysFree, ...mappedLimitedTime];

    const categoryDisplayName = matchedCategory
        ? matchedCategory["Category-name"]
        : slug;

    // 記事が0件の場合
    if (combinedArticles.length === 0) {
        return (
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
                    カテゴリ: {categoryDisplayName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    現在、このカテゴリには記事がありません。
                </p>
            </div>
        );
    }

    // 記事一覧を表示
    return (
        <div className="container">
            <div className="mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
                    カテゴリ: {categoryDisplayName}
                </h2>

                <div className="space-y-6">
                    {combinedArticles.map((article) => {
                        let detailHref = "#";
                        if (article.__modelType === "always_free_article") {
                            detailHref = `/public/AlwaysFree/${article.slug}`;
                        } else if (article.__modelType === "limited_time_article") {
                            detailHref = `/public/limited-free/${article.slug}`;
                        }

                        // 画像・著者名・日付など
                        const imageSrc = article.image?.src;
                        const imageAlt = article.title || "No Image";
                        const dateFormatted = formatDate(article._sys.createdAt);
                        const authorName = article.author?.fullName || "Unknown Author";

                        return (
                            <div
                                key={article._id}
                                className="group flex flex-col gap-4 rounded-md border border-grayscale-200 dark:border-grayscale-700 bg-light-background dark:bg-dark-background p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row"
                            >
                                {imageSrc ? (
                                    <CoverImage src={imageSrc} alt={imageAlt} />
                                ) : (
                                    <NoCoverImage />
                                )}

                                <div className="flex-1 flex flex-col justify-center">
                                    <Link href={detailHref}>
                                        <h3 className="mb-1 text-lg font-semibold text-grayscale-800 dark:text-grayscale-200 group-hover:underline">
                                            {article.title}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-grayscale-500 dark:text-grayscale-400">
                                        {`By ${authorName}`}
                                    </p>
                                    <p className="text-sm text-grayscale-500 dark:text-grayscale-400">
                                        投稿日: {dateFormatted}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
