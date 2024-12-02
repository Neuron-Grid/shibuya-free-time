"use client";
import useAddresses from "@/hooks/useAddresses";
import type { Category } from "@/types/newt/category";
import type { Spot } from "@/types/newt/spot";
import type { TagWithCount } from "@/types/newt/tag";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ClientDataDisplay({ spots }: Props) {
    const [addresses, setAddresses] = useState<Record<string, string>>({});

    useEffect(() => {
        useAddresses(spots).then(setAddresses);
    }, [spots]);

    return (
        <div className="container mx-auto p-4">
            <section className=" mb-12">
                <h2 className="text-xl font-semibold mb-4">スポット一覧</h2>
                <ul className="space-y-8">
                    {spots.map((spot) => (
                        <li key={spot._id} className="p-6 border rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-2">{spot.title}</h3>
                            {spot.image && (
                                <Image
                                    src={spot.image.src}
                                    alt={spot.image.altText || spot.title}
                                    width={600}
                                    height={400}
                                    className="mb-4 rounded"
                                />
                            )}
                            <p className="mb-2">{spot.Description}</p>
                            {spot.category && (
                                <p className="mb-1">
                                    <span className="font-medium">カテゴリー:</span>{" "}
                                    {spot.category.name}
                                </p>
                            )}
                            <p className="mb-1">
                                <span className="font-medium">タグ:</span>{" "}
                                {spot.tags.map((tag) => tag.name).join(", ")}
                            </p>
                            <p className="mb-1">
                                <span className="font-medium">住所:</span>{" "}
                                {addresses[spot._id] || "住所を取得中..."}
                            </p>
                            <p className="mb-1">
                                <span className="font-medium">最寄駅:</span>{" "}
                                {spot.nearest_station || "情報なし"}
                            </p>
                            <p>
                                <span className="font-medium">営業時間:</span>{" "}
                                {spot.opening_hours || "情報なし"}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

interface Props {
    spots: Spot[];
    tags: TagWithCount[];
    categories: Category[];
}
