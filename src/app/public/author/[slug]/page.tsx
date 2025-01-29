import { getAuthor } from "@/libs/newt/author";
import { notFound } from "next/navigation";
import Image from "next/image";
import React from "react";
import { MdImageNotSupported } from "react-icons/md";
import TypographyWrapper from "@/components/partials/TypographyWrapper";

export default async function AuthorDetailPage(props: AuthorDetailPageProps) {
    const { slug } = await props.params;
    const author = await getAuthor(slug);

    if (!author) {
        notFound();
    }

    return (
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="mt-6 mb-4 text-2xl sm:text-3xl">
                    著者: {author.fullName}
                </h1>

                <div className="my-4 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 relative overflow-hidden rounded">
                    {author.profileImage ? (
                        <Image
                            src={author.profileImage.src}
                            alt={author.fullName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 192px"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-grayscale-100 dark:bg-grayscale-800">
                            <MdImageNotSupported size={60} color="#CCCCCC" />
                        </div>
                    )}
                </div>

                <div className="mt-8 prose prose-lg dark:prose-invert">
                    <TypographyWrapper htmlContent={author.biography} />
                </div>
            </div>
        </div>
    );
}

type AuthorDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};
