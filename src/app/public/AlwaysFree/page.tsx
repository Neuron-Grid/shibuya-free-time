import { SpotCard } from "@/components/partials/newt/afa_SpotCard";
import { getAlwaysFreeArticles } from "@/libs/newt/afa/always_free_article";
import type { always_free_article } from "@/types/newt/always_free_article";
import React from "react";

const AlwaysFreePage = async () => {
    const { articles, total } = await getAlwaysFreeArticles();

    return (
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="max-w-screen-lg mx-auto p-4">
                <section className="mb-12 w-full">
                    <h2 className="mb-4 text-xl font-semibold">スポット一覧</h2>
                    <ul className="space-y-4">
                        {articles.map((article: always_free_article) => (
                        <li key={article._id}>
                            <SpotCard article={article} />
                        </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-sm text-grayscale-600 dark:text-grayscale-400">
                        全{total}件
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AlwaysFreePage;
