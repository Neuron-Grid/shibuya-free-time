import type { Content } from "newt-client-js";

export interface Category extends Content {
    emoji: Categoryemoji;
    name: string;
    slug: string;
    description: string;
}

export interface Categoryemoji {
    type: string;
    value: string;
}
