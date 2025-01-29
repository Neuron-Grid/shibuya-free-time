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
    const article = await getAlwaysFreeArticle(slug);
    if (!article || !article.author) return null;

    // article.authorは_idしか含まれない場合があるので、完全な情報を取得する
    const author = await newt_client.getContent<Author>({
        appUid: env_validation.newt_app_uid,
        modelUid: "author",
        contentId: article.author._id,
    });

    return author;
});

//  前のalways_free_articleを取得
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

// always_free_articleに紐づくタグ一覧とその使用回数を取得
//  フィールド名 "tag" が複数選択(配列)という前提
export const getTagsFromAlwaysFree = cache(async (): Promise<TagWithCount[]> => {
    // 全タグを取得
    const { items: tags } = await newt_client.getContents<Tag>({
        appUid: env_validation.newt_app_uid,
        modelUid: "tag",
        query: {
            limit: 50,
        },
    });

    // always_free_article のデータを取得 (tagフィールドのみ抜き出す)
    const { items: articles } = await newt_client.getContents<{
        tag: Tag[];
    }>({
        appUid: env_validation.newt_app_uid,
        modelUid: "always_free_article",
        query: {
            select: ["tag"],
            depth: 1,
            limit: 50,
        },
    });

    const tagCountMap = new Map<string, number>();

    for (const article of articles) {
        // 安全策
        if (!Array.isArray(article.tag)) continue;
        for (const tagObj of article.tag) {
            if (!tagObj?._id) continue;
            const tagId = tagObj._id;
            tagCountMap.set(tagId, (tagCountMap.get(tagId) || 0) + 1);
        }
    }

    // カウントが1以上のタグだけに絞って返す
    const tagsWithCount: TagWithCount[] = tags
        .map((tagItem) => ({
            ...tagItem,
            count: tagCountMap.get(tagItem._id) || 0,
        }))
        .filter((t) => t.count > 0);

    return tagsWithCount;
});

// カテゴリー一覧を取得
// 記事のないカテゴリーは除外
export const getCategoriesFromAlwaysFree = cache(async (): Promise<Category[]> => {
    // カテゴリーと記事を並行して取得
    const [{ items: categories }, { items: articles }] = await Promise.all([
        newt_client.getContents<Category>({
            appUid: env_validation.newt_app_uid,
            modelUid: "category",
            query: { limit: 50 },
        }),
        newt_client.getContents<{
            category: Category;
        }>({
            appUid: env_validation.newt_app_uid,
            modelUid: "always_free_article",
            query: {
                select: ["category"],
                depth: 1,
                limit: 50,
            },
        }),
    ]);

    // 実際に使われているカテゴリーの _id を抽出
    const categoryIdsInUse = new Set<string>();
    for (const article of articles) {
        if (article.category?._id) {
            categoryIdsInUse.add(article.category._id);
        }
    }

    // 記事で利用されているカテゴリのみ返す
    return categories.filter((cat) => categoryIdsInUse.has(cat._id));
});
