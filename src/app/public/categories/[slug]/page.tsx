import { SpotCard } from "@/components/partials/newt/afa_SpotCard";
import { getSpots } from "@/libs/newt";
import type { Spot } from "@/types/newt/spot_type";

export const experimental_ppr = true;

export default async function CategoryPage({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const { spots } = await getSpots({
        depth: 2,
        "category.slug": slug,
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl">{slug}</h1>
            <div>
                {spots.map((spot: Spot) => (
                    <SpotCard key={spot._id} spot={spot} />
                ))}
            </div>
        </div>
    );
}

type Props = {
    params: Promise<{
        slug: string;
    }>;
};
