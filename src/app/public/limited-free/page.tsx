import React from "react";
import { SpotCard } from "@/components/partials/newt/lta_SpotCard";
import { getLimitedTimeArticles } from "@/libs/newt/limited_time_article";
import type { limited_time_article } from "@/types/newt/limited_time_article";

const LimitedTimePage = async () => {
    const { articles, total } = await getLimitedTimeArticles();

    return (
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="max-w-screen-lg mx-auto p-4">
                <section className="mb-12 w-full">
                    <h2 className="mb-4 text-xl font-semibold">スポット一覧</h2>
                    <ul className="space-y-4">
                        {articles.map((article: limited_time_article) => (
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

export default LimitedTimePage;