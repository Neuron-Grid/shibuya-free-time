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

    {/* 住所部分をカードっぽく表示する例 */}
    return (
        <div className="dark:bg-grayscale-900 p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2 text-grayscale-800 dark:text-grayscale-100">
                住所
            </h3>
            {addressLines.map(({ id, content }) => (
                <p key={id} className="text-base mb-1 text-grayscale-600 dark:text-grayscale-300">
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
            <div className="relative w-full h-64 mb-4 overflow-hidden **rounded-md shadow-md**">
                <Image
                    src={spot.image.src}
                    alt={spot.title}
                    fill
                    className="object-cover **transition-all duration-300 transform hover:scale-105**"
                    loading="lazy"
                />
            </div>
        );
    } else {
        imageElement = (
            <div className="relative w-full h-64 mb-4 flex items-center justify-center bg-grayscale-100 dark:bg-grayscale-800 overflow-hidden **rounded-md shadow-md**">
                <MdImageNotSupported size={40} color="#CCCCCC" />
            </div>
        );
    }

    return (
        <div className="bg-light-background dark:bg-dark-background **min-h-screen py-8**">
            <div className="container **px-4**">
                {imageElement}
                <h1 className="**text-3xl font-bold** mb-4 text-light-text dark:text-dark-text">
                    {spot.title}
                </h1>
                <Address address={address} />
                {/* 本文を読みやすくするためにラップする */}
                <div className="**prose dark:prose-invert max-w-none**">
                    <SanitizedContent html={spot.Description} />
                </div>
            </div>
        </div>
    );
};

export default SpotsPage;