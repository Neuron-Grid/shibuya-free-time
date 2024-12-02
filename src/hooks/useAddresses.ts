import { reverseGeocode } from "@/libs/geocode";
import type { Spot } from "@/types/newt/spot";

const getAddresses = async (spots: Spot[]) => {
    const addressMap: Record<string, string> = {};
    for (const spot of spots) {
        if (spot.address) {
            const address = await reverseGeocode(spot.address.lat, spot.address.lng);
            addressMap[spot._id] = address || "住所が取得できませんでした";
        }
    }
    return addressMap;
};

export default getAddresses;
