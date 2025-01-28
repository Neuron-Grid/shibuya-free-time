import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export default function SanitizedContent({ content }: SanitizedContentProps) {
    return (
        <div className="prose">
            <ReactMarkdown
                // GFM拡張
                remarkPlugins={[remarkGfm]}
                // 悪意のあるHTMLを取り除く
                rehypePlugins={[rehypeSanitize]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

interface SanitizedContentProps {
    content: string;
}
