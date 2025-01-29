import { getAuthors } from "@/libs/newt/author";
import Link from "next/link";
import React from "react";

export default async function AuthorPage() {
    const authors = await getAuthors();

    return (
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="mt-6 mb-4 text-2xl sm:text-3xl">著者一覧</h1>
                <ul className="flex overflow-x-auto whitespace-nowrap space-x-4 py-2">
                    {authors.map((author) => (
                        <li key={author._id} className="inline-block">
                            <Link
                                href={`/public/author/${author.slug}`}
                                className="text-xl text-light-accent dark:text-dark-accent hover:underline"
                            >
                                {author.fullName}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}