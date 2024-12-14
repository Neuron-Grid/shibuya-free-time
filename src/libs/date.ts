import { DateTime } from "luxon";

export const formatDate = (dateStr: string) => {
    return DateTime.fromISO(dateStr)
        .setZone("Asia/Tokyo")
        .setLocale("ja")
        .toLocaleString({ year: "numeric", month: "long", day: "numeric" });
};
