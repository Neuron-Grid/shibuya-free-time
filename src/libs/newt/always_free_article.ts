import type { Category } from "@/types/newt/Category_type";
import type { Tag, TagWithCount } from "@/types/newt/Tag_type";
import type { always_free_article } from "@/types/newt/always_free_article";
import type { AppMeta, GetContentsQuery } from "newt-client-js";

import { newt_client } from "@/libs/newt/newt_client";
import { env_validation } from "@/utils/env_validation";
import { cache } from "react";

// アプリケーションのメタデータを取得
export const getApp = cache(async (): Promise<AppMeta> => {
    const app = await newt_client.getApp({
        appUid: env_validation.newt_app_uid,
    });
    return app;
});

// always_free_article の一覧を取得
export const getAlwaysFreeArticles = cache(
    async (
        query?: GetContentsQuery,
    ): Promise<{ articles: always_free_article[]; total: number }> => {
        const { items: articles, total } = await newt_client.getContents<always_free_article>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
            query: {
                depth: 2,
                ...query,
            },
        });

        return { articles, total };
    },
);

// 特定のスラッグの always_free_article を取得
export const getAlwaysFreeArticle = cache(
    async (slug: string): Promise<always_free_article | null> => {
        if (!slug) return null;

        const article = await newt_client.getFirstContent<always_free_article>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
            query: {
                depth: 2,
                slug,
            },
        });

        return article || null;
    },
);

// 前の always_free_article を取得
export const getPreviousAlwaysFreeArticle = cache(
    async (current: always_free_article): Promise<{ slug: string } | null> => {
        const { createdAt } = current._sys;

        const article = await newt_client.getFirstContent<{ slug: string }>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
            query: {
                select: ["slug"],
                "_sys.createdAt": {
                    gt: createdAt, // より新しいもの
                },
                order: ["_sys.createdAt"], // 昇順
            },
        });

        return article || null;
    },
);

// 次の always_free_article を取得
export const getNextAlwaysFreeArticle = cache(
    async (current: always_free_article): Promise<{ slug: string } | null> => {
        const { createdAt } = current._sys;

        const article = await newt_client.getFirstContent<{ slug: string }>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
            query: {
                select: ["slug"],
                "_sys.createdAt": {
                    lt: createdAt, // より古いもの
                },
                order: ["-_sys.createdAt"], // 降順
            },
        });

        return article || null;
    },
);

// タグ一覧を取得し、実際に使用されているタグのみをカウント付きで返す
export const getTags = cache(async (): Promise<TagWithCount[]> => {
    // タグを取得
    const { items: tags } = await newt_client.getContents<Tag>({
        appUid: env_validation.newt_app_uid,
        modelUid: "tag",
        query: {
            limit: 50, // 必要に応じて調整
        },
    });

    // always_free_articleでのタグ使用状況を取得
    const { items: articles } = await newt_client.getContents<always_free_article>({
        appUid: env_validation.newt_app_uid,
        modelUid: "always_free_article",
        query: {
            select: ["tags"],
            depth: 1, // Tag がオブジェクト参照の場合は 1 以上
            limit: 50, // 必要に応じて調整
        },
    });

    // タグの使用回数をマップに集計
    const tagCountMap = new Map<string, number>();
    for (const article of articles) {
        for (const tagObj of article.tags) {
            if (tagObj?._id) {
                const tagId = tagObj._id;
                tagCountMap.set(tagId, (tagCountMap.get(tagId) || 0) + 1);
            }
        }
    }

    // 使用回数 > 0 のタグのみ抽出
    const tagsWithCount: TagWithCount[] = tags
        .map((tag) => ({
            ...tag,
            count: tagCountMap.get(tag._id) || 0,
        }))
        .filter((tag) => tag.count > 0);

    return tagsWithCount;
});

// 特定のスラッグのタグ情報を取得
export const getTagBySlug = cache(async (slug: string): Promise<Tag | null> => {
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

// 住所を取得
export const getAfaAddress = cache(
    async (slug: string): Promise<always_free_article["address"] | null> => {
        if (!slug) return null;

        const article = await newt_client.getFirstContent<always_free_article>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
            query: {
                slug,
                select: ["address"],
                depth: 0,
            },
        });

        return article?.address || null;
    },
);

// 営業時間を取得
export const getAfaOpeningHours = cache(
    async (slug: string): Promise<always_free_article["opening_hours"] | null> => {
        if (!slug) return null;

        const article = await newt_client.getFirstContent<always_free_article>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
            query: {
                slug,
                select: ["opening_hours"],
                depth: 0,
            },
        });

        return article?.opening_hours || null;
    },
);

// 最寄駅を取得
export const getAfaNearestStation = cache(
    async (slug: string): Promise<always_free_article["nearest_station"] | null> => {
        if (!slug) return null;

        const article = await newt_client.getFirstContent<always_free_article>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
            query: {
                slug,
                select: ["nearest_station"],
                depth: 0,
            },
        });

        return article?.nearest_station || null;
    },
);

// カテゴリー一覧を取得（記事のないカテゴリーは除外）
export const getCategories = cache(async (): Promise<Category[]> => {
    // カテゴリーと always_free_article のデータを並行で取得
    const [{ items: categories }, { items: articles }] = await Promise.all([
        newt_client.getContents<Category>({
            appUid: env_validation.newt_app_uid,
            modelUid: "category",
            query: { limit: 50 },
        }),
        newt_client.getContents<always_free_article>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
            query: {
                select: ["category"],
                depth: 1,
                limit: 50,
            },
        }),
    ]);

    // 使用されているカテゴリーIDを抽出
    const categoryIdsWithArticles = new Set<string>();
    for (const article of articles) {
        // 配列の中の各カテゴリーに _id が存在するかチェック
        for (const cat of article.category || []) {
            if (cat?._id) {
                categoryIdsWithArticles.add(cat._id);
            }
        }
    }

    // 実際に記事で使われているカテゴリーのみ返す
    return categories.filter((category) => categoryIdsWithArticles.has(category._id));
});
