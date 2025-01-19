"use client";

import { formatDate } from "@/libs/date";
import { DateTime } from "luxon";
import React from "react";

export default function DateDisplay({ dateString }: DateDisplayProps) {
    if (!dateString) {
        return <span>-</span>;
    }
    const datePart = formatDate(dateString);
    const dt = DateTime.fromISO(dateString).setZone("Asia/Tokyo");
    const hour = dt.toFormat("HH");
    const minute = dt.toFormat("mm");
    const second = dt.toFormat("ss");
    const formatted = `${datePart} ${hour}時${minute}分${second}秒`;
    return <span>{formatted}</span>;
}

type DateDisplayProps = {
    dateString?: string | null;
};
