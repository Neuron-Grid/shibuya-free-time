import { getTagslug, getLimitedTimeArticles } from "@/libs/newt/lta/limited_time_article";
import { getAlwaysFreeArticles } from "@/libs/newt/afa/always_free_article";
import Link from "next/link";
import Image from "next/image";
import { MdImageNotSupported } from "react-icons/md";
import { formatDate } from "@/libs/date";

// 画像がある場合に表示するコンポーネント
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

// 画像がない場合に表示するコンポーネント
const NoCoverImage = () => {
    return (
        <div className="flex aspect-video w-full sm:w-48 flex-shrink-0 items-center justify-center rounded-md bg-grayscale-100 dark:bg-grayscale-800 overflow-hidden">
            <MdImageNotSupported size={40} color="#CCCCCC" />
        </div>
    );
};

export default async function TagsPage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    // タグ情報を取得 (limited_time_article 側の関数を流用)
    const tag = await getTagslug(slug);
    if (!tag) {
        return (
            <div className="container mx-auto px-4 py-6">
                <p className="text-center text-gray-500 dark:text-gray-400">
                    該当するタグが見つかりませんでした。
                </p>
            </div>
        );
    }

    // always_free_article の記事を取得
    const { articles: alwaysFreeArticles } = await getAlwaysFreeArticles({
        "tag._id": tag._id,
        depth: 2,
    });

    // limited_time_article の記事を取得
    const { articles: limitedTimeArticles } = await getLimitedTimeArticles({
        tag: tag._id,
        depth: 2,
    });

    // __modelType を付与してマージ
    const mappedAlwaysFree = alwaysFreeArticles.map((article) => ({
        ...article,
        __modelType: "always_free_article" as const,
    }));
    const mappedLimitedTime = limitedTimeArticles.map((article) => ({
        ...article,
        __modelType: "limited_time_article" as const,
    }));
    const combinedArticles = [...mappedAlwaysFree, ...mappedLimitedTime];

    // 該当記事がなければメッセージ表示
    if (combinedArticles.length === 0) {
        return (
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
                    {tag.name} の記事
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    現在、このタグには記事がありません。
                </p>
            </div>
        );
    }

    // 一覧表示
    return (
        <div className="container">
            <div className="mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
                タグ: {tag.name}
            </h2>

            <div className="space-y-6">
                {combinedArticles.map((article) => {
                    // URL の分岐
                    let detailHref = "#";
                    if (article.__modelType === "always_free_article") {
                        detailHref = `/public/AlwaysFree/${article.slug}`;
                    } else if (article.__modelType === "limited_time_article") {
                        detailHref = `/public/limited-free/${article.slug}`;
                    }

                    // 画像
                    const imageSrc = article.image?.src;
                    const imageAlt = article.title || "No Image";

                    // 日付フォーマット
                    const dateFormatted = formatDate(article._sys.createdAt);

                    return (
                        <div
                            key={article._id}
                            className="group flex flex-col gap-4 rounded-md border border-grayscale-200 dark:border-grayscale-700 bg-light-background dark:bg-dark-background p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row"
                        >
                            {/* 画像あり/なし */}
                            {imageSrc ? (
                                <CoverImage src={imageSrc} alt={imageAlt} />
                            ) : (
                                <NoCoverImage />
                            )}

                            {/* 記事タイトル・著者名・日付など */}
                            <div className="flex-1 flex flex-col justify-center">
                                <Link href={detailHref}>
                                    <h3 className="mb-1 text-lg font-semibold text-grayscale-800 dark:text-grayscale-200 group-hover:underline">
                                        {article.title}
                                    </h3>
                                </Link>
                                <p className="text-sm text-grayscale-500 dark:text-grayscale-400">
                                    {article.author?.fullName
                                        ? `By ${article.author.fullName}`
                                        : "By Unknown Author"}
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

// 型定義
type PageProps = {
    params: Promise<{ slug: string }>;
};