import getAddresses from "@/hooks/useAddresses";
import { getSpot } from "@/libs/newt";
import SanitizedContent from "@/utils/SanitizedContent";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import { MdImageNotSupported } from "react-icons/md";

export const experimental_ppr = true;

const Address = ({ address }: { address: string }) => {
    if (!address) return null;

    const addressLines = address.split("\n").map((line, index) => ({
        id: `line-${index}`,
        content: line,
    }));

    return (
        <div className="container">
            <h3 className="text-lg font-semibold mb-2 text-grayscale-800 dark:text-grayscale-100">
                住所
            </h3>
            {addressLines.map(({ id, content }) => (
                <p key={id} className="text-base mb-2 text-grayscale-600 dark:text-grayscale-300">
                    {content}
                </p>
            ))}
        </div>
    );
};

const SpotsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const spot = await getSpot(slug);

    if (!spot) {
        notFound();
    }

    const addressMap = await getAddresses([spot]);
    const address = addressMap[spot._id];

    let imageElement: JSX.Element;
    if (spot.image) {
        imageElement = (
            <div className="relative w-full h-64 mb-4 overflow-hidden">
                <Image
                    src={spot.image.src}
                    alt={spot.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                />
            </div>
        );
    } else {
        imageElement = (
            <div className="relative w-full h-64 mb-4 flex items-center justify-center bg-grayscale-100 dark:bg-grayscale-800 overflow-hidden">
                <MdImageNotSupported size={40} color="#CCCCCC" />
            </div>
        );
    }

    return (
        <div className="bg-light-background dark:bg-dark-background">
            <div className="container">
                {imageElement}
                <h1 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">
                    {spot.title}
                </h1>
                <Address address={address} />
                <SanitizedContent html={spot.Description} />
            </div>
        </div>
    );
};

export default SpotsPage;
