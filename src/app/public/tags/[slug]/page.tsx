import { getTagslug, getLimitedTimeArticles } from "@/libs/newt/limited_time_article";
import { getTagsFromAlwaysFree, getAlwaysFreeArticles } from "@/libs/newt/always_free_article";
import Link from "next/link";

export default async function TagsPage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    // タグ情報を取得 (limited_time_article 側の関数を流用)
    const tag = await getTagslug(slug);

    if (!tag) {
        return (
            <div className="container mx-auto p-4">
                <p>該当するタグが見つかりませんでした。</p>
            </div>
        );
    }

    // always_free_article 側のタグ一覧を取得 (カウント含む)
    const tagsFromAlwaysFree = await getTagsFromAlwaysFree();
    const currentTagCount = tagsFromAlwaysFree.find((t) => t._id === tag._id)?.count ?? 0;

    // 3. always_free_article の記事を取得
    // 「tag._id」に該当する記事を全件取得 (タグがオブジェクト参照)
    const { articles: alwaysFreeArticles } = await getAlwaysFreeArticles({
        "tag._id": tag._id,
        depth: 2,
    });

    // limited_time_article の記事を取得
    // 「tag: tag._id」に該当する記事を全件取得 (タグが文字列配列)
    const { articles: limitedTimeArticles } = await getLimitedTimeArticles({
        tag: tag._id,
        depth: 2,
    });

    // モデル種別を示すキー(__modelType)を付与してマージ
    const mappedAlwaysFree = alwaysFreeArticles.map((article) => ({
        ...article,
        __modelType: "always_free_article" as const,
    }));
    const mappedLimitedTime = limitedTimeArticles.map((article) => ({
        ...article,
        __modelType: "limited_time_article" as const,
    }));
    const combinedArticles = [...mappedAlwaysFree, ...mappedLimitedTime];

    // 該当記事がなければメッセージ表示
    if (combinedArticles.length === 0) {
        return (
            <div className="container mx-auto p-4">
                <h2 className="text-xl font-semibold mb-4">{tag.name}の記事</h2>
                <p>現在、このタグには記事がありません。</p>
            </div>
        );
    }

    // 一覧表示
    return (
        <div className="container mx-auto p-4">
            {/* タグ名と always_free_article 側での使用回数を例として表示 */}
            <h2 className="text-xl font-semibold mb-4">
                タグ: {tag.name} (always_free_article側の使用回数: {currentTagCount})
            </h2>

            <div className="space-y-4">
                {combinedArticles.map((article) => {
                    // 付与した __modelType を元にURLを振り分ける
                    let detailHref = "#";
                    if (article.__modelType === "always_free_article") {
                        detailHref = `/public/AlwaysFree/${article.slug}`;
                    } else if (article.__modelType === "limited_time_article") {
                        detailHref = `/public/limited-free/${article.slug}`;
                    }

                    return (
                        <div key={article._id} className="border p-3 rounded-md">
                            <Link href={detailHref}>
                                <h3 className="text-lg font-semibold">{ article.title }</h3>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 型定義
type PageProps = {
    params: Promise<{ slug: string }>;
};
