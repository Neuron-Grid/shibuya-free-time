"use client";

import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";

// 安全にサニタイズされたHTMLをレンダリングするためのコンポーネント
const SanitizedContent = ({ html }: { html: string }) => {
    // サニタイズされたHTMLを保持する状態
    const [sanitizedHtml, setSanitizedHtml] = useState<string>("");

    // HTMLのサニタイズ処理
    useEffect(() => {
        const cleanHtml = DOMPurify.sanitize(html);
        setSanitizedHtml(cleanHtml);
    }, [html]);

    // サニタイズされたHTMLをパースし、React要素としてレンダリング
    const renderSanitizedHtml = () => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(sanitizedHtml, "text/html");

        // パースしたHTMLをReact要素に変換
        return Array.from(doc.body.childNodes).map((node) => {
            const uniqueKey = node.textContent || `node-${Math.random()}`;

            if (node.nodeType === Node.TEXT_NODE) {
                // テキストノードをスパン要素として返す
                return <span key={uniqueKey}>{node.textContent}</span>;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                // HTML要素をReact要素として返す
                const element = node as HTMLElement;
                return React.createElement(
                    element.tagName.toLowerCase(),
                    { key: uniqueKey },
                    element.textContent,
                );
            }

            // その他のノードは無視
            return null;
        });
    };

    // サニタイズされたHTMLを表示する
    return <div className="prose">{renderSanitizedHtml()}</div>;
};

export default SanitizedContent;
