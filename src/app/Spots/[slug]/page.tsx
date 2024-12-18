import { getSpot } from "@/libs/newt";
import SanitizedContent from "@/utils/SanitizedContent";
import { notFound } from "next/navigation";
import React from "react";

const SpotPage = async ({ params }: SpotPageProps) => {
    const spot = await getSpot(params.slug);

    if (!spot) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl">{spot.title}</h1>
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
