import { formatDate } from "@/libs/date";
import type { Spot } from "@/types/newt/Spot";
import type { Tag } from "@/types/newt/Tag";
import Image from "next/image";
import Link from "next/link";
import { MdImageNotSupported } from "react-icons/md";

const CoverImage = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <div className="relative mb-3 h-36 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded sm:mb-0 sm:mr-7 sm:h-36 sm:w-72 flex">
            <Image src={src} alt={alt} fill className="object-contain" loading="lazy" />
        </div>
    );
};

const NoCoverImage = () => {
    return (
        <div className="mb-3 h-36 w-full flex-shrink-0 items-center justify-center rounded border bg-gray-100 sm:mb-0 sm:mr-7 sm:h-36 sm:w-72 flex">
            <MdImageNotSupported size={40} color="#CCCCCC" />
        </div>
    );
};

const Tags = ({ tags }: { tags: Tag[] }) => {
    return (
        <ul className="mb-2 flex flex-wrap">
            {tags.map((tag) => (
                <li key={tag._id} className="mb-1 mr-1 list-none rounded border px-1 text-base">
                    #{tag.name}
                </li>
            ))}
        </ul>
    );
};

type SpotCardProps = {
    spot: Spot;
    href?: string;
    resolvedAddress?: string;
};

export const SpotCard = ({ spot, href, resolvedAddress }: SpotCardProps) => {
    const { image, title, slug, tags, _sys } = spot;
    const formattedDate = formatDate(_sys.createdAt);

    return (
        <div>
            <Link
                className="block overflow-hidden border-b pb-9 no-underline flex flex-col sm:flex-row"
                rel="me"
                href={href || `/Spots/${slug}`}
            >
                {image ? <CoverImage src={image.src} alt={title} /> : <NoCoverImage />}

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
