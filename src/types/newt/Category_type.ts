import type { Content } from "newt-client-js";

export interface Category extends Content {
    name: string; // 必須: タイトルに利用されています。
    slug: string; // 必須: uniqueID
}
