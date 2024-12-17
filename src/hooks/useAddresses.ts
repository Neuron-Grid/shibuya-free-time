// 住所取得ロジックの切り出し
import { reverseGeocode } from "@/features/reverseGeocode";
import type { Spot } from "@/types/newt/Spot";

const getAddresses = async (spots: Spot[]) => {
    const addressMap: Record<string, string> = {};
    for (const spot of spots) {
        if (
            spot.address &&
            typeof spot.address.lat === "number" &&
            typeof spot.address.lng === "number"
        ) {
            const fetchedAddress = await reverseGeocode(spot.address.lat, spot.address.lng);
            addressMap[spot._id] = fetchedAddress || "住所を取得できませんでした";
        } else {
            addressMap[spot._id] = "住所情報がありません";
        }
    }
    return addressMap;
};

export default getAddresses;
