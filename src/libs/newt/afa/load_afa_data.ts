import { reverseGeocode } from "@/features/reverseGeocode";
import {
    getAlwaysFreeArticle,
    getAuthorByArticleSlug,
    getNextArticle,
    getPreviousArticle,
} from "@/libs/newt/afa/always_free_article";
import type { always_free_article } from "@/types/newt/always_free_article";

const load_afa_data = async (slug: string) => {
    const article = await getAlwaysFreeArticle(slug);

    if (!article) {
        return null;
    }

    const [author, prevArticle, nextArticle] = await Promise.all([
        getAuthorByArticleSlug(slug),
        getPreviousArticle(article as always_free_article),
        getNextArticle(article as always_free_article),
    ]);

    let resolvedAddress = "";
    if (article?.address?.lat && article?.address?.lng) {
        const result = await reverseGeocode(article.address.lat, article.address.lng);
        resolvedAddress = result ?? "";
    }

    return {
        article,
        author,
        prevArticle,
        nextArticle,
        resolvedAddress,
    };
};

export default load_afa_data;
