import { formatDate } from "@/libs/date";
import type { Tag } from "@/types/newt/Tag_type";
import type { Spot } from "@/types/newt/spot_type";
import Image from "next/image";
import Link from "next/link";
import { MdImageNotSupported } from "react-icons/md";
import type { JSX } from "react/jsx-runtime";

const CoverImage = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <div className="relative h-48 w-full sm:h-auto sm:w-48 flex-shrink-0 overflow-hidden">
            <Image src={src} alt={alt} fill className="object-cover" loading="lazy" />
        </div>
    );
};

const NoCoverImage = () => {
    return (
        <div className="flex h-48 w-full sm:h-auto sm:w-48 flex-shrink-0 items-center justify-center bg-grayscale-100 dark:bg-grayscale-800 overflow-hidden">
            <MdImageNotSupported size={40} color="#CCCCCC" />
        </div>
    );
};

const Tags = ({ tags }: { tags: Tag[] }) => {
    return (
        <ul className="mb-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
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

export const SpotCard = ({ spot, href, resolvedAddress }: SpotCardProps) => {
    const { image, title, slug, tags, _sys } = spot;
    const formattedDate = formatDate(_sys.createdAt);

    let imageElement: JSX.Element;
    if (image) {
        imageElement = <CoverImage src={image.src} alt={title} />;
    } else {
        imageElement = <NoCoverImage />;
    }

    return (
        <div className="w-full">
            <Link
                href={href || `/Spots/${slug}`}
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

type SpotCardProps = {
    spot: Spot;
    href?: string;
    resolvedAddress?: string;
};
