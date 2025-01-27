import {
    getCategoriesFromAlwaysFree as getAlwaysFreeCategories,
    getTagsFromAlwaysFree as getAlwaysFreeTags,
} from "@/libs/newt/always_free_article";
import {
    getCategories as getLimitedCategories,
    getTags as getLimitedTags,
} from "@/libs/newt/limited_time_article";
import type { Category } from "@/types/newt/Category_type";
import type { TagWithCount } from "@/types/newt/Tag_type";
import { cache } from "react";

// タグ配列を ID でマージし、count を合算した配列を返す
function unifyTags(allTags: TagWithCount[]): TagWithCount[] {
    const map = allTags.reduce<Map<string, TagWithCount>>((acc, tag) => {
        const existing = acc.get(tag._id);
        if (existing) {
            existing.count += tag.count;
        } else {
            acc.set(tag._id, { ...tag });
        }
        return acc;
    }, new Map());

    return Array.from(map.values());
}

// カテゴリ配列を ID で重複排除して返す
function unifyCategories(allCategories: Category[]): Category[] {
    const map = allCategories.reduce<Map<string, Category>>((acc, cat) => {
        acc.set(cat._id, cat);
        return acc;
    }, new Map());
    return Array.from(map.values());
}

// 期間限定記事のタグ＋常時無料記事のタグをまとめて返す
export const getUnifiedTags = cache(async (): Promise<TagWithCount[]> => {
    // getLimitedTags(), getAlwaysFreeTags() は
    // それぞれ単一リレーションのタグを集計し、最終的に TagWithCount[] を返す関数
    const [limitedTags, alwaysFreeTags] = await Promise.all([
        getLimitedTags(),
        getAlwaysFreeTags(),
    ]);
    return unifyTags([...limitedTags, ...alwaysFreeTags]);
});

// 期間限定記事のカテゴリ＋常時無料記事のカテゴリをまとめて返す
export const getUnifiedCategories = cache(async (): Promise<Category[]> => {
    // getLimitedCategories(), getAlwaysFreeCategories() は
    // それぞれ単一リレーションのカテゴリを集計し、最終的に Category[] を返す関数
    const [limitedCategories, alwaysFreeCategories] = await Promise.all([
        getLimitedCategories(),
        getAlwaysFreeCategories(),
    ]);
    return unifyCategories([...limitedCategories, ...alwaysFreeCategories]);
});

// タグとカテゴリをまとめて取得
export const getAllTagsAndCategories = cache(async () => {
    const [tags, categories] = await Promise.all([getUnifiedTags(), getUnifiedCategories()]);
    return {
        tags,
        categories,
    };
});
