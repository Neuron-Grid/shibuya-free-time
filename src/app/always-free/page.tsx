import { SpotCard } from "@/components/partials/ArticleCard";
import { getCategories, getSpots, getTags } from "@/libs/newt";
import type React from "react";

const Page: React.FC = async () => {
    const categories = await getCategories();
    const tags = await getTags();
    const { spots } = await getSpots();

    return (
        <div className="container">
            <div className="bg-light-background dark:bg-dark-background">
                {/* カテゴリー一覧の表示 */}
                <div>
                    <h2 className="text-xl">カテゴリー一覧</h2>
                    <ul>
                        {categories.map((category) => (
                            <li key={category._id}>{category.name}</li>
                        ))}
                    </ul>
                </div>

                {/* タグ一覧の表示 */}
                <div>
                    <h2 className="text-xl">タグ一覧</h2>
                    <ul>
                        {tags.map((tag) => (
                            <li key={tag._id}>
                                {tag.name} ({tag.count})
                            </li>
                        ))}
                    </ul>
                </div>

                {/* スポット一覧の表示 */}
                <div>
                    {spots.map((spot) => (
                        <SpotCard key={spot._id} Spot={spot} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
