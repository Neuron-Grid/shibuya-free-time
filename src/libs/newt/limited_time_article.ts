import { newt_client } from "@/libs/newt/newt_client";
import type { Category } from "@/types/newt/Category_type";
import type { Tag, TagWithCount } from "@/types/newt/Tag_type";
import type { limited_time_article } from "@/types/newt/limited_time_article";
import { env_validation } from "@/utils/env_validation";
import type { AppMeta, GetContentsQuery } from "newt-client-js";
import { cache } from "react";

// アプリケーションのメタデータを取得
export const getApp = cache(async (): Promise<AppMeta> => {
    const app = await newt_client.getApp({
        appUid: env_validation.newt_app_uid,
    });
    return app;
});

// limited_time_article の一覧を取得
export const getLimitedTimeArticles = cache(
    async (
        query?: GetContentsQuery,
    ): Promise<{ articles: limited_time_article[]; total: number }> => {
        const { items: articles, total } = await newt_client.getContents<limited_time_article>({
            appUid: env_validation.newt_app_uid,
            modelUid: "limited_time_article",
            query: {
                depth: 2,
                ...query,
            },
        });

        return { articles, total };
    },
);

// 特定のスラッグの limited_time_article を取得
export const getLimitedTimeArticle = cache(
    async (slug: string): Promise<limited_time_article | null> => {
        if (!slug) return null;
        const article = await newt_client.getFirstContent<limited_time_article>({
            appUid: env_validation.newt_app_uid,
            modelUid: "limited_time_article",
            query: {
                depth: 2,
                slug,
            },
        });
        return article || null;
    },
);

//  前の limited_time_article を取得
export const getPreviousArticle = cache(
    async (currentArticle: limited_time_article): Promise<{ slug: string } | null> => {
        const { createdAt } = currentArticle._sys;

        const article = await newt_client.getFirstContent<{ slug: string }>({
            appUid: env_validation.newt_app_uid,
            modelUid: "limited_time_article",
            query: {
                select: ["slug"],
                "_sys.createdAt": {
                    gt: createdAt,
                },
                order: ["_sys.createdAt"],
            },
        });
        return article || null;
    },
);

// 次の limited_time_article を取得
export const getNextArticle = cache(
    async (currentArticle: limited_time_article): Promise<{ slug: string } | null> => {
        const { createdAt } = currentArticle._sys;

        const article = await newt_client.getFirstContent<{ slug: string }>({
            appUid: env_validation.newt_app_uid,
            modelUid: "limited_time_article",
            query: {
                select: ["slug"],
                "_sys.createdAt": {
                    lt: createdAt,
                },
                order: ["-_sys.createdAt"],
            },
        });
        return article || null;
    },
);

// タグ一覧とその使用回数を取得
// フィールド名 "tag" が配列という前提
export const getTags = cache(async (): Promise<TagWithCount[]> => {
    // タグを取得
    const { items: tags } = await newt_client.getContents<Tag>({
        appUid: env_validation.newt_app_uid,
        modelUid: "tag",
        query: {
            limit: 20,
        },
    });

    // limited_time_article 側に紐づいている tag 情報を取得
    // Newt CMS上では "tag" フィールドが配列
    const { items: articles } = await newt_client.getContents<{
        tag: string[];
    }>({
        appUid: env_validation.newt_app_uid,
        modelUid: "limited_time_article",
        query: {
            select: ["tag"],
            depth: 0,
            limit: 20,
        },
    });

    // タグIDごとにカウント
    const tagCountMap = new Map<string, number>();
    for (const { tag: articleTags } of articles) {
        if (!Array.isArray(articleTags)) continue; // 念のためガード
        for (const tagId of articleTags) {
            tagCountMap.set(tagId, (tagCountMap.get(tagId) || 0) + 1);
        }
    }

    // 使用回数が1以上のタグだけ抽出
    const tagsWithCount: TagWithCount[] = tags
        .map((t) => ({
            ...t,
            count: tagCountMap.get(t._id) || 0,
        }))
        .filter((t) => t.count > 0);

    return tagsWithCount;
});

// 特定のスラッグのタグを取得
export const getTagslug = cache(async (slug: string): Promise<Tag | null> => {
    if (!slug) return null;
    const tag = await newt_client.getFirstContent<Tag>({
        appUid: env_validation.newt_app_uid,
        modelUid: "tag",
        query: {
            slug,
        },
    });
    return tag || null;
});

// 特定の limited_time_article の住所情報を取得
export const getArticleAddress = cache(
    async (slug: string): Promise<{ lat: number; lng: number } | null> => {
        if (!slug) return null;
        const article = await newt_client.getFirstContent<limited_time_article>({
            appUid: env_validation.newt_app_uid,
            modelUid: "limited_time_article",
            query: {
                slug,
                select: ["address"],
                depth: 0,
            },
        });
        return article?.address || null;
    },
);

// 特定の limited_time_article の営業時間を取得
export const getArticleOpeningHours = cache(async (slug: string): Promise<string | null> => {
    if (!slug) return null;
    const article = await newt_client.getFirstContent<limited_time_article>({
        appUid: env_validation.newt_app_uid,
        modelUid: "limited_time_article",
        query: {
            slug,
            select: ["opening_hours"],
            depth: 0,
        },
    });
    return article?.opening_hours || null;
});

// 特定の limited_time_article の最寄り駅を取得
export const getArticleNearestStation = cache(async (slug: string): Promise<string | null> => {
    if (!slug) return null;
    const article = await newt_client.getFirstContent<limited_time_article>({
        appUid: env_validation.newt_app_uid,
        modelUid: "limited_time_article",
        query: {
            slug,
            select: ["nearest_station"],
            depth: 0,
        },
    });
    return article?.nearest_station || null;
});

// カテゴリー一覧を取得
// 記事のないカテゴリーは除外
export const getCategories = cache(async (): Promise<Category[]> => {
    // カテゴリーと記事のデータを並行して取得
    const [{ items: categories }, { items: articles }] = await Promise.all([
        newt_client.getContents<Category>({
            appUid: env_validation.newt_app_uid,
            modelUid: "category",
            query: { limit: 20 },
        }),
        newt_client.getContents<{
            category: Category;
        }>({
            appUid: env_validation.newt_app_uid,
            modelUid: "limited_time_article",
            query: {
                select: ["category"],
                // category をオブジェクト（_id を含む）で取得
                depth: 1,
                limit: 20,
            },
        }),
    ]);

    // 記事で実際に使われているカテゴリーのIDを抽出
    const categoryIdsInUse = new Set<string>();
    for (const article of articles) {
        if (article.category?._id) {
            categoryIdsInUse.add(article.category._id);
        }
    }

    // 記事で使われているカテゴリーのみ返す
    return categories.filter((category) => categoryIdsInUse.has(category._id));
});
