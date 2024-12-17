import { SpotCard } from "@/components/partials/SpotCard";
import getAddresses from "@/hooks/useAddresses";
import { getSpots } from "@/libs/newt";
import type { Spot } from "@/types/newt/Spot";
import React from "react";

const AlwaysFreePage = async () => {
    const { spots } = await getSpots();

    // 事前にサーバーサイドで住所を取得
    const addressMap = await getAddresses(spots);

    return (
        <div className="container mx-auto p-4">
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4">スポット一覧</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {spots.map((spot: Spot) => (
                        <li key={spot._id}>
                            {/* 住所をpropsとして渡す */}
                            <SpotCard spot={spot} resolvedAddress={addressMap[spot._id]} />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AlwaysFreePage;