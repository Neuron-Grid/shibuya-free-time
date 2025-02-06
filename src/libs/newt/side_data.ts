import {
    getCategoriesFromAlwaysFree as getAlwaysFreeCategories,
    getTagsFromAlwaysFree as getAlwaysFreeTags,
} from "@/libs/newt/afa/always_free_article";
import {
    getCategories as getLimitedCategories,
    getTags as getLimitedTags,
} from "@/libs/newt/lta/limited_time_article";
import type { Category } from "@/types/newt/Category_type";
import type { Tag } from "@/types/newt/Tag_type";
import { cache } from "react";

// slug でカテゴリーを一意化するユーティリティ関数
function unifyCategoriesBySlug(allCategories: Category[]): Category[] {
    const map = new Map<string, Category>();
    for (const category of allCategories) {
        // key に slug を使用
        map.set(category.slug, category);
    }
    // Map から値のみ取り出して配列に変換
    return Array.from(map.values());
}

// slug でタグを一意化するユーティリティ関数
function unifyTagsBySlug(allTags: Tag[]): Tag[] {
    const map = new Map<string, Tag>();
    for (const tag of allTags) {
        // key に slug を使用
        map.set(tag.slug, tag);
    }
    return Array.from(map.values());
}

// タグをまとめて取得 (Tag[] を返す)
export const getUnifiedTags = cache(async (): Promise<Tag[]> => {
    const [limitedTags, alwaysFreeTags] = await Promise.all([
        getLimitedTags(), // 期間限定
        getAlwaysFreeTags(), // 常時無料
    ]);
    // slug で重複除外
    const allTags = [...limitedTags, ...alwaysFreeTags];
    return unifyTagsBySlug(allTags);
});

// カテゴリをまとめて取得 (Category[] を返す)
export const getUnifiedCategories = cache(async (): Promise<Category[]> => {
    const [limitedCategories, alwaysFreeCategories] = await Promise.all([
        getLimitedCategories(), // 期間限定
        getAlwaysFreeCategories(), // 常時無料
    ]);

    // 連結したあと、slug で一意化
    const allCats = [...limitedCategories, ...alwaysFreeCategories];
    return unifyCategoriesBySlug(allCats);
});

// タグとカテゴリを両方取得し、まとめたオブジェクトとして返す
export const getAllTagsAndCategories = cache(async () => {
    const [tags, categories] = await Promise.all([getUnifiedTags(), getUnifiedCategories()]);
    return { tags, categories };
});
