"use client";

import React from "react";

export default function DateDisplay({ dateString }: DateDisplayProps) {
    if (!dateString) {
        return <span>-</span>;
    }

    // まず Date オブジェクトを生成
    const date = new Date(dateString);

    // Intl.DateTimeFormat で「日本時間 & 24時間表記 & 数字2桁固定」を指定
    const dtf = new Intl.DateTimeFormat("ja-JP", {
        timeZone: "Asia/Tokyo", // JST 固定
        hour12: false, // 24時間表記
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    // formatToParts で日付の各構成要素を分解して取得
    const parts = dtf.formatToParts(date);
    const year = parts.find((p) => p.type === "year")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    const hour = parts.find((p) => p.type === "hour")?.value ?? "";
    const minute = parts.find((p) => p.type === "minute")?.value ?? "";
    const second = parts.find((p) => p.type === "second")?.value ?? "";

    // 日本語でのフォーマット文字列を組み立てる
    const formatted = `${year}年${month}月${day}日 ${hour}時${minute}分${second}秒`;

    return <span>{formatted}</span>;
}

type DateDisplayProps = {
    dateString?: string | null;
};
