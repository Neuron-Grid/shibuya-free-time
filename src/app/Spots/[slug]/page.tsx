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
    return (
        <p className="text-base mb-4 text-grayscale-600 dark:text-grayscale-300">住所: {address}</p>
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
        <div className="container mx-auto p-4 bg-light-background dark:bg-dark-background min-h-screen">
            {imageElement}
            <h1 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">
                {spot.title}
            </h1>
            <Address address={address} />
            <SanitizedContent html={spot.Description} />
        </div>
    );
};

export default SpotsPage;
