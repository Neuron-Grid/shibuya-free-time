import { SpotCard } from "@/components/partials/SpotCard";
import { getSpots, getTagslug } from "@/libs/newt";

export const experimental_ppr = true;

const TagsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const tag = await getTagslug(slug);

    if (!tag) {
        return (
            <div className="container mx-auto p-4">
                <p>該当するタグが見つかりませんでした。</p>
            </div>
        );
    }

    const { spots } = await getSpots({
        tags: [tag._id],
    });

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">{tag.name}</h2>
            <div className="grid grid-cols-1 gap-8">
                {spots.map((spot) => (
                    <SpotCard key={spot._id} spot={spot} />
                ))}
            </div>
        </div>
    );
};

export default TagsPage;
