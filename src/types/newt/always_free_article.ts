import type { Category } from "@/types/newt/Category_type";
import type { Tag } from "@/types/newt/Tag_type";
import type { Author } from "@/types/newt/author";
import type { Address } from "@/types/newt/shared/address";
import type { meta } from "@/types/newt/shared/meta";
import type { Content, Media } from "newt-client-js";

export interface always_free_article extends Content {
    title: string;
    slug: string;
    author: Author;
    image?: Media;
    body: string;
    nearest_station: string;
    opening_hours: string;
    category: Category;
    tags: Tag[];
    address: Address;
    start_day: string;
    end_day: string;
    meta?: meta;
}
