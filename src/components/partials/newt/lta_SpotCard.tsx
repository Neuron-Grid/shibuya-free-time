import { formatDate } from "@/libs/date";
import type { Tag } from "@/types/newt/Tag_type";
import type { limited_time_article } from "@/types/newt/limited_time_article";
import Image from "next/image";
import Link from "next/link";
import { MdImageNotSupported } from "react-icons/md";
import type { JSX } from "react/jsx-runtime";

// 画像がある場合に表示するコンポーネント
const CoverImage = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <div className="relative h-48 w-full sm:h-auto sm:w-48 flex-shrink-0 overflow-hidden">
            <Image src={src} alt={alt} fill className="object-cover" loading="lazy" />
        </div>
    );
};

// 画像がない場合に表示するコンポーネント
const NoCoverImage = () => {
    return (
        <div className="flex h-48 w-full sm:h-auto sm:w-48 flex-shrink-0 items-center justify-center bg-grayscale-100 dark:bg-grayscale-800 overflow-hidden">
            <MdImageNotSupported size={40} color="#CCCCCC" />
        </div>
    );
};

// タグを表示するコンポーネント
const Tags = ({ tags }: { tags?: Tag[] }) => {
    const safeTags = tags ?? [];
    return (
        <ul className="mb-2 flex flex-wrap gap-1">
            {safeTags.map((tag) => (
                <li
                    key={tag._id}
                    className="list-none rounded bg-grayscale-200 dark:bg-grayscale-700 px-2 py-1 text-sm text-grayscale-700 dark:text-grayscale-200"
                >
                    #{tag.name}
                </li>
            ))}
        </ul>
    );
};

// SpotCard 本体
export const SpotCard = ({ article, href }: LimitedTimeArticleCardProps) => {
    const { Image: coverImage, title, slug, tag, _sys } = article;
    const formattedDate = formatDate(_sys.createdAt);

    // 画像の有無でコンポーネントを分岐
    const imageElement: JSX.Element = coverImage ? (
        <CoverImage src={coverImage.src} alt={title} />
    ) : (
        <NoCoverImage />
    );

    return (
        <div className="w-full">
            <Link
                href={href || `/public/limited-free/${slug}`}
                className="block group overflow-hidden rounded-lg bg-light-background dark:bg-dark-background shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl no-underline"
                rel="me"
            >
                <div className="flex flex-col sm:flex-row">
                    {imageElement}
                    <div className="p-4 flex-1">
                        <h3 className="mb-2 line-clamp-2 text-2xl font-semibold text-light-text dark:text-dark-text group-hover:text-light-accent dark:group-hover:text-dark-accent">
                            {title}
                        </h3>
                        <p className="mb-2 text-sm text-grayscale-500 dark:text-grayscale-400">
                            {formattedDate}
                        </p>
                        <Tags tags={tag} />
                    </div>
                </div>
            </Link>
        </div>
    );
};

// コンポーネント用の型定義
type LimitedTimeArticleCardProps = {
    article: limited_time_article;
    href?: string;
};
