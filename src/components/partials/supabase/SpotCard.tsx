// Supabase用のSpotCardコンポーネント

import { formatDate } from "@/libs/date";
import Image from "next/image";
import Link from "next/link";
import { MdImageNotSupported } from "react-icons/md";
import type { JSX } from "react/jsx-runtime";

/**
 * Supabase 用に再定義した Tag 型
 */
type Tag = {
    id: string;
    name: string;
};

/**
 * Supabase 用に再定義した Spot 型
 * - Newt CMS を参照せず、あくまで Supabase DB から取得したデータを元に定義します
 * - `image?: { src: string }` は、親コンポーネント側で
 *   文字列の publicUrl を `{ src: publicUrl }` のように変換したものを想定
 */
type Spot = {
    id: string;      // 例: temporary_spots.id
    slug: string;    // 例: temporary_spots.slug
    title: string;   // 例: temporary_spots.title
    createdAt: string; // 例: row.created_at or row.start_date, 必要に応じて調整
    tags: Tag[];
    image?: {
        src: string;
    };
};

type SpotCardProps = {
    spot: Spot;
    href?: string;
    resolvedAddress?: string;
};

// 画像が存在する場合のカバー画像表示
const CoverImage = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <div className="container relative h-48 w-full sm:h-auto sm:w-48 flex-shrink-0 overflow-hidden">
            <Image src={src} alt={alt} fill className="object-cover" loading="lazy" />
        </div>
    );
};

// 画像が存在しない場合のダミー表示
const NoCoverImage = () => {
    return (
        <div className="container flex h-48 w-full sm:h-auto sm:w-48 flex-shrink-0 items-center justify-center bg-grayscale-100 dark:bg-grayscale-800 overflow-hidden">
            <MdImageNotSupported size={40} color="#CCCCCC" />
        </div>
    );
};

// タグ一覧表示
const Tags = ({ tags }: { tags: Tag[] }) => {
    return (
        <ul className="container mb-2 flex flex-wrap gap-1">
        {tags.map((tag) => (
            <li
                key={tag.id}
                className="list-none rounded bg-grayscale-200 dark:bg-grayscale-700 px-2 py-1 text-sm text-grayscale-700 dark:text-grayscale-200"
            >
                #{tag.name}
            </li>
        ))}
        </ul>
    );
};

/**
 * SpotCard コンポーネント
 * - Newt 依存を削除し、あくまで Supabase 由来の Spot 型を扱う
 */
export const SpotCard = ({ spot, href, resolvedAddress }: SpotCardProps) => {
    const { image, title, slug, tags, createdAt } = spot;
    const formattedDate = formatDate(createdAt);

    const imageElement: JSX.Element = image ? (
        <CoverImage src={image.src} alt={title} />
    ) : (
        <NoCoverImage />
    );

    return (
        <div className="w-full container">
            <Link
                href={href || `/public/Spots/${slug}`}
                className="block overflow-hidden rounded-lg bg-light-background dark:bg-dark-background shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl no-underline"
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
                        <Tags tags={tags} />
                        {resolvedAddress && (
                        <p className="mt-2 text-sm text-grayscale-600 dark:text-grayscale-300">
                            住所: {resolvedAddress}
                        </p>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};