"use client";
import { formatDate } from "@/libs/date";
import type { Spot } from "@/types/newt/Spot";
import type { Tag } from "@/types/newt/Tag";
import Image from "next/image";
import Link from "next/link";
import { MdImageNotSupported } from "react-icons/md";

const CoverImage = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <div className="container relative mb-3 flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded sm:mb-0 sm:mr-7 sm:h-36 sm:w-72">
            <Image src={src} alt={alt} fill className="object-contain" loading="lazy" />
        </div>
    );
};

const NoCoverImage = () => {
    return (
        <div className="container flex h-36 w-full items-center justify-center sm:w-72">
            <MdImageNotSupported size={40} color="#CCCCCC" />
        </div>
    );
};

const Tags = ({ tags }: { tags: Tag[] }) => {
    return (
        <ul className="container mb-2 flex flex-wrap">
            {tags.map((tag) => (
                <li key={tag._id} className="mb-1 mr-1 list-none rounded border px-1 text-base">
                    #{tag.name}
                </li>
            ))}
        </ul>
    );
};

export const SpotCard = ({ spot, href, resolvedAddress }: SpotCardProps) => {
    const { image, title, slug, tags, _sys } = spot;
    const formattedDate = formatDate(_sys.createdAt);

    return (
        <div className="container">
            <Link
                className="mb-10 block overflow-hidden border-b p-0 no-underline last:mb-7 sm:mb-9 sm:flex sm:pb-9"
                rel="me"
                href={href || `/Spots/${slug}`}
            >
                {image ? (
                    <CoverImage src={image.src} alt={title} />
                ) : (
                    <div className="mb-3 sm:mb-0 sm:mr-7">
                        <NoCoverImage />
                    </div>
                )}
                <div className="flex-1">
                    <h3 className="mb-2 line-clamp-2 overflow-hidden text-2xl leading-tight">
                        {title}
                    </h3>
                    <p className="mb-2">{formattedDate}</p>
                    <Tags tags={tags} />
                    {resolvedAddress && (
                        <p className="mt-2 text-sm text-gray-600">住所: {resolvedAddress}</p>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default SpotCard;

type SpotCardProps = {
    spot: Spot;
    href?: string;
    resolvedAddress?: string;
};