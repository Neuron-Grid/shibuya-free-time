import { SpotCard } from "@/components/partials/SpotCard";
import { getSpots } from "@/libs/newt";
import type { Spot } from "@/types/newt/Spot";
import React from "react";

const AlwaysFreePage = async () => {
    const { spots } = await getSpots();

    return (
        <div className="container mx-auto flex items-center justify-between p-4 bg-light-background dark:bg-dark-background">
            <section className="mb-12 w-full">
                <h2 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text">
                    スポット一覧
                </h2>
                <ul>
                    {spots.map((spot: Spot) => (
                        <li key={spot._id}>
                            <SpotCard spot={spot} />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AlwaysFreePage;
