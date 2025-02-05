import { getAllTagsAndCategories } from "@/libs/newt/side_data";
import Link from "next/link";

export default async function Side() {
    // タグ＆カテゴリをまとめて取得
    const { tags, categories } = await getAllTagsAndCategories();

    return (
        <div className="container">
            <aside className="p-6 rounded">
                {/* カテゴリー一覧 */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">カテゴリー一覧</h2>
                    <ul className="space-y-2">
                        {categories.map((category) => (
                            <li key={category._id}>
                                <Link
                                    href={`/public/categories/${category.slug}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    {category["Category-name"]}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* タグ一覧 */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">タグ一覧</h2>
                    <ul className="space-y-2">
                        {tags.map((tag) => (
                            <li key={tag._id}>
                                <Link
                                    href={`/public/tags/${tag.slug}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    {tag.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* メールマガジンに登録するページに誘導 */}
                <section>
                    <h2 className="text-xl font-bold mb-4">メールマガジン</h2>
                    <p>新着記事をメールでお届けします。</p>
                    <Link href="/public/newsletter" className="text-blue-500 hover:underline">
                        メールマガジンに登録する
                    </Link>
                </section>
            </aside>
        </div>
    );
}
