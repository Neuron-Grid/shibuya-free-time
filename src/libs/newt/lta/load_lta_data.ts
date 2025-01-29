import { reverseGeocode } from "@/features/reverseGeocode";
import {
    getLimitedTimeArticle,
    getNextArticle,
    getPreviousArticle,
} from "@/libs/newt/lta/limited_time_article";
import type { limited_time_article } from "@/types/newt/limited_time_article";

const load_lta_data = async (slug: string) => {
    const article = await getLimitedTimeArticle(slug);

    // 記事が取得できなければ null
    if (!article) {
        return null;
    }

    // 前後の記事を並行取得
    const [prevArticle, nextArticle] = await Promise.all([
        getPreviousArticle(article as limited_time_article),
        getNextArticle(article as limited_time_article),
    ]);

    // 逆ジオコーディング
    let resolvedAddress = "";
    if (article.address?.lat && article.address?.lng) {
        const result = await reverseGeocode(article.address.lat, article.address.lng);
        resolvedAddress = result ?? "";
    }

    return {
        article,
        prevArticle,
        nextArticle,
        resolvedAddress,
    };
};

export default load_lta_data;
