import React from "react";


export default async function SingleLimitedFreePage({
        params,
    }: {
        params: { id: string };
    }) {
    const { id } = params;
    const baseUrl = "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/temporary-spots/published`, {
        next: { revalidate: 0 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch published temporary_spots");
    }

    const data: TemporarySpot[] = await res.json();
    const spot = data.find((item) => item.id === id);

    if (!spot) {
        return (
            <div className="container mx-auto py-8">
                <p>指定されたスポットは見つかりませんでした。</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">スポット詳細</h1>
            <div className="p-4 bg-light-background dark:bg-dark-background rounded shadow">
                <h2 className="font-semibold text-light-text dark:text-dark-text text-lg mb-2">
                    {spot.title}
                </h2>
                <p className="text-light-text dark:text-dark-text mb-2">
                    {spot.description}
                </p>
                <p className="text-sm text-gray-500">
                    Status: <span className="font-medium">{spot.status}</span>
                </p>
            </div>
        </div>
    );
}

type TemporarySpot = {
    id: string;
    title: string;
    description: string;
    status: string;
};