import { newt_client } from "@/libs/newt/newt_client";
import type { Category } from "@/types/newt/Category_type";
import type { Tag, TagWithCount } from "@/types/newt/Tag_type";
import type { always_free_article } from "@/types/newt/always_free_article";
import type { Author } from "@/types/newt/author";
import { env_validation } from "@/utils/env_validation";
import type { AppMeta, GetContentsQuery } from "newt-client-js";
import { cache } from "react";

// アプリ全体のメタデータを取得
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

export const getAuthorByArticleSlug = cache(async (slug: string): Promise<Author | null> => {
    // 記事を取得
    const article = await getAlwaysFreeArticle(slug);
    // 記事が見つからない、または記事に author 情報がない場合は null を返す
    if (!article?.author?.slug) {
        return null;
    }
    const authorData = await newt_client.getFirstContent<Author>({
        appUid: env_validation.newt_app_uid,
        modelUid: "author",
        query: {
            slug: article.author.slug,
        },
    });

    return authorData || null;
});

// 前のalways_free_articleを取得
// 例: 作成日の昇順で1つ後ろ
export const getPreviousArticle = cache(
    async (currentArticle: always_free_article): Promise<{ slug: string } | null> => {
        const { createdAt } = currentArticle._sys;

        const article = await newt_client.getFirstContent<{ slug: string }>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
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

// 次の always_free_article を取得
// 例: 作成日の降順で1つ前
export const getNextArticle = cache(
    async (currentArticle: always_free_article): Promise<{ slug: string } | null> => {
        const { createdAt } = currentArticle._sys;

        const article = await newt_client.getFirstContent<{ slug: string }>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
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

// always_free_articleに紐づくタグ一覧を取得
//  フィールド名 "tag" が複数選択(配列)という前提
export const getTagsFromAlwaysFree = cache(async (): Promise<Tag[]> => {
    const { items: tags } = await newt_client.getContents<Tag>({
        appUid: env_validation.newt_app_uid,
        modelUid: "tag",
        query: {
            limit: 20,
        },
    });

    // タグの使用回数を扱うロジックは削除して、取得したタグをそのまま返す
    return tags;
});

// カテゴリー一覧を取得
export const getCategoriesFromAlwaysFree = cache(async (): Promise<Category[]> => {
    // カテゴリーと記事を並行して取得
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
            modelUid: "always_free_article",
            query: {
                select: ["category"],
                depth: 1,
                limit: 20,
            },
        }),
    ]);

    // 全てのカテゴリーを取得
    const categoryMap = new Map<string, Category>();
    for (const category of categories) {
        categoryMap.set(category._id, category);
    }

    return categories;
});
