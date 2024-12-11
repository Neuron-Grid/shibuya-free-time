import type { Category } from "@/types/newt/category";
import type { TagWithCount } from "@/types/newt/tag";

const Side: React.FC<SideProps> = ({ tags, categories }) => {
    return (
        <aside className="space-y-12">
            {/* タグ一覧 */}
            <section>
                <h2 className="text-xl font-semibold mb-4">タグ一覧</h2>
                <ul className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <li
                            key={tag._id}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                        >
                            {tag.name}
                        </li>
                    ))}
                </ul>
            </section>

            {/* カテゴリー一覧 */}
            <section>
                <h2 className="text-xl font-semibold mb-4">カテゴリー一覧</h2>
                <ul className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <li
                            key={category._id}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            </section>
        </aside>
    );
};

export default Side;

interface SideProps {
    tags: TagWithCount[];
    categories: Category[];
}
