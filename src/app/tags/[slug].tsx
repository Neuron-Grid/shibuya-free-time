import { getTags } from "@/libs/always_free/newt";
import React from "react";

const TagsPage = async () => {
    const tags = await getTags();

    return (
        <div className="container mx-auto p-4">
            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">タグ一覧</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tags.map((tag) => (
                        <li
                            key={tag._id}
                            className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-lg font-semibold mb-2">{tag.name}</h3>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Slug:</span> {tag.slug}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">使用回数:</span> {tag.count}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TagsPage;
