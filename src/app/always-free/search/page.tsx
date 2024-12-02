import NoResults from "@/features/search/NoResults";
import { getSpots } from "@/libs/newt";
import type { Spot } from "@/types/newt/spot";
import SanitizedContent from "@/utils/SanitizedContent";
import { htmlToText } from "html-to-text";
import Link from "next/link";

// データ取得
async function fetchSearchResults(query?: string) {
    if (!query) {
        return { spots: [], total: 0 };
    }
    return await getSpots({
        or: [{ title: { match: query } }, { Description: { match: query } }],
    });
}

// サマリー生成
function generateDescription(description: string) {
    return htmlToText(description, {
        selectors: [{ selector: "img", format: "skip" }],
    }).slice(0, 100);
}

// 検索結果のリストをレンダリング
function renderSearchResults(spots: Spot[]) {
    return (
        <ul className="space-y-4">
            {spots.map((spot) => (
                <li key={spot._id} className="border p-4 rounded-lg shadow-sm">
                    <Link href={`/always-free/search/${spot.slug}`} className="block">
                        <SanitizedContent html={spot.title} />
                        <SanitizedContent html={`${generateDescription(spot.Description)}...`} />
                    </Link>
                </li>
            ))}
        </ul>
    );
}

// メイン
export default async function SearchPage({ searchParams }: Props) {
    const { q } = searchParams;
    const { spots, total } = await fetchSearchResults(q);

    return (
        <main className="max-w-4xl mx-auto p-4">
            {total > 0 ? (
                <section>
                    <h1 className="text-xl font-bold mb-4">
                        {total} Results Found for &quot;{q}&quot;
                    </h1>
                    {renderSearchResults(spots)}
                </section>
            ) : (
                <NoResults />
            )}
        </main>
    );
}

// 型定義
type Props = {
    searchParams: {
        q?: string;
    };
};
