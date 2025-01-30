// libs/newt/lta/load_lta_data.ts

import { reverseGeocode } from "@/features/reverseGeocode";
import {
    getLimitedTimeArticle,
    getNextArticle,
    getPreviousArticle,
} from "@/libs/newt/lta/limited_time_article";
import type { limited_time_article } from "@/types/newt/limited_time_article";

const load_lta_data = async (slug: string) => {
    const article = await getLimitedTimeArticle(slug);

    // 記事が取得できなければ null を返す
    if (!article) {
        return null;
    }

    // 前後の記事を並行して取得
    const [prevArticle, nextArticle] = await Promise.all([
        getPreviousArticle(article as limited_time_article),
        getNextArticle(article as limited_time_article),
    ]);

    // 逆ジオコーディングによる住所解決
    let resolvedAddress = "";
    if (article.address.lat && article.address.lng) {
        const result = await reverseGeocode(article.address.lat, article.address.lng);
        resolvedAddress = result ?? "";
    }

    return {
        article,
        author: article.author,
        prevArticle,
        nextArticle,
        resolvedAddress,
    };
};

export default load_lta_data;
