import { reverseGeocode } from "@/features/reverseGeocode";
import type { always_free_article } from "@/types/newt/always_free_article";
import type { limited_time_article } from "@/types/newt/limited_time_article";

type SpotType = always_free_article | limited_time_article;

const getAddresses = async (spots: SpotType[]): Promise<Record<string, string>> => {
    const addressMap: Record<string, string> = {};

    for (const spot of spots) {
        // spot.address が存在し、かつ lat/lng が数値ならジオコーディングする
        if (
            spot.address &&
            typeof spot.address.lat === "number" &&
            typeof spot.address.lng === "number"
        ) {
            const fetchedAddress = await reverseGeocode(spot.address.lat, spot.address.lng);
            addressMap[spot._id] = fetchedAddress ?? "住所を取得できませんでした";
        } else {
            addressMap[spot._id] = "住所情報がありません";
        }
    }

    return addressMap;
};

export default getAddresses;
