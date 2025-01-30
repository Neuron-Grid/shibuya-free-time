import type { Category } from "@/types/newt/Category_type";
import type { Tag } from "@/types/newt/Tag_type";
import type { Author } from "@/types/newt/author";
import type { Address } from "@/types/newt/shared/address";
import type { meta } from "@/types/newt/shared/meta";
import type { Content, Media } from "newt-client-js";

export interface limited_time_article extends Content {
    title: string;
    slug: string;
    image?: Media;
    author: Author;
    body: string;
    tags: Tag[];
    category: Category;
    address: Address;
    start_day: string;
    end_day: string;
    nearest_station: string;
    opening_hours?: string;
    meta?: meta;
}
