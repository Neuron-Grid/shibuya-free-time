import { SpotCard } from "@/components/partials/SpotCard";
import { getSpots } from "@/libs/newt";
import type { Spot } from "@/types/newt/Spot";

const CategoryPage = async ({ params }: CategoryPageProps) => {
    const { slug } = params;

    const { spots } = await getSpots({
        depth: 2,
        "category.slug": slug,
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl">Category</h1>
            <div>
                {spots.map((spot: Spot) => (
                    <SpotCard key={spot._id} spot={spot} />
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;

interface CategoryPageProps {
    params: { slug: string };
}
