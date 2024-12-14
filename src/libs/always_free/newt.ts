import type { Category } from "@/types/newt/category";
import type { Spot } from "@/types/newt/spot";
import type { Tag, TagWithCount } from "@/types/newt/tag";
import { env_validation } from "@/utils/env_validation";
import { createClient } from "newt-client-js";
import type { AppMeta, GetContentsQuery } from "newt-client-js";
import { cache } from "react";

// Newtのクライアントを作成
const client = createClient({
    spaceUid: env_validation.newt_space_Uid,
    token: env_validation.newt_token,
    apiType: env_validation.newt_api_Type,
});

// アプリケーションのメタデータを取得
export const getApp = cache(async (): Promise<AppMeta> => {
    const app = await client.getApp({
        appUid: env_validation.newt_app_Uid,
    });
    return app;
});

// スポット一覧を取得
export const getSpots = cache(
    async (query?: GetContentsQuery): Promise<{ spots: Spot[]; total: number }> => {
        const { items: spots, total } = await client.getContents<Spot>({
            appUid: env_validation.newt_app_Uid,
            modelUid: "spot",
            query: {
                depth: 2,
                ...query,
            },
        });
        return { spots, total };
    },
);

// 特定のスラッグのスポットを取得
export const getSpot = cache(async (slug: string): Promise<Spot | null> => {
    if (!slug) return null;
    const spot = await client.getFirstContent<Spot>({
        appUid: env_validation.newt_app_Uid,
        modelUid: "spot",
        query: {
            depth: 2,
            slug,
        },
    });
    return spot || null;
});

// 前のスポットを取得
export const getPreviousSpot = cache(
    async (currentSpot: Spot): Promise<{ slug: string } | null> => {
        const { createdAt } = currentSpot._sys;
        const spot = await client.getFirstContent<{ slug: string }>({
            appUid: env_validation.newt_app_Uid,
            modelUid: "spot",
            query: {
                select: ["slug"],
                "_sys.createdAt": {
                    gt: createdAt,
                },
                order: ["_sys.createdAt"],
            },
        });
        return spot || null;
    },
);

// 次のスポットを取得
export const getNextSpot = cache(async (currentSpot: Spot): Promise<{ slug: string } | null> => {
    const { createdAt } = currentSpot._sys;
    const spot = await client.getFirstContent<{ slug: string }>({
        appUid: env_validation.newt_app_Uid,
        modelUid: "spot",
        query: {
            select: ["slug"],
            "_sys.createdAt": {
                lt: createdAt,
            },
            order: ["-_sys.createdAt"],
        },
    });
    return spot || null;
});

export const getTags = cache(async (): Promise<TagWithCount[]> => {
    // タグを取得
    const { items: tags } = await client.getContents<Tag>({
        appUid: env_validation.newt_app_Uid,
        modelUid: "tag",
        query: {
            limit: 20,
        },
    });

    // スポットのタグ情報を取得
    const { items: spots } = await client.getContents<{ tags: string[] }>({
        appUid: env_validation.newt_app_Uid,
        modelUid: "spot",
        query: {
            select: ["tags"],
            depth: 0,
            limit: 20,
        },
    });

    // タグの使用回数をマップに集計
    const tagCountMap = new Map<string, number>();
    for (const { tags: spotTags } of spots) {
        for (const tagId of spotTags) {
            tagCountMap.set(tagId, (tagCountMap.get(tagId) || 0) + 1);
        }
    }

    // 使用回数が1以上のタグのみ抽出
    const tagsWithCount: TagWithCount[] = tags
        .map((tag) => ({
            ...tag,
            count: tagCountMap.get(tag._id) || 0,
        }))
        .filter((tag) => tag.count > 0);
    return tagsWithCount;
});

// 特定のスラッグのタグを取得
export const getTagslug = cache(async (slug: string): Promise<Tag | null> => {
    if (!slug) return null;
    const tag = await client.getFirstContent<Tag>({
        appUid: env_validation.newt_app_Uid,
        modelUid: "tag",
        query: {
            slug,
        },
    });
    return tag || null;
});

// 住所を取得
export const getSpotAddress = cache(
    async (slug: string): Promise<{ lat: number; lng: number } | null> => {
        if (!slug) return null;
        const spot = await client.getFirstContent<Spot>({
            appUid: env_validation.newt_app_Uid,
            modelUid: "spot",
            query: {
                slug,
                select: ["address"],
                depth: 0,
            },
        });
        return spot?.address || null;
    },
);

// 営業時間を取得
export const getSpotOpeningHours = cache(async (slug: string): Promise<string | null> => {
    if (!slug) return null;
    const spot = await client.getFirstContent<Spot>({
        appUid: env_validation.newt_app_Uid,
        modelUid: "spot",
        query: {
            slug,
            select: ["opening_hours"],
            depth: 0,
        },
    });
    return spot?.opening_hours || null;
});

// 最寄駅を取得
export const getSpotNearestStation = cache(async (slug: string): Promise<string | null> => {
    if (!slug) return null;
    const spot = await client.getFirstContent<Spot>({
        appUid: env_validation.newt_app_Uid,
        modelUid: "spot",
        query: {
            slug,
            select: ["nearest_station"],
            depth: 0,
        },
    });
    return spot?.nearest_station || null;
});

// カテゴリー一覧を取得（記事のないカテゴリーは除外）
export const getCategories = cache(async (): Promise<Category[]> => {
    // カテゴリーとスポットのデータを並行して取得
    const [{ items: categories }, { items: spots }] = await Promise.all([
        client.getContents<Category>({
            appUid: env_validation.newt_app_Uid,
            modelUid: "category",
            query: { limit: 20 },
        }),
        client.getContents<{ category: string }>({
            appUid: env_validation.newt_app_Uid,
            modelUid: "spot",
            query: {
                select: ["category"],
                depth: 0,
                limit: 20,
            },
        }),
    ]);

    // カテゴリーIDの使用回数をセット化してフィルタリング
    const categoryIdsWithSpots = new Set(spots.map((spot) => spot.category).filter(Boolean));

    // 記事のあるカテゴリーのみを返す
    return categories.filter((category) => categoryIdsWithSpots.has(category._id));
});
