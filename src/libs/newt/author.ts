import { newt_client } from "@/libs/newt/newt_client";
import type { Author } from "@/types/newt/author";
import { env_validation } from "@/utils/env_validation";
import { cache } from "react";

// 全ての著者を取得
export const getAuthors = cache(async (): Promise<Author[]> => {
    const { items: authors } = await newt_client.getContents<Author>({
        appUid: env_validation.newt_app_uid,
        modelUid: "author",
        query: {
            select: ["_id", "slug", "fullName", "profileImage", "biography"],
        },
    });
    return authors;
});

// 特定のスラッグの著者を取得
export const getAuthor = cache(async (slug: string): Promise<Author | null> => {
    const author = await newt_client.getFirstContent<Author>({
        appUid: env_validation.newt_app_uid,
        modelUid: "author",
        query: {
            slug,
            select: ["_id", "slug", "fullName", "profileImage", "biography"],
        },
    });
    return author;
});
