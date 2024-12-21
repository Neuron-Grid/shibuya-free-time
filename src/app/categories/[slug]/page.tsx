import { SpotCard } from "@/components/partials/SpotCard";
import { getSpots } from "@/libs/newt";
import type { Spot } from "@/types/newt/Spot";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function CategoryPage({ params }: Props) {
    const resolvedParams = await params; // paramsを解決
    const { slug } = resolvedParams;

    const { spots } = await getSpots({
        depth: 2,
        "category.slug": slug,
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl">Category: {slug}</h1>
            <div>
                {spots.map((spot: Spot) => (
                    <SpotCard key={spot._id} spot={spot} />
                ))}
            </div>
        </div>
    );
}
