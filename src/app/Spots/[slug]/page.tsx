import getAddresses from "@/hooks/useAddresses";
import { getSpot } from "@/libs/newt";
import SanitizedContent from "@/utils/SanitizedContent";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { MdImageNotSupported } from "react-icons/md";

const SpotPage = async ({ params }: SpotPageProps) => {
    const spot = await getSpot(params.slug);

    if (!spot) {
        notFound();
    }

    const addressMap = await getAddresses([spot]);
    const address = addressMap[spot._id];

    return (
        <div className="container mx-auto p-4 bg-light-background dark:bg-dark-background min-h-screen">
            {/* ここで画像を表示 */}
            {spot.image ? (
                <div className="relative w-full h-64 mb-4 overflow-hidden">
                    <Image
                        src={spot.image.src}
                        alt={spot.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className="relative w-full h-64 mb-4 flex items-center justify-center bg-grayscale-100 dark:bg-grayscale-800 overflow-hidden">
                    <MdImageNotSupported size={40} color="#CCCCCC" />
                </div>
            )}

            <h1 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">
                {spot.title}
            </h1>
            {address && (
                <p className="text-base mb-4 text-grayscale-600 dark:text-grayscale-300">
                    住所: {address}
                </p>
            )}
            <SanitizedContent html={spot.Description} />
        </div>
    );
};

export default SpotPage;

interface SpotPageProps {
    params: {
        slug: string;
    };
}