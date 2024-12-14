import { getCategories, getTags } from "@/libs/always_free/newt";
import Link from "next/link";
import type React from "react";

const Side: React.FC = async () => {
    const tags = await getTags();
    const categories = await getCategories();

    return (
        <div className="container">
            <aside className="p-6 rounded">
                {/* タグ一覧 */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">タグ一覧</h2>
                    <ul className="space-y-2">
                        {tags.map((tag) => (
                            <li key={tag.slug}>
                                <Link
                                    href={`/tags/${tag.slug}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    {tag.name} ({tag.count})
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* カテゴリー一覧 */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">カテゴリー一覧</h2>
                    <ul className="space-y-2">
                        {categories.map((category) => (
                            <li key={category.slug}>
                                <Link
                                    href={`/categories/${category.slug}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </aside>
        </div>
    );
};

export default Side;
