import parse, {
    type DOMNode,
    type Element as DomElement,
    type Text as DomText,
    type HTMLReactParserOptions,
} from "html-react-parser";
import React, { type JSX } from "react";

// Tailwind の typography クラスをマッピング
const classMap: { [key: string]: string } = {
    p: "prose-p",
    h1: "prose-h1",
    h2: "prose-h2",
    h3: "prose-h3",
    h4: "prose-h4",
    h5: "prose-h5",
    h6: "prose-h6",
    ul: "prose-ul",
    ol: "prose-ol",
    li: "prose-li",
    blockquote: "prose-blockquote",
    pre: "prose-pre",
    code: "prose-code",
    a: "prose-a",
    table: "prose-table",
    thead: "prose-thead",
    tbody: "prose-tbody",
    tr: "prose-tr",
    th: "prose-th",
    td: "prose-td",
    em: "prose-em",
    strong: "prose-strong",
    del: "prose-del",
};

// html-react-parser のオプション
// TypographyWrapper.tsx (抜粋)
const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode, index: number): string | JSX.Element | null => {
        if (domNode.type === "tag") {
            const el = domNode as DomElement;
            const { name, attribs, children } = el;
            const className = classMap[name] || "";

            // 1. hr タグは子要素を持ってはいけないので特別扱いする
            if (name === "hr") {
                // 余計な children を与えずに返す
                return React.createElement("hr", { ...attribs, className, key: index });
            }

            // 2. br タグの例
            if (name === "br") {
                return React.createElement("br", { key: index });
            }

            // 3. それ以外のタグ
            const content = children?.map((child, idx) => {
                if (child.type === "tag" || child.type === "text") {
                    return options.replace?.(child, idx) ?? null;
                }
                return null;
            }) as React.ReactNode[];
            return React.createElement(name, { ...attribs, className, key: index }, content);
        }

        // テキストノードならそのまま返す
        if (domNode.type === "text") {
            const textNode = domNode as DomText;
            return textNode.data;
        }

        return null;
    },
};

type TypographyWrapperProps = {
    htmlContent: string;
};

const TypographyWrapper = ({ htmlContent }: TypographyWrapperProps) => {
    return <>{parse(htmlContent, options)}</>;
};

export default TypographyWrapper;
