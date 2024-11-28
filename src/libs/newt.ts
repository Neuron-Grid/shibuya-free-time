import type { Article } from "@/types/newt/article";
import type { Category } from "@/types/newt/category";
import { env_validation } from "@/utils/env_validation";
import { createClient } from "newt-client-js";
import type { AppMeta, GetContentsQuery } from "newt-client-js";
import { cache } from "react";

// 環境変数を定数として定義
const {
    newt_space_Uid: SPACE_UID,
    newt_token: TOKEN,
    newt_api_Type: API_TYPE,
    newt_app_Uid: APP_UID,
    newt_article_Model_Uid: ARTICLE_MODEL_UID,
    newt_category_Model_Uid: CATEGORY_MODEL_UID,
} = env_validation;

// Newtクライアントの作成
const client = createClient({
    spaceUid: SPACE_UID,
    token: TOKEN,
    apiType: API_TYPE,
});

// アプリ情報を取得
export const getApp = cache(async (): Promise<AppMeta> => {
    return client.getApp({ appUid: APP_UID });
});

// 記事一覧を取得
export const getArticles = cache(
    async (query?: GetContentsQuery): Promise<{ articles: Article[]; total: number }> => {
        const { items: articles, total } = await client.getContents<Article>({
            appUid: APP_UID,
            modelUid: ARTICLE_MODEL_UID,
            query,
        });
        return { articles, total };
    },
);

// 特定の記事を取得
export const getArticle = cache(async (slug: string): Promise<Article | null> => {
    if (!slug) return null;
    return client.getFirstContent<Article>({
        appUid: APP_UID,
        modelUid: ARTICLE_MODEL_UID,
        query: { slug },
    });
});

// カテゴリ一覧を取得（記事が存在するカテゴリのみ）
export const getCategories = cache(async (): Promise<Category[]> => {
    // カテゴリを取得
    const { items: categories } = await client.getContents<Category>({
        appUid: APP_UID,
        modelUid: CATEGORY_MODEL_UID,
        query: {
            order: ["_sys.customOrder"],
        },
    });

    // 記事のカテゴリ情報を取得
    const { items: articles } = await client.getContents<{ category: string }>({
        appUid: APP_UID,
        modelUid: ARTICLE_MODEL_UID,
        query: {
            depth: 0,
            select: ["category"],
        },
    });

    // カテゴリIDごとの記事数を集計
    const categoryCountMap: Record<string, number> = {};
    for (const article of articles) {
        const categoryId = article.category;
        if (categoryId) {
            categoryCountMap[categoryId] = (categoryCountMap[categoryId] || 0) + 1;
        }
    }

    // 記事が存在するカテゴリのみをフィルタリング
    const validCategories = categories.filter((category) => categoryCountMap[category._id] > 0);

    return validCategories;
});

// 特定のカテゴリを取得
export const getCategory = cache(async (slug: string): Promise<Category | null> => {
    if (!slug) return null;
    return client.getFirstContent<Category>({
        appUid: APP_UID,
        modelUid: CATEGORY_MODEL_UID,
        query: { slug },
    });
});
