import type { Content } from "newt-client-js";

export interface Category extends Content {
    "Category-name": string; // 必須: タイトルに利用されています。
    slug: string; // 必須: uniqueID
}

export interface CategoryWithCount extends Category {
    count: number;
}
