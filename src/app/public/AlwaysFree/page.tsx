import { SpotCard } from "@/components/partials/newt/SpotCard";
import { getSpots } from "@/libs/newt";
import type { Spot } from "@/types/newt/spot_type";
import React from "react";

const AlwaysFreePage = async () => {
    const { spots } = await getSpots();

    return (
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <section className="mb-12 w-full">
                    <h2 className="mb-4 text-xl font-semibold">
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
        </div>
    );
};

export default AlwaysFreePage;