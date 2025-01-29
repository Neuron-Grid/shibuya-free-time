import { getAlwaysFreeArticles } from "@/libs/newt/afa/always_free_article";
import { getLimitedTimeArticles } from "@/libs/newt/lta/limited_time_article";
import Link from "next/link";

export default async function CategoryPage(props: PageProps) {
    const params = await props.params;
    const { slug } = params;

    // always_free_article 側の記事を取得
    const { articles: alwaysFreeArticles } = await getAlwaysFreeArticles({
        "category.slug": slug,
        depth: 2,
    });

    // limited_time_article 側の記事を取得
    const { articles: limitedTimeArticles } = await getLimitedTimeArticles({
        "category.slug": slug,
        depth: 2,
    });

    // モデル判定用のキー(__modelType)を付与してマージ
    const mappedAlwaysFree = alwaysFreeArticles.map((article) => ({
        ...article,
        __modelType: "always_free_article" as const,
    }));
    const mappedLimitedTime = limitedTimeArticles.map((article) => ({
        ...article,
        __modelType: "limited_time_article" as const,
    }));
    const combinedArticles = [...mappedAlwaysFree, ...mappedLimitedTime];

    // 記事が0件の場合はメッセージ表示
    if (combinedArticles.length === 0) {
        return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl">{slug}</h1>
            <p>該当カテゴリの記事がありません。</p>
        </div>
        );
    }

    // 一覧表示 + 詳細ページへのリンク
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">カテゴリ: {slug}</h1>

            <div className="space-y-4">
                {combinedArticles.map((article) => {
                    // __modelType に応じてリンク先を振り分け
                    let detailHref = "#";
                    if (article.__modelType === "always_free_article") {
                        detailHref = `/public/AlwaysFree/${article.slug}`;
                    } else if (article.__modelType === "limited_time_article") {
                        detailHref = `/public/limited-free/${article.slug}`;
                    }

                    return (
                        <div key={article._id} className="border p-4 rounded">
                            <Link href={detailHref}>
                                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

type PageProps = {
    params: Promise<{ slug: string }>;
};
