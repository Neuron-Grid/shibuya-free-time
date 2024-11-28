import type { Category } from "@/types/newt/category";
import type { Content, Media } from "newt-client-js";

export interface Article extends Content {
    title: string;
    slug: string;
    meta?: Articlemeta;
    body: string;
    category: Category;
    tags: string[];
}

export interface Articlemeta {
    title?: string;
    description?: string;
    ogImage?: Media;
}
