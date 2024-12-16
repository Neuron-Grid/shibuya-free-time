import { getSpots } from "@/libs/newt";
import type { Spot } from "@/types/newt/Spot";
import type { Tag } from "@/types/newt/Tag";
import Image from "next/image";
import React from "react";

const SpotCard = ({ spot }: { spot: Spot }) => {
    const { image, title, category, tags, address } = spot;
    return (
        <li
            key={spot._id}
            className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
            {image?.src && (
                <Image
                    src={image.src}
                    alt={image.altText || title}
                    width={600}
                    height={400}
                    className="mb-4 rounded"
                />
            )}
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {category?.name && (
                <p className="mb-1 text-sm text-gray-600">
                    <span className="font-medium">カテゴリー:</span> {category.name}
                </p>
            )}
            {tags?.length > 0 && (
                <p className="text-sm text-gray-600">
                    <span className="font-medium">タグ:</span>{" "}
                    {tags.map((tag: Tag) => tag.name).join(", ")}
                </p>
            )}
            {address && (
                <p className="text-sm text-gray-600">
                    <span className="font-medium">住所:</span> 緯度 {address.lat}, 経度{" "}
                    {address.lng}
                </p>
            )}
        </li>
    );
};

const AlwaysFreePage = async () => {
    const { spots } = await getSpots();

    return (
        <div className="container mx-auto p-4">
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4">スポット一覧</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {spots.map((spot) => (
                        <SpotCard key={spot._id} spot={spot} />
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AlwaysFreePage;
