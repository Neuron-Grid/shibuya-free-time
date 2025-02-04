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

// Tag[]が引数として渡されたときに、重複を取り除いて返す
function unifyTags(allTags: Tag[]): Tag[] {
    const map = new Map<string, Tag>();
    for (const tag of allTags) {
        map.set(tag._id, tag);
    }
    return Array.from(map.values());
}

// タグをまとめて取得 (Tag[] を返す)
export const getUnifiedTags = cache(async (): Promise<Tag[]> => {
    const [limitedTags, alwaysFreeTags] = await Promise.all([
        getLimitedTags(), // Promise<Tag[]>
        getAlwaysFreeTags(), // Promise<Tag[]>
    ]);
    return unifyTags([...limitedTags, ...alwaysFreeTags]);
});

// カテゴリをまとめて取得 (Category[] を返す)
export const getUnifiedCategories = cache(async (): Promise<Category[]> => {
    const [limitedCategories, alwaysFreeCategories] = await Promise.all([
        getLimitedCategories(),
        getAlwaysFreeCategories(),
    ]);
    return [...limitedCategories, ...alwaysFreeCategories];
});

// タグとカテゴリを両方取得
export const getAllTagsAndCategories = cache(async () => {
    const [tags, categories] = await Promise.all([getUnifiedTags(), getUnifiedCategories()]);
    return { tags, categories };
});
